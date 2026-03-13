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
import crypto from "crypto";
import { google } from "googleapis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "scoutflow-secret-key-123";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "scoutflow-encryption-key-32-char"; // Must be 32 chars
const IV_LENGTH = 16;

function encrypt(text: string) {
  if (!text) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text: string) {
  if (!text) return "";
  try {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift()!, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    return "";
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

const googleOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL}/api/auth/google/callback`
);

const db = new Database("leads.db");
console.log("Database connected successfully");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_paid INTEGER DEFAULT 0,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    google_access_token TEXT,
    google_refresh_token TEXT,
    google_token_expiry INTEGER,
    google_email TEXT,
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

  CREATE TABLE IF NOT EXISTS user_smtp_settings (
    user_id TEXT PRIMARY KEY,
    host TEXT NOT NULL,
    port INTEGER NOT NULL,
    user TEXT NOT NULL,
    pass TEXT NOT NULL,
    from_email TEXT,
    secure INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

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
    console.log("Signup request received:", req.body.email);
    const { email, password } = req.body;
    const id = Math.random().toString(36).substring(2, 15);
    try {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)").run(id, email, passwordHash);
      const token = jwt.sign({ userId: id }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      res.json({ user: { id, email, is_paid: 0 } });
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.message && err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(400).json({ error: err.message || "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    console.log("Login request received:", req.body.email);
    const { email, password } = req.body;
    try {
      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      res.json({ user: { id: user.id, email: user.email, is_paid: user.is_paid } });
    } catch (err: any) {
      console.error("Login error:", err);
      res.status(400).json({ error: err.message || "Login failed" });
    }
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
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder") {
      return res.status(400).json({ 
        error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables." 
      });
    }

    try {
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
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
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

  // Google OAuth Routes
  app.get("/api/auth/google/url", authenticate, (req: any, res) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(400).json({ 
        error: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables." 
      });
    }
    const url = googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/gmail.send"
      ],
      prompt: "consent",
      state: "connect"
    });
    res.json({ url });
  });

  app.get("/api/auth/google/login-url", (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(400).json({ 
        error: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables." 
      });
    }
    const url = googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
      ],
      state: "login"
    });
    res.json({ url });
  });

  app.get("/api/auth/google/callback", async (req: any, res) => {
    const { code, state } = req.query;
    try {
      const { tokens } = await googleOAuth2Client.getToken(code as string);
      googleOAuth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: "v2", auth: googleOAuth2Client });
      const { data } = await oauth2.userinfo.get();

      if (state === "login") {
        let user = db.prepare("SELECT * FROM users WHERE email = ?").get(data.email) as any;
        if (!user) {
          const id = Math.random().toString(36).substring(2, 15);
          const salt = bcrypt.genSaltSync(10);
          const passwordHash = bcrypt.hashSync(Math.random().toString(36), salt);
          db.prepare("INSERT INTO users (id, email, password_hash, google_email) VALUES (?, ?, ?, ?)").run(id, data.email, passwordHash, data.email);
          user = { id, email: data.email, is_paid: 0 };
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

        res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage({ 
                  type: 'GOOGLE_LOGIN_SUCCESS', 
                  user: ${JSON.stringify({ id: user.id, email: user.email, is_paid: user.is_paid })} 
                }, '*');
                window.close();
              </script>
            </body>
          </html>
        `);
        return;
      }

      const token = req.cookies.token;
      if (!token) throw new Error("Not authenticated");
      
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const userId = decoded.userId;

      db.prepare(`
        UPDATE users 
        SET google_access_token = ?, google_refresh_token = ?, google_token_expiry = ?, google_email = ?
        WHERE id = ?
      `).run(
        tokens.access_token,
        tokens.refresh_token,
        tokens.expiry_date,
        data.email,
        userId
      );

      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
              window.close();
            </script>
            <p>Authentication successful. You can close this window.</p>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.get("/api/auth/google/status", authenticate, (req: any, res) => {
    const user = db.prepare("SELECT google_email FROM users WHERE id = ?").get(req.userId) as any;
    res.json({ connected: !!user?.google_email, email: user?.google_email });
  });

  app.post("/api/auth/google/disconnect", authenticate, (req: any, res) => {
    db.prepare(`
      UPDATE users 
      SET google_access_token = NULL, google_refresh_token = NULL, google_token_expiry = NULL, google_email = NULL
      WHERE id = ?
    `).run(req.userId);
    res.json({ success: true });
  });

  // SMTP Settings Routes
  app.get("/api/smtp-settings", authenticate, (req: any, res) => {
    const settings = db.prepare("SELECT * FROM user_smtp_settings WHERE user_id = ?").get(req.userId) as any;
    if (settings) {
      // Don't return the encrypted password, just a placeholder if it exists
      res.json({
        ...settings,
        pass: settings.pass ? "********" : ""
      });
    } else {
      res.json(null);
    }
  });

  app.post("/api/smtp-settings", authenticate, (req: any, res) => {
    const { host, port, user, pass, from_email, secure } = req.body;
    const existing = db.prepare("SELECT user_id, pass FROM user_smtp_settings WHERE user_id = ?").get(req.userId) as any;
    
    // If pass is "********", it means the user didn't change it
    const finalPass = pass === "********" && existing ? existing.pass : encrypt(pass);

    if (existing) {
      db.prepare(`
        UPDATE user_smtp_settings 
        SET host = ?, port = ?, user = ?, pass = ?, from_email = ?, secure = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ?
      `).run(host, port, user, finalPass, from_email, secure ? 1 : 0, req.userId);
    } else {
      db.prepare(`
        INSERT INTO user_smtp_settings (user_id, host, port, user, pass, from_email, secure) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(req.userId, host, port, user, finalPass, from_email, secure ? 1 : 0);
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
    
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId) as any;

    // Try Gmail API first if connected
    if (user.google_access_token && user.google_refresh_token) {
      try {
        const auth = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        auth.setCredentials({
          access_token: user.google_access_token,
          refresh_token: user.google_refresh_token,
          expiry_date: user.google_token_expiry
        });

        const gmail = google.gmail({ version: "v1", auth });
        
        // RFC822 message format
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
          `To: ${to}`,
          'Content-Type: text/plain; charset=utf-8',
          'MIME-Version: 1.0',
          `Subject: ${utf8Subject}`,
          '',
          body,
        ];
        const message = messageParts.join('\n');

        // The Gmail API requires base64url encoding
        const encodedMessage = Buffer.from(message)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        await gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: encodedMessage,
          },
        });

        return res.json({ success: true, provider: 'gmail' });
      } catch (gmailError: any) {
        console.error("Gmail API Error:", gmailError);
        // Fallback to SMTP if Gmail fails
      }
    }

    // Try to get user's SMTP settings
    const userSmtp = db.prepare("SELECT * FROM user_smtp_settings WHERE user_id = ?").get(req.userId) as any;
    
    let transporterConfig: any;

    if (userSmtp) {
      transporterConfig = {
        host: userSmtp.host,
        port: userSmtp.port,
        secure: userSmtp.secure === 1,
        auth: {
          user: userSmtp.user,
          pass: decrypt(userSmtp.pass),
        },
      };
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Fallback to global SMTP
      transporterConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };
    } else {
      return res.status(400).json({ 
        error: "SMTP settings not configured. Please configure your SMTP settings in the profile section." 
      });
    }

    try {
      const transporter = nodemailer.createTransport(transporterConfig);

      await transporter.sendMail({
        from: userSmtp?.from_email || process.env.SMTP_FROM || transporterConfig.auth.user,
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

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
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
