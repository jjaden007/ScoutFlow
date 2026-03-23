import { motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import { Users, AlertCircle, Clock, CheckCircle2, BarChart3, Target, Globe } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { cn } from '../../lib/utils';
import type { DashboardOutletContext } from './DashboardLayout';

export default function OverviewTab() {
  const { leads, profile } = useOutletContext<DashboardOutletContext>();

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, <span className="text-indigo-600 font-bold">{profile?.full_name || 'User'}</span>. Here's your agency performance.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Leads" value={leads.length} icon={Users} color="bg-blue-500" />
        <StatCard label="New Opportunities" value={leads.filter(l => l.status === 'new').length} icon={AlertCircle} color="bg-amber-500" />
        <StatCard label="Contacted" value={leads.filter(l => l.status === 'contacted').length} icon={Clock} color="bg-indigo-500" />
        <StatCard label="Closed Deals" value={leads.filter(l => l.status === 'closed').length} icon={CheckCircle2} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-600" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                    {lead.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{lead.name}</div>
                    <div className="text-xs text-slate-500">{lead.category} • {lead.location}</div>
                  </div>
                </div>
                <div className={cn(
                  'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                  lead.status === 'new' ? 'bg-amber-100 text-amber-700' :
                  lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                  lead.status === 'closed' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-slate-100 text-slate-600'
                )}>
                  {lead.status}
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Users size={32} className="text-slate-200" />
                </div>
                <p className="text-slate-400 text-sm font-medium italic">No leads found. Start prospecting to find opportunities!</p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Target size={20} className="text-indigo-600" />
            Top Targets
          </h2>
          <div className="space-y-4">
            {leads.filter(l => !l.website).slice(0, 4).map(lead => (
              <div key={lead.id} className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <div className="font-bold text-red-900 text-sm">{lead.name}</div>
                <div className="text-xs text-red-700 mt-1 flex items-center gap-1">
                  <Globe size={12} /> No Website Found
                </div>
              </div>
            ))}
            {leads.filter(l => !l.website).length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">All leads have websites. Good job!</div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
