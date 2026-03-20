import { Business, Lead, UserProfile, User } from "../types";

export type { Lead, UserProfile, User };

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
  const { supabase } = await import('./supabaseClient');
  await supabase.auth.signOut();
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

async function aiRequest(type: string, payload: Record<string, unknown>) {
  const token = await getToken();
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ type, ...payload }),
  });
  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { throw new Error(`AI request failed: ${text.slice(0, 200)}`); }
  if (!res.ok) throw new Error(data.error || 'AI request failed');
  return data;
}

export async function searchBusinesses(category: string, location: string, page = 1): Promise<Business[]> {
  return aiRequest('search', { category, location, page });
}

export async function auditLead(business: Business): Promise<string> {
  const data = await aiRequest('audit', { business });
  return data.report;
}

export async function generateOutreach(business: Business, auditReport: string, userProfile?: UserProfile): Promise<string> {
  const data = await aiRequest('outreach', { business, auditReport, userProfile });
  return data.outreach;
}

export async function generateActionPlan(business: Business, auditReport: string, userProfile?: UserProfile): Promise<string> {
  const data = await aiRequest('action-plan', { business, auditReport, userProfile });
  return data.plan;
}

export async function getGoogleStatus(): Promise<{ connected: boolean; email: string | null }> {
  const token = await getToken();
  const res = await fetch('/api/google?action=status', { headers: authHeaders(token) });
  const data = await res.json();
  return data;
}

export async function getGoogleAuthUrl(): Promise<string> {
  const token = await getToken();
  const res = await fetch('/api/google?action=url', { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to get auth URL');
  return data.url;
}

export async function disconnectGoogle(): Promise<void> {
  const token = await getToken();
  await fetch('/api/google?action=disconnect', { method: 'POST', headers: authHeaders(token) });
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
