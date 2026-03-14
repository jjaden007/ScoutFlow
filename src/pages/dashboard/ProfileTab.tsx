import { motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Mail } from 'lucide-react';
import type { DashboardOutletContext } from './DashboardLayout';

export default function ProfileTab() {
  const { profile, handleSaveProfile, handleTestEmail, isTestingEmail } = useOutletContext<DashboardOutletContext>();

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
