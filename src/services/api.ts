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

function authHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function getToken(): Promise<string | undefined> {
  try {
    const { supabase } = await import('./supabaseClient');
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  } catch { return undefined; }
}

export async function getMe(accessToken?: string): Promise<User | null> {
  try {
    const token = accessToken || await getToken();
    const res = await fetch('/api/me', { headers: authHeaders(token) });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error('getMe error:', err);
    return null;
  }
}

export async function signup(email: string, password: string): Promise<{ user: User }> {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

export async function login(email: string, password: string): Promise<{ user: User; access_token: string }> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function logout(): Promise<void> {
  await fetch('/api/logout', { method: 'POST' });
}

export async function createCheckoutSession(): Promise<{ url: string }> {
  const token = await getToken();
  const res = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create checkout session');
  return data;
}

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const token = await getToken();
    const res = await fetch('/api/profile', { headers: authHeaders(token) });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function updateProfile(profile: UserProfile): Promise<void> {
  const token = await getToken();
  await fetch('/api/profile', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(profile),
  });
}

export async function getLeads(): Promise<Lead[]> {
  try {
    const token = await getToken();
    const res = await fetch('/api/leads', { headers: authHeaders(token) });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function saveLead(business: Business): Promise<void> {
  const token = await getToken();
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(business),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save lead');
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<void> {
  const token = await getToken();
  await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(updates),
  });
}

export async function deleteLead(id: string): Promise<void> {
  const token = await getToken();
  await fetch(`/api/leads/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  const token = await getToken();
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ to, subject, body }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send email');
}
