import { useState } from 'react';
import { motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, Loader2, ChevronRight,
  Globe, Clock, CheckCircle2, TrendingUp,
} from 'lucide-react';
import { searchBusinesses } from '../../services/api';
import type { Business } from '../../types';
import type { DashboardOutletContext } from './DashboardLayout';

export default function ProspectorTab() {
  const { handleSaveLead } = useOutletContext<DashboardOutletContext>();

  const [searchQuery, setSearchQuery] = useState({ category: '', location: '' });
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.category || !searchQuery.location) return;
    setLoading(true);
    try {
      const results = await searchBusinesses(searchQuery.category, searchQuery.location);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="prospector"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Lead Discovery</h1>
          <p className="text-slate-500 text-sm">Find and audit local businesses with high outreach potential.</p>
        </header>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all">
          <MapPin size={16} />
          Toggle Map View
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Austin, TX"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
                  value={searchQuery.location}
                  onChange={e => setSearchQuery({ ...searchQuery, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Dentists"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
                  value={searchQuery.category}
                  onChange={e => setSearchQuery({ ...searchQuery, category: e.target.value })}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto shadow-lg shadow-indigo-600/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                Discover Leads
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm relative group">
          <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" alt="Map Preview" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-indigo-900/10" />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md text-slate-600 hover:text-indigo-600 transition-colors">+</button>
            <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md text-slate-600 hover:text-indigo-600 transition-colors">-</button>
          </div>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 shadow-lg border border-white/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            {searchQuery.location || 'Austin, TX'} (Live Map)
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900">Discovery Results</h3>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span>Showing {searchResults.length} potential leads</span>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
              SORT BY: <span className="text-indigo-600 font-bold">Rating (High to Low)</span>
              <ChevronRight size={14} className="rotate-90" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5 font-serif italic normal-case text-xs">Business Entity</th>
                <th className="px-8 py-5 font-serif italic normal-case text-xs">Market Rating</th>
                <th className="px-8 py-5 font-serif italic normal-case text-xs">Digital Status</th>
                <th className="px-8 py-5 text-right font-serif italic normal-case text-xs">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {searchResults.map(business => (
                <tr key={business.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={`https://picsum.photos/seed/${business.name}/100/100`} alt={business.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base tracking-tight">{business.name}</div>
                        <div className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">{business.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(business.rating || 0) ? 'fill-current' : 'text-slate-200'}>★</span>
                        ))}
                      </div>
                      <span className="text-slate-900 font-bold font-mono text-sm">{business.rating || '0.0'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {!business.website ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Critical: No Website</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Active Presence</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleSaveLead(business)}
                      className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                      Initiate Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {searchResults.length === 0 && !loading && (
            <div className="py-20 text-center">
              <div className="w-48 h-48 mx-auto mb-6 relative">
                <img src="https://images.unsplash.com/photo-1584931423298-c576fda54bd2?auto=format&fit=crop&q=80&w=400" alt="No Results" className="w-full h-full object-cover rounded-3xl opacity-20 grayscale" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search size={48} className="text-slate-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Ready to find clients?</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">Enter a category and location above to start scanning your local market.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400">
          <button className="hover:text-indigo-600 transition-colors">Previous</button>
          <div className="flex gap-2">
            <button className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">1</button>
            <button className="w-8 h-8 hover:bg-slate-100 rounded-lg flex items-center justify-center">2</button>
            <button className="w-8 h-8 hover:bg-slate-100 rounded-lg flex items-center justify-center">3</button>
          </div>
          <button className="hover:text-indigo-600 transition-colors">Next</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Globe, label: 'Missing Websites', value: 12, bg: 'bg-red-50', color: 'text-red-500' },
          { icon: Clock, label: 'Slow Speeds', value: 28, bg: 'bg-amber-50', color: 'text-amber-500' },
          { icon: CheckCircle2, label: 'Ready to Contact', value: 15, bg: 'bg-indigo-50', color: 'text-indigo-500' },
          { icon: TrendingUp, label: 'Avg. Score Gap', value: '64%', bg: 'bg-emerald-50', color: 'text-emerald-500' },
        ].map(({ icon: Icon, label, value, bg, color }) => (
          <div key={label} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center ${color}`}>
              <Icon size={24} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
              <div className="text-3xl font-bold text-slate-900">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
