import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, Search, Settings, Sparkles, X } from 'lucide-react';
import SidebarItem from '../../components/ui/SidebarItem';
import { useAuth } from '../../context/AuthContext';
import { getLeads, saveLead, updateLead, deleteLead, getProfile, updateProfile, sendEmail } from '../../services/api';
import { auditWebsite, generateOutreach, generateActionPlan } from '../../services/geminiService';
import { logout } from '../../services/api';
import type { Lead, UserProfile } from '../../types';
import type { Business } from '../../services/geminiService';

export interface DashboardOutletContext {
  leads: Lead[];
  profile: UserProfile | null;
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  isAuditing: boolean;
  isGeneratingActionPlan: boolean;
  isEditingOutreach: boolean;
  setIsEditingOutreach: (v: boolean) => void;
  isEditingLead: boolean;
  setIsEditingLead: (v: boolean) => void;
  isSendingEmail: boolean;
  isTestingEmail: boolean;
  editedOutreach: string;
  setEditedOutreach: (v: string) => void;
  copySuccess: boolean;
  handleSaveLead: (business: Business) => Promise<void>;
  handleAudit: (lead: Lead) => Promise<void>;
  handleSaveOutreach: () => Promise<void>;
  handleDeleteLead: (id: string) => Promise<void>;
  updateStatus: (id: string, status: Lead['status']) => Promise<void>;
  handleActionPlan: (lead: Lead) => Promise<void>;
  handleRegenerateOutreach: (lead: Lead) => Promise<void>;
  handleCopyOutreach: () => void;
  handleSendEmail: () => Promise<void>;
  handleUpdateLeadInfo: (e: React.FormEvent) => Promise<void>;
  handleSaveProfile: (e: React.FormEvent) => Promise<void>;
  handleTestEmail: () => Promise<void>;
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isGeneratingActionPlan, setIsGeneratingActionPlan] = useState(false);
  const [isEditingOutreach, setIsEditingOutreach] = useState(false);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [editedOutreach, setEditedOutreach] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchProfile();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) { console.error(err); }
  };

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      if (!data) setShowOnboarding(true);
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/');
  };

  const handleSaveLead = async (business: Business) => {
    try {
      await saveLead(business);
      const updatedLeads = await getLeads();
      setLeads(updatedLeads);
      const newLead = updatedLeads.find(l => l.name === business.name);
      if (newLead) {
        setSelectedLead(newLead);
        setEditedOutreach(newLead.outreach_message || '');
        navigate('/dashboard/leads', { state: { autoSelectId: newLead.id } });
        handleAudit(newLead);
      }
    } catch (err) { console.error(err); }
  };

  const handleAudit = async (lead: Lead) => {
    setIsAuditing(true);
    try {
      const report = await auditWebsite(lead);
      const outreach = await generateOutreach(lead, report, profile || undefined);
      await updateLead(lead.id, { audit_report: report, outreach_message: outreach });
      fetchLeads();
      if (selectedLead?.id === lead.id) {
        setSelectedLead(prev => prev ? { ...prev, audit_report: report, outreach_message: outreach } : null);
        setEditedOutreach(outreach);
      }
    } catch (err) { console.error(err); }
    finally { setIsAuditing(false); }
  };

  const handleSaveOutreach = async () => {
    if (!selectedLead) return;
    try {
      await updateLead(selectedLead.id, { outreach_message: editedOutreach });
      fetchLeads();
      setSelectedLead(prev => prev ? { ...prev, outreach_message: editedOutreach } : null);
      setIsEditingOutreach(false);
    } catch (err) { console.error(err); }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await deleteLead(id);
      fetchLeads();
      if (selectedLead?.id === id) setSelectedLead(null);
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (id: string, status: Lead['status']) => {
    try {
      await updateLead(id, { status });
      fetchLeads();
      setSelectedLead(prev => prev ? { ...prev, status } : null);
    } catch (err) { console.error(err); }
  };

  const handleActionPlan = async (lead: Lead) => {
    if (!lead.audit_report) { alert('Please generate an audit first.'); return; }
    setIsGeneratingActionPlan(true);
    try {
      const plan = await generateActionPlan(lead, lead.audit_report, profile || undefined);
      await updateLead(lead.id, { action_plan: plan });
      fetchLeads();
      setSelectedLead(prev => prev ? { ...prev, action_plan: plan } : null);
    } catch (err) { console.error(err); }
    finally { setIsGeneratingActionPlan(false); }
  };

  const handleRegenerateOutreach = async (lead: Lead) => {
    if (!lead.audit_report) return;
    setIsAuditing(true);
    try {
      const outreach = await generateOutreach(lead, lead.audit_report, profile || undefined);
      await updateLead(lead.id, { outreach_message: outreach });
      fetchLeads();
      setSelectedLead(prev => prev ? { ...prev, outreach_message: outreach } : null);
      setEditedOutreach(outreach);
    } catch (err) { console.error(err); }
    finally { setIsAuditing(false); }
  };

  const handleCopyOutreach = () => {
    navigator.clipboard.writeText(editedOutreach || selectedLead?.outreach_message || '');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!selectedLead?.email) { alert('Please provide a lead email address first.'); return; }
    setIsSendingEmail(true);
    try {
      await sendEmail(
        selectedLead.email,
        `Digital Improvement for ${selectedLead.name}`,
        editedOutreach || selectedLead.outreach_message || ''
      );
      alert('Email sent successfully!');
      updateStatus(selectedLead.id, 'contacted');
    } catch (err: any) {
      alert(err.message || 'Failed to send email. Check your SMTP settings.');
    } finally { setIsSendingEmail(false); }
  };

  const handleUpdateLeadInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updates = {
      name: formData.get('name') as string,
      website: formData.get('website') as string,
      email: formData.get('email') as string,
      location: formData.get('location') as string,
    };
    try {
      await updateLead(selectedLead.id, updates);
      fetchLeads();
      setSelectedLead(prev => prev ? { ...prev, ...updates } : null);
      setIsEditingLead(false);
    } catch (err) { console.error(err); }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newProfile: UserProfile = {
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      business_name: formData.get('business_name') as string,
      business_description: formData.get('business_description') as string,
      business_website: formData.get('business_website') as string,
    };
    try {
      await updateProfile(newProfile);
      setProfile(newProfile);
      setShowOnboarding(false);
      navigate('/dashboard');
    } catch (err) { console.error(err); }
  };

  const handleTestEmail = async () => {
    if (!profile?.email) { alert('Please save your email in the profile first.'); return; }
    setIsTestingEmail(true);
    try {
      await sendEmail(profile.email, 'Scoutflow Test Email', 'This is a test email to verify your SMTP configuration. If you received this, your email settings are correct!');
      alert('Test email sent successfully! Please check your inbox.');
    } catch (err: any) {
      alert(err.message || 'Failed to send test email. Check your SMTP settings.');
    } finally { setIsTestingEmail(false); }
  };

  const activeTab = location.pathname.split('/').pop() || 'dashboard';

  const outletContext: DashboardOutletContext = {
    leads, profile, selectedLead, setSelectedLead,
    isAuditing, isGeneratingActionPlan,
    isEditingOutreach, setIsEditingOutreach,
    isEditingLead, setIsEditingLead,
    isSendingEmail, isTestingEmail,
    editedOutreach, setEditedOutreach,
    copySuccess,
    handleSaveLead, handleAudit, handleSaveOutreach, handleDeleteLead,
    updateStatus, handleActionPlan, handleRegenerateOutreach,
    handleCopyOutreach, handleSendEmail, handleUpdateLeadInfo,
    handleSaveProfile, handleTestEmail,
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
            <Sparkles className="text-white" size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-slate-900">Scoutflow</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => navigate('/dashboard')} />
          <SidebarItem icon={Users} label="Leads" active={activeTab === 'leads'} onClick={() => navigate('/dashboard/leads')} />
          <SidebarItem icon={Search} label="Campaigns" active={activeTab === 'prospector'} onClick={() => navigate('/dashboard/prospector')} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => navigate('/dashboard/settings')} />
        </nav>

        <div className="p-6 space-y-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-bold uppercase tracking-widest"
          >
            <X size={18} />
            Log Out
          </button>
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
              {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">{profile?.full_name || 'User'}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pro Member</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet context={outletContext} />
        </main>
      </div>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] max-w-4xl w-full shadow-2xl relative overflow-hidden flex"
            >
              <div className="hidden md:block w-5/12 bg-indigo-600 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" alt="Onboarding" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-4">Scale your agency with AI.</h2>
                  <p className="text-indigo-100 text-sm leading-relaxed">Scoutflow helps you find high-intent local leads and automates your outreach with personalized digital audits.</p>
                </div>
              </div>
              <div className="flex-1 p-10 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">Get Started</h1>
                <p className="text-slate-500 mb-8 text-sm font-medium">Configure your agency profile to begin prospecting.</p>
                <form onSubmit={handleSaveProfile} className="space-y-5 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input name="full_name" required placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                      <input name="email" type="email" required placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agency/Business Name</label>
                    <input name="business_name" required placeholder="e.g. Apex Digital Solutions" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Website</label>
                    <input name="business_website" required placeholder="https://apex.com" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">What services do you offer?</label>
                    <textarea name="business_description" required rows={3} placeholder="e.g. We specialize in high-performance web design and SEO for local medical practices." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm" />
                  </div>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 mt-2 active:scale-[0.98]">
                    Initialize Account
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
