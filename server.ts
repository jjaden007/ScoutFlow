import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "scoutflow-secret-key-123";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

const db = new Database("leads.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_paid INTEGER DEFAULT 0,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    location TEXT,
    website TEXT,
    email TEXT,
    phone TEXT,
    rating REAL,
    address TEXT,
    status TEXT DEFAULT 'new',
    audit_report TEXT,
    outreach_message TEXT,
    action_plan TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_profile (
    user_id TEXT PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    business_name TEXT,
    business_description TEXT,
    business_website TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      req.userId = decoded.userId;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    const { email, password } = req.body;
    const id = Math.random().toString(36).substring(2, 15);
    const passwordHash = await bcrypt.hash(password, 10);
    try {
      db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)").run(id, email, passwordHash);
      const token = jwt.sign({ userId: id }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      res.json({ user: { id, email, is_paid: 0 } });
    } catch (err: any) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
    res.json({ user: { id: user.id, email: user.email, is_paid: user.is_paid } });
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json(null);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = db.prepare("SELECT id, email, is_paid FROM users WHERE id = ?").get(decoded.userId) as any;
      res.json(user || null);
    } catch (err) {
      res.json(null);
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  // Stripe Routes
  app.post("/api/stripe/create-checkout-session", authenticate, async (req: any, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId) as any;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ScoutFlow Pro Membership",
              description: "Full access to AI Prospector, Digital Audits, and Outreach tools.",
            },
            unit_amount: 2000,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.APP_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/pricing`,
      customer_email: user.email,
      metadata: { userId: user.id },
    });
    res.json({ url: session.url });
  });

  // Stripe Webhook (Simplified for demo, in production use stripe.webhooks.constructEvent)
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
    const event = req.body;
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      db.prepare("UPDATE users SET is_paid = 1, stripe_customer_id = ?, stripe_subscription_id = ? WHERE id = ?")
        .run(session.customer, session.subscription, userId);
    }
    res.json({ received: true });
  });

  // User Profile Routes
  app.get("/api/profile", authenticate, (req: any, res) => {
    const profile = db.prepare("SELECT * FROM user_profile WHERE user_id = ?").get(req.userId);
    res.json(profile || null);
  });

  app.post("/api/profile", authenticate, (req: any, res) => {
    const { full_name, email, business_name, business_description, business_website } = req.body;
    const existing = db.prepare("SELECT user_id FROM user_profile WHERE user_id = ?").get(req.userId);
    
    if (existing) {
      db.prepare(`
        UPDATE user_profile 
        SET full_name = ?, email = ?, business_name = ?, business_description = ?, business_website = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ?
      `).run(full_name, email, business_name, business_description, business_website, req.userId);
    } else {
      db.prepare(`
        INSERT INTO user_profile (user_id, full_name, email, business_name, business_description, business_website) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(req.userId, full_name, email, business_name, business_description, business_website);
    }
    res.json({ success: true });
  });

  // API Routes
  app.get("/api/leads", authenticate, (req: any, res) => {
    const leads = db.prepare("SELECT * FROM leads WHERE user_id = ? ORDER BY created_at DESC").all(req.userId);
    res.json(leads);
  });

  app.post("/api/leads", authenticate, (req: any, res) => {
    const { id, name, category, location, website, email, phone, rating, address } = req.body;
    try {
      const insert = db.prepare(`
        INSERT INTO leads (id, user_id, name, category, location, website, email, phone, rating, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run(id, req.userId, name, category, location, website, email, phone, rating, address);
      res.status(201).json({ success: true });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: "Lead already exists" });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.patch("/api/leads/:id", authenticate, (req: any, res) => {
    const { id } = req.params;
    const { name, website, email, location, status, audit_report, outreach_message, action_plan } = req.body;
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push("name = ?"); values.push(name); }
    if (website) { updates.push("website = ?"); values.push(website); }
    if (email) { updates.push("email = ?"); values.push(email); }
    if (location) { updates.push("location = ?"); values.push(location); }
    if (status) { updates.push("status = ?"); values.push(status); }
    if (audit_report) { updates.push("audit_report = ?"); values.push(audit_report); }
    if (outreach_message) { updates.push("outreach_message = ?"); values.push(outreach_message); }
    if (action_plan) { updates.push("action_plan = ?"); values.push(action_plan); }

    if (updates.length === 0) return res.status(400).json({ error: "No updates provided" });

    values.push(req.userId, id);
    const sql = `UPDATE leads SET ${updates.join(", ")} WHERE user_id = ? AND id = ?`;
    db.prepare(sql).run(...values);
    res.json({ success: true });
  });

  app.delete("/api/leads/:id", authenticate, (req: any, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM leads WHERE user_id = ? AND id = ?").run(req.userId, id);
    res.json({ success: true });
  });

  // Email Sending Route
  app.post("/api/send-email", authenticate, async (req: any, res) => {
    const { to, subject, body } = req.body;
    
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(400).json({ 
        error: "SMTP settings not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in environment variables." 
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text: body,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Email error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
