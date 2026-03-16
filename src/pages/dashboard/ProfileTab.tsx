import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react';
import type { DashboardOutletContext } from './DashboardLayout';
import { getGoogleStatus, getGoogleAuthUrl, disconnectGoogle } from '../../services/api';

export default function ProfileTab() {
  const { profile, handleSaveProfile, handleTestEmail, isTestingEmail } = useOutletContext<DashboardOutletContext>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | null>(null);
  const [gmailLoading, setGmailLoading] = useState(true);
  const [gmailMsg, setGmailMsg] = useState<string | null>(null);

  useEffect(() => {
    getGoogleStatus().then(({ connected, email }) => {
      setGmailConnected(connected);
      setGmailEmail(email);
      setGmailLoading(false);
    });

    const status = searchParams.get('google');
    if (status === 'connected') {
      setGmailMsg('Gmail connected successfully!');
      setSearchParams({});
    } else if (status === 'error') {
      setGmailMsg('Failed to connect Gmail. Please try again.');
      setSearchParams({});
    }
  }, []);

  const handleConnectGmail = async () => {
    try {
      const url = await getGoogleAuthUrl();
      window.location.href = url;
    } catch (err: any) {
      setGmailMsg(err.message || 'Failed to start Gmail connection.');
    }
  };

  const handleDisconnectGmail = async () => {
    await disconnectGoogle();
    setGmailConnected(false);
    setGmailEmail(null);
    setGmailMsg('Gmail disconnected.');
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl"
    >
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your personal and business details for better AI tailoring.</p>
      </header>

      {/* Gmail Connection */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Email Provider</h2>

        {gmailMsg && (
          <p className={`text-sm font-medium mb-4 ${gmailMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
            {gmailMsg}
          </p>
        )}

        {gmailLoading ? (
          <div className="flex items-center gap-2 text-slate-400"><Loader2 className="animate-spin" size={16} /> Checking connection…</div>
        ) : gmailConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-500" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Gmail connected</p>
                <p className="text-xs text-slate-400">{gmailEmail}</p>
              </div>
            </div>
            <button
              onClick={handleDisconnectGmail}
              className="text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
            >
              <XCircle size={15} /> Disconnect
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">No email provider connected</p>
              <p className="text-xs text-slate-400">Connect Gmail to send outreach emails directly from ScoutFlow.</p>
            </div>
            <button
              onClick={handleConnectGmail}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Connect Gmail
            </button>
          </div>
        )}
      </div>

      {/* Profile form */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm">
        <form onSubmit={handleSaveProfile} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Personal Information</h2>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                <input name="full_name" defaultValue={profile?.full_name} required className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <input name="email" type="email" defaultValue={profile?.email} required className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Business Details</h2>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agency Name</label>
                <input name="business_name" defaultValue={profile?.business_name} required className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Website</label>
                <input name="business_website" defaultValue={profile?.business_website} required className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Services & Expertise</h2>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Value Proposition</label>
              <textarea
                name="business_description"
                defaultValue={profile?.business_description}
                required
                rows={5}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 font-medium">Describe what you do in detail. The AI uses this to explain your value proposition to leads.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <button
              type="button"
              onClick={handleTestEmail}
              disabled={isTestingEmail}
              className="text-indigo-600 hover:text-indigo-700 font-bold text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isTestingEmail ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
              Test Email Configuration
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
