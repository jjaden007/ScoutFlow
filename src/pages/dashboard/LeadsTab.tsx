import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import {
  Filter, Briefcase, MapPin, Globe, ChevronRight, Loader2, Sparkles,
  Target, MessageSquare, History, Mail, Phone, Copy, Check, X, Users,
} from 'lucide-react';
import Markdown from 'react-markdown';
import CircularGauge from '../../components/ui/CircularGauge';
import { cn } from '../../lib/utils';
import type { DashboardOutletContext } from './DashboardLayout';
import type { Lead } from '../../types';

export default function LeadsTab() {
  const {
    leads, selectedLead, setSelectedLead,
    isAuditing, isGeneratingActionPlan,
    isEditingOutreach, setIsEditingOutreach,
    isEditingLead, setIsEditingLead,
    isSendingEmail,
    editedOutreach, setEditedOutreach,
    copySuccess,
    handleAudit, handleSaveOutreach, handleDeleteLead,
    updateStatus, handleActionPlan, handleRegenerateOutreach,
    handleCopyOutreach, handleSendEmail, handleUpdateLeadInfo,
  } = useOutletContext<DashboardOutletContext>();

  const [auditProgress, setAuditProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'history' | 'details'>('history');

  function parseAuditScores(report: string) {
    const match = report.match(/<!--SCORES:(\{[^}]+\})-->/);
    if (!match) return { mobile: 0, speed: 0, design: 0, seo: 0 };
    try { return JSON.parse(match[1]); } catch { return { mobile: 0, speed: 0, design: 0, seo: 0 }; }
  }

  function stripScoresComment(report: string) {
    return report.replace(/<!--SCORES:\{[^}]+\}-->\n?/, '');
  }

  const auditSteps = [
    { threshold: 20, label: 'Fetching business details...' },
    { threshold: 40, label: 'Analyzing website performance...' },
    { threshold: 60, label: 'Identifying digital gaps...' },
    { threshold: 80, label: 'Writing audit report...' },
    { threshold: 100, label: 'Crafting personalized outreach...' },
  ];
  const auditStepIndex = (() => {
    const i = auditSteps.findIndex(s => auditProgress <= s.threshold);
    return i === -1 ? auditSteps.length - 1 : i;
  })();

  useEffect(() => {
    if (!isAuditing) {
      if (auditProgress > 0) {
        setAuditProgress(100);
        const t = setTimeout(() => setAuditProgress(0), 700);
        return () => clearTimeout(t);
      }
      return;
    }
    setAuditProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + Math.max(0.3, (95 - current) * 0.03), 95);
      setAuditProgress(current);
    }, 200);
    return () => clearInterval(interval);
  }, [isAuditing]);

  return (
    <motion.div
      key="leads"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-8 h-full"
    >
      {/* Lead List */}
      <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
        <header className="mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Leads</h1>
            <p className="text-slate-500 text-sm">{leads.length} total prospects</p>
          </div>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
            <Filter size={18} />
          </button>
        </header>

        {leads.map(lead => (
          <button
            key={lead.id}
            onClick={() => {
              setSelectedLead(lead);
              setEditedOutreach(lead.outreach_message || '');
              setIsEditingOutreach(false);
              setActiveTab('history');
            }}
            className={cn(
              'text-left p-5 rounded-2xl border transition-all duration-200',
              selectedLead?.id === lead.id
                ? 'bg-white border-indigo-200 shadow-lg shadow-indigo-600/5'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-900 truncate pr-2">{lead.name}</h3>
              <div className={cn(
                'w-2 h-2 rounded-full',
                lead.status === 'new' ? 'bg-amber-500' :
                lead.status === 'contacted' ? 'bg-blue-500' :
                lead.status === 'closed' ? 'bg-emerald-500' :
                'bg-slate-300'
              )} />
            </div>
            <p className="text-[11px] text-slate-500 mb-4 flex items-center gap-1">
              <Briefcase size={12} /> {lead.category} • <MapPin size={12} /> {lead.location}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {new Date(lead.created_at).toLocaleDateString()}
              </span>
              {!lead.website && (
                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">No Website</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Lead Detail */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        {selectedLead ? (
          <>
            <div className="p-10 border-b border-slate-100 flex justify-between items-start bg-white">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{selectedLead.name}</h2>
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">Priority Prospect</span>
                </div>
                <div className="flex items-center gap-6 text-slate-400 text-sm font-medium">
                  <a href={selectedLead.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-indigo-600 transition-colors group">
                    <Globe size={16} className="group-hover:rotate-12 transition-transform" />
                    <span className="border-b border-slate-200 group-hover:border-indigo-200">{selectedLead.website || 'no-website.com'}</span>
                  </a>
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                  <span className="flex items-center gap-2"><MapPin size={16} /> {selectedLead.location}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <select
                    value={selectedLead.status}
                    onChange={e => updateStatus(selectedLead.id, e.target.value as Lead['status'])}
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 pr-10 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-100 transition-all outline-none cursor-pointer"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="closed">Closed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                </div>
                <button onClick={() => setIsEditingLead(true)} className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95">
                  Edit Lead
                </button>
                <button
                  onClick={() => handleActionPlan(selectedLead)}
                  disabled={isGeneratingActionPlan}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
                >
                  {isGeneratingActionPlan ? <Loader2 className="animate-spin" size={18} /> : <Target size={18} />}
                  Action Plan
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-12 max-w-5xl mx-auto">
                {/* Status Bar */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Created', value: new Date(selectedLead.created_at).toLocaleDateString() },
                    { label: 'Category', value: selectedLead.category },
                    { label: 'Phone', value: selectedLead.phone || 'Not provided' },
                    { label: 'Rating', value: `★ ${selectedLead.rating || 'N/A'}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
                      <div className="text-sm font-bold text-slate-900">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Audit */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles size={22} className="text-indigo-600" />
                      AI Digital Audit
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Last scanned: {selectedLead.audit_report ? 'Recently' : 'Never'}
                    </span>
                  </div>
                  {selectedLead.audit_report ? (
                    <div className="space-y-8">
                      {(() => {
                        const scores = parseAuditScores(selectedLead.audit_report!);
                        const cleanReport = stripScoresComment(selectedLead.audit_report!);
                        return (
                          <>
                            <div className="grid grid-cols-4 gap-6">
                              <CircularGauge value={scores.mobile} label="Mobile" sublabel="Responsiveness" />
                              <CircularGauge value={scores.speed} label="Loading" sublabel="Performance Speed" />
                              <CircularGauge value={scores.design} label="Design" sublabel="Visual Quality" />
                              <CircularGauge value={scores.seo} label="SEO" sublabel="Search Presence" />
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm prose prose-slate prose-sm max-w-none">
                              <Markdown>{cleanReport}</Markdown>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : isAuditing ? (
                    <div className="py-16 px-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center gap-6">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Sparkles size={28} className="text-indigo-500 animate-pulse" />
                      </div>
                      <div className="w-full max-w-sm space-y-3 text-center">
                        <p className="text-sm font-bold text-slate-700">{auditSteps[auditStepIndex].label}</p>
                        <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full"
                            style={{ width: `${auditProgress}%` }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>Step {auditStepIndex + 1} of {auditSteps.length}</span>
                          <span>{Math.round(auditProgress)}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                        <Sparkles size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">No audit performed yet</h4>
                      <p className="text-sm text-slate-500 mt-1 mb-8">Analyze this business to see digital gaps and opportunities.</p>
                      <button
                        onClick={() => handleAudit(selectedLead)}
                        className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-600/20 flex items-center gap-2 mx-auto hover:bg-indigo-700 transition-all"
                      >
                        <Sparkles size={20} />
                        Generate Audit Report
                      </button>
                    </div>
                  )}
                </section>

                {/* Action Plan */}
                {selectedLead.action_plan && (
                  <section>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-8">
                      <Target size={22} className="text-indigo-600" />
                      Strategic Action Plan
                    </h3>
                    <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 prose prose-indigo prose-sm max-w-none">
                      <Markdown>{selectedLead.action_plan}</Markdown>
                    </div>
                  </section>
                )}

                {/* Outreach */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare size={22} className="text-indigo-600" />
                      Personalized Outreach
                    </h3>
                    <button
                      onClick={() => handleRegenerateOutreach(selectedLead)}
                      disabled={isAuditing}
                      className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:underline disabled:opacity-50"
                    >
                      <History size={12} /> Regenerate
                    </button>
                  </div>
                  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Draft Message</span>
                      <div className="flex gap-2">
                        <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[9px] font-bold uppercase">Cold Outreach Template</span>
                        <button
                          onClick={() => {
                            if (isEditingOutreach) handleSaveOutreach();
                            else setIsEditingOutreach(true);
                          }}
                          className="text-[9px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest"
                        >
                          {isEditingOutreach ? 'Save' : 'Edit'}
                        </button>
                      </div>
                    </div>
                    <div className="p-8">
                      {isEditingOutreach ? (
                        <textarea
                          value={editedOutreach}
                          onChange={e => setEditedOutreach(e.target.value)}
                          rows={10}
                          className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none text-slate-600 text-sm leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedLead.outreach_message || 'No outreach message generated yet.'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={handleSendEmail}
                      disabled={isSendingEmail || !selectedLead.email}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSendingEmail ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
                      {isSendingEmail ? 'Sending...' : 'Send Email'}
                    </button>
                    <a href={`tel:${selectedLead.phone || ''}`} className="flex-1 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                      <Phone size={20} /> Call / SMS
                    </a>
                    <button onClick={handleCopyOutreach} className="bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                      {copySuccess ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </section>

                {/* Activity History */}
                <div className="pt-8">
                  <div className="flex border-b border-slate-100">
                    {(['history', 'details'] as const).map((tab, i) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn('px-8 py-4 text-xs font-bold transition-all border-b-2', activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600')}
                      >
                        {i === 0 ? 'Action History' : 'Lead Details'}
                      </button>
                    ))}
                  </div>
                  <div className="py-8">
                    {activeTab === 'history' ? (
                      <div className="space-y-6 max-w-md">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h4>
                        <div className="space-y-6">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0"><Phone size={20} /></div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">Lead Discovered</div>
                              <div className="text-xs text-slate-500 mt-0.5">Added to CRM via Prospector scan in {selectedLead.location}.</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase mt-2">{new Date(selectedLead.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                          {selectedLead.audit_report && (
                            <div className="flex gap-4">
                              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0"><Sparkles size={20} /></div>
                              <div>
                                <div className="text-sm font-bold text-slate-900">Digital Audit Generated</div>
                                <div className="text-xs text-slate-500 mt-0.5">AI analyzed website and identified key performance gaps.</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-2">Recently</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 max-w-md">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Info</h4>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address</div>
                            <div className="text-xs text-slate-700 font-medium">{selectedLead.address || 'Not available'}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Website</div>
                            <a href={selectedLead.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-bold hover:underline">{selectedLead.website || 'No website'}</a>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</div>
                            <div className="text-xs text-slate-700 font-medium">{selectedLead.email || 'Not available'}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</div>
                            <div className="text-xs text-slate-700 font-medium">{selectedLead.phone || 'Not available'}</div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            {selectedLead.website && (
                              <a href={selectedLead.website} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Globe size={18} /></a>
                            )}
                            {selectedLead.email && (
                              <a href={`mailto:${selectedLead.email}`} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Mail size={18} /></a>
                            )}
                            {selectedLead.phone && (
                              <a href={`tel:${selectedLead.phone}`} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Phone size={18} /></a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Users size={40} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Select a lead to view details</h3>
            <p className="max-w-xs mt-2 text-sm">Manage your prospects, run AI audits, and generate personalized outreach messages.</p>
          </div>
        )}
      </div>

      {/* Edit Lead Modal */}
      <AnimatePresence>
        {isEditingLead && selectedLead && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 p-10 rounded-[2.5rem] max-w-xl w-full shadow-2xl relative"
            >
              <button onClick={() => setIsEditingLead(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-6 tracking-tight text-slate-900">Edit Lead Details</h2>
              <form onSubmit={handleUpdateLeadInfo} className="space-y-6">
                {[
                  { name: 'name', label: 'Business Name', type: 'text', defaultValue: selectedLead.name, required: true },
                  { name: 'website', label: 'Website URL', type: 'text', defaultValue: selectedLead.website, required: false },
                  { name: 'email', label: 'Email Address', type: 'email', defaultValue: selectedLead.email, required: false },
                  { name: 'location', label: 'Location', type: 'text', defaultValue: selectedLead.location, required: true },
                ].map(field => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{field.label}</label>
                    <input
                      name={field.name}
                      type={field.type}
                      defaultValue={field.defaultValue}
                      required={field.required}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                ))}
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsEditingLead(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
