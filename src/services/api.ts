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

export interface User {
  id: string;
  email: string;
  is_paid: number;
}

export async function signup(email: string, password: string): Promise<{ user: User }> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Signup failed");
  }
  return res.json();
}

export async function login(email: string, password: string): Promise<{ user: User }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }
  return res.json();
}

export async function getMe(): Promise<User | null> {
  const res = await fetch("/api/auth/me");
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
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
