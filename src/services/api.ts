import { Business } from "./geminiService";

export interface Lead extends Business {
  status: 'new' | 'contacted' | 'interested' | 'closed' | 'rejected';
  audit_report?: string;
  outreach_message?: string;
  action_plan?: string;
  created_at: string;
}

export interface UserProfile {
  full_name: string;
  email: string;
  business_name: string;
  business_description: string;
  business_website: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  user: string;
  pass: string;
  from_email: string;
  secure: boolean;
}

export interface User {
  id: string;
  email: string;
  is_paid: number;
}

export async function signup(email: string, password: string): Promise<{ user: User }> {
  console.log("Calling signup API...");
  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  console.log("Signup response status:", res.status);
  const contentType = res.headers.get("content-type");
  console.log("Signup response content-type:", contentType);
  if (!res.ok) {
    if (contentType && contentType.includes("application/json")) {
      const err = await res.json();
      throw new Error(err.error || "Signup failed");
    } else {
      const text = await res.text();
      console.error("Signup failed with non-JSON response:", text);
      throw new Error(`Signup failed (${res.status}): ${text.substring(0, 100)}...`);
    }
  }
  
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } else {
    const text = await res.text();
    throw new Error("Expected JSON response but got: " + text.substring(0, 100));
  }
}

export async function login(email: string, password: string): Promise<{ user: User }> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const contentType = res.headers.get("content-type");
  if (!res.ok) {
    if (contentType && contentType.includes("application/json")) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    } else {
      const text = await res.text();
      console.error("Login failed with non-JSON response:", text);
      throw new Error(`Login failed (${res.status}): ${text.substring(0, 100)}...`);
    }
  }

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } else {
    const text = await res.text();
    throw new Error("Expected JSON response but got: " + text.substring(0, 100));
  }
}

export async function getMe(): Promise<User | null> {
  try {
    console.log("Calling /api/me...");
    const res = await fetch("/api/me");
    console.log("getMe response status:", res.status);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    }
    return null;
  } catch (err) {
    console.error("getMe error:", err);
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/logout", { method: "POST" });
}

export async function createCheckoutSession(): Promise<{ url: string }> {
  const res = await fetch("/api/stripe/create-checkout-session", { method: "POST" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create checkout session");
  }
  return res.json();
}

export async function getProfile(): Promise<UserProfile | null> {
  const res = await fetch("/api/profile");
  return res.json();
}

export async function updateProfile(profile: UserProfile): Promise<void> {
  await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
}

export async function getSmtpSettings(): Promise<SmtpSettings | null> {
  const res = await fetch("/api/smtp-settings");
  return res.json();
}

export async function updateSmtpSettings(settings: SmtpSettings): Promise<void> {
  await fetch("/api/smtp-settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
}

export async function getGoogleStatus(): Promise<{ connected: boolean, email?: string }> {
  const res = await fetch("/api/auth/google/status");
  return res.json();
}

export async function getGoogleAuthUrl(): Promise<{ url: string }> {
  const res = await fetch("/api/auth/google/url");
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to get Google auth URL");
  }
  return res.json();
}

export async function getGoogleLoginUrl(): Promise<{ url: string }> {
  const res = await fetch("/api/auth/google/login-url");
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to get Google login URL");
  }
  return res.json();
}

export async function disconnectGoogle(): Promise<void> {
  await fetch("/api/auth/google/disconnect", { method: "POST" });
}

export async function getLeads(): Promise<Lead[]> {
  const res = await fetch("/api/leads");
  return res.json();
}

export async function saveLead(business: Business): Promise<void> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(business),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to save lead");
  }
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<void> {
  await fetch(`/api/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function deleteLead(id: string): Promise<void> {
  await fetch(`/api/leads/${id}`, {
    method: "DELETE",
  });
}

export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, body }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to send email");
  }
}
