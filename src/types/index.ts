export interface Business {
  id: string;
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  rating?: number;
  address?: string;
  category: string;
  location: string;
}

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
