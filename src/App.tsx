import { supabase } from './services/supabaseClient';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Settings, 
  TrendingUp, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Trash2,
  Mail,
  ExternalLink,
  Loader2,
  BarChart3,
  MapPin,
  Briefcase,
  Save,
  Edit2,
  X,
  User,
  Sparkles,
  Bell,
  HelpCircle,
  MessageSquare,
  MoreHorizontal,
  Navigation,
  Phone,
  Filter,
  ArrowRight,
  Calendar,
  History,
  FileText,
  Target,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { cn } from './lib/utils';
import { searchBusinesses, auditWebsite, generateOutreach, generateActionPlan, Business } from './services/geminiService';
import { getLeads, saveLead, updateLead, deleteLead, getProfile, updateProfile, sendEmail, Lead, UserProfile, signup, login, getMe, logout, createCheckoutSession, User as UserType } from './services/api';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Founder",
    agency: "Jenkins Digital",
    content: "Scoutflow has completely transformed our sales workflow. We used to spend hours manually auditing local business websites before even sending a cold email. Now, we generate a professional report in 30 seconds. Our conversion rate from 'cold' to 'interested' has nearly tripled because we lead with so much value.",
    avatar: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    name: "Marcus Thorne",
    role: "CEO",
    agency: "Thorne Media",
    content: "The personalized outreach generation is a game-changer. It doesn't just send a generic template; it actually references the specific issues found in the audit. Business owners are shocked that we've already done the homework for them. It makes the first call so much easier when they already trust your expertise.",
    avatar: "https://picsum.photos/seed/marcus/100/100"
  },
  {
    name: "Elena Rodriguez",
    role: "Growth Lead",
    agency: "LocalBoost",
    content: "Finding businesses without websites in specific high-value niches was a goldmine for us. We used the AI Prospector to scan Austin for dentists and contractors with no digital presence. We closed 3 new clients in our first week using the platform. The ROI was immediate.",
    avatar: "https://picsum.photos/seed/elena/100/100"
  },
  {
    name: "David Chen",
    role: "Owner",
    agency: "Chen SEO",
    content: "The strategic action plans are what really seal the deal. Presenting a lead with a 6-month roadmap based on their actual performance gaps makes us look like a high-end consultancy rather than just another agency. It's allowed us to increase our retainer prices by 40%.",
    avatar: "https://picsum.photos/seed/david/100/100"
  },
  {
    name: "Jessica Wu",
    role: "Founder",
    agency: "Wu Design",
    content: "I've tried every lead gen tool on the market, and most of them charge per lead, which really kills your margins as you scale. Scoutflow's flat monthly fee is incredibly fair. The quality of the data is better than tools that cost 5x as much.",
    avatar: "https://picsum.photos/seed/jessica/100/100"
  },
  {
    name: "Tom Baker",
    role: "Managing Director",
    agency: "Baker & Co",
    content: "The AI audits are surprisingly sophisticated. They don't just check for 'best practices'; they actually analyze the visual quality and user experience. It catches things that even my junior developers sometimes miss. It's like having an extra senior strategist on the team.",
    avatar: "https://picsum.photos/seed/tom/100/100"
  },
  {
    name: "Amara Okafor",
    role: "CEO",
    agency: "Okafor Marketing",
    content: "The SMTP integration is seamless. Being able to send the audits directly from the platform using my own agency email address adds that extra layer of professionalism. The tracking features help us know exactly when to follow up. It's the most cohesive tool in our stack.",
    avatar: "https://picsum.photos/seed/amara/100/100"
  },
  {
    name: "Liam O'Connor",
    role: "Founder",
    agency: "Dublin Digital",
    content: "We've been able to scale our outreach by 5x without hiring any additional sales staff. Scoutflow handles the heavy lifting of research and personalization, allowing my team to focus entirely on closing the deals. It's been the key to our 200% growth this year.",
    avatar: "https://picsum.photos/seed/liam/100/100"
  },
  {
    name: "Sophia Martinez",
    role: "Owner",
    agency: "Martinez Creative",
    content: "The interface is beautiful and so easy to use. I was able to onboard my entire team in less than an hour. Usually, enterprise-grade tools have a steep learning curve, but Scoutflow feels like it was designed for modern agency owners who need to move fast.",
    avatar: "https://picsum.photos/seed/sophia/100/100"
  },
  {
    name: "Ryan Smith",
    role: "Growth Architect",
    agency: "ScaleUp",
    content: "Scoutflow is the missing link in our sales process. It bridges the gap between finding a raw lead and having a meaningful conversation. By leading with a detailed audit, we're not 'selling'—we're solving problems. That shift in perspective has been huge for our brand.",
    avatar: "https://picsum.photos/seed/ryan/100/100"
  }
];

// --- Components ---

const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
    {/* Navigation */}
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
          <Sparkles className="text-white" size={22} />
        </div>
        <span className="text-2xl font-bold tracking-tighter">Scoutflow</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
        <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
        <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onGetStarted} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-all">Log In</button>
        <button onClick={onGetStarted} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 hover:bg-black transition-all active:scale-95">
          Get Started
        </button>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="pt-40 pb-20 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            AI-Powered Lead Generation
          </div>
          <h1 className="text-7xl font-bold tracking-tight text-slate-900 leading-[1.05] mb-8">
            Scale your agency with <span className="text-indigo-600">precision.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-lg mb-10 font-medium">
            Find high-intent local leads, generate automated digital audits, and close more deals with AI-driven outreach. All in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onGetStarted} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 group">
              Start Prospecting
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-4 px-6">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-bold text-slate-900">500+ Agencies</div>
                <div className="text-slate-400 font-medium">Trust Scoutflow</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-indigo-100 rounded-[3rem] blur-3xl opacity-30 animate-pulse" />
          <div className="relative bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-[4/3]">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" 
              alt="Dashboard Preview" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue Growth</div>
                    <div className="text-2xl font-bold text-slate-900">+142%</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="bg-emerald-500 h-full" 
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features Grid */}
    <section id="features" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">Everything you need to <span className="text-indigo-600">dominate</span> local markets.</h2>
          <p className="text-lg text-slate-500 font-medium">Stop wasting time on cold calls. Use AI to find businesses that actually need your services.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: "AI Prospector", desc: "Scan any location for businesses with critical digital gaps like missing websites or slow speeds." },
            { icon: BarChart3, title: "Automated Audits", desc: "Generate comprehensive digital performance reports in seconds to show leads exactly what's broken." },
            { icon: Mail, title: "Smart Outreach", desc: "AI-crafted personalized messages that reference specific audit findings to boost response rates." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials Section */}
    <section id="testimonials" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">Trusted by <span className="text-indigo-600">500+</span> agencies worldwide.</h2>
          <p className="text-lg text-slate-500 font-medium">Don't just take our word for it. Here's how Scoutflow is helping agency owners scale their operations.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-50">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.role} @ {t.agency}</div>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic flex-1">"{t.content}"</p>
              <div className="mt-6 flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Comparison Section */}
    <section className="py-32 bg-white">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Why Scoutflow <span className="text-indigo-600">wins.</span></h2>
          <p className="text-slate-500 font-medium">See how we stack up against traditional lead generation methods.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Feature</th>
                <th className="px-8 py-6 text-sm font-bold text-indigo-600 uppercase tracking-widest text-center">Scoutflow</th>
                <th className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Competitors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { feature: "AI-Powered Prospecting", us: true, them: false },
                { feature: "Automated Digital Audits", us: true, them: false },
                { feature: "Personalized Outreach", us: true, them: false },
                { feature: "Strategic Action Plans", us: true, them: false },
                { feature: "One Flat Monthly Fee", us: true, them: false },
                { feature: "Direct Email Integration", us: true, them: true },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-slate-900">{row.feature}</td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <Check size={18} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                      {row.them ? (
                        <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                          <Check size={18} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-400">
                          <X size={18} />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* Pricing Section */}
    <section id="pricing" className="py-32">
      <div className="max-w-7xl mx-auto px-8">
        <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-bold text-white tracking-tight mb-8">One simple price for <span className="text-indigo-400">unlimited</span> growth.</h2>
              <ul className="space-y-6">
                {[
                  "Unlimited AI Prospecting Searches",
                  "Automated Digital Audits",
                  "Personalized Outreach Generation",
                  "Strategic Action Plans",
                  "Direct Email Integration",
                  "Priority Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                    <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                      <Check size={14} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl">
              <div className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Pro Membership</div>
              <div className="flex items-baseline justify-center gap-2 mb-8">
                <span className="text-6xl font-bold text-slate-900 tracking-tighter">$20</span>
                <span className="text-slate-400 font-bold">/month</span>
              </div>
              <button onClick={onGetStarted} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all mb-6">
                Get Started Now
              </button>
              <p className="text-slate-400 text-sm font-medium">Cancel anytime. No hidden fees.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-20 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold tracking-tighter">Scoutflow</span>
        </div>
        <div className="flex gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-slate-900">Privacy</a>
          <a href="#" className="hover:text-slate-900">Terms</a>
          <a href="#" className="hover:text-slate-900">Contact</a>
        </div>
        <div className="text-slate-400 text-sm font-medium">© 2026 Scoutflow. All rights reserved.</div>
      </div>
    </footer>
  </div>
);

// FIX 1: Removed duplicate JSX blocks (h1, p, error rendered twice)
// FIX 2: Fixed mismatched </div>/</form> tag structure (submit button was outside form)
// FIX 3: Removed reference to undeclared `supabase` variable in handleGoogleLogin
const AuthPage = ({ mode, onSwitch, onSuccess }: { mode: 'login' | 'signup', onSwitch: () => void, onSuccess: (user: UserType) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
  try {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This scope allows your AI to send emails later if you want
        scopes: 'https://www.googleapis.com/auth/gmail.send',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  } catch (err: any) {
    setError(err.message || 'Google login failed');
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = mode === 'login' ? await login(email, password) : await signup(email, password);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
            <Sparkles className="text-white" size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tighter">Scoutflow</span>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-slate-500 text-center mb-8 font-medium">
          {mode === 'login' ? 'Enter your credentials to access your dashboard.' : 'Join 500+ agencies scaling with Scoutflow.'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              placeholder="name@agency.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              required 
              autoComplete="new-password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-2 text-slate-400 font-bold">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
        >
          <img
            src="https://www.google.com/favicon.ico"
            className="w-4 h-4"
            alt="Google"
          />
          <span className="text-sm">Google Account</span>
        </button>

        <div className="mt-8 text-center">
          <button onClick={onSwitch} className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all">
            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const PricingPage = ({ onSubscribe, onRefresh, loading, refreshing }: { onSubscribe: () => void, onRefresh: () => void, loading: boolean, refreshing: boolean }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-200 rounded-[3rem] max-w-2xl w-full p-12 shadow-2xl text-center"
    >
      <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-8">
        <Sparkles size={40} />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Unlock Scoutflow Pro</h1>
      <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto">
        You're one step away from accessing the full power of AI prospecting and automated audits.
      </p>
      
      <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Monthly Subscription</div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-bold text-slate-900 tracking-tighter">$20</span>
          <span className="text-slate-400 font-bold">/month</span>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={onSubscribe}
          disabled={loading || refreshing}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : null}
          {loading ? 'Redirecting to Stripe...' : 'Subscribe & Access Dashboard'}
        </button>

        <button 
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="w-full bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {refreshing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          {refreshing ? 'Checking status...' : 'Already paid? Refresh Status'}
        </button>
      </div>

      <p className="text-slate-400 text-sm font-medium mt-8 flex items-center justify-center gap-2">
        <CheckCircle2 size={16} className="text-emerald-500" />
        Secure payment via Stripe
      </p>
    </motion.div>
  </div>
);

const CircularGauge = ({ value, label, sublabel }: { value: number, label: string, sublabel: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          className="text-slate-100 stroke-current"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-indigo-500 stroke-current transition-all duration-1000 ease-out"
          strokeWidth="3"
          strokeDasharray={`${value}, 100`}
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text x="18" y="20.35" className="text-[8px] font-bold fill-slate-900" textAnchor="middle">{value}</text>
      </svg>
    </div>
    <div className="text-center">
      <div className="text-[10px] font-bold text-slate-900">{label}</div>
      <div className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">{sublabel}</div>
    </div>
  </div>
);

const TimelineItem = ({ label, date, status, active }: { label: string, date: string, status: 'done' | 'active' | 'pending', active?: boolean }) => (
  <div className="flex gap-4 relative">
    <div className="flex flex-col items-center">
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center z-10",
        status === 'done' ? "bg-emerald-500 text-white" :
        status === 'active' ? "bg-indigo-600 text-white" :
        "bg-slate-100 text-slate-400"
      )}>
        {status === 'done' ? <CheckCircle2 size={14} /> : status === 'active' ? <Clock size={14} /> : <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />}
      </div>
      <div className="w-0.5 h-full bg-slate-100 absolute top-6" />
    </div>
    <div className="pb-8 flex-1">
      <div className="flex justify-between items-start">
        <div>
          <div className={cn("text-xs font-bold", active ? "text-slate-900" : "text-slate-500")}>{label}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{date}</div>
        </div>
        <div className={cn(
          "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
          status === 'done' ? "bg-emerald-50 text-emerald-600" :
          status === 'active' ? "bg-indigo-50 text-indigo-600" :
          "bg-slate-50 text-slate-400"
        )}>
          {status}
        </div>
      </div>
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-300 group",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-medium" 
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
    )}
  >
    <Icon size={18} className={cn(
      "transition-colors duration-300",
      active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
    )} />
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, color, trend }: { label: string, value: string | number, icon: any, color: string, trend?: string }) => (
  <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm card-hover">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2.5 rounded-xl", color)}>
        <Icon size={20} className="text-white" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp size={12} />
          {trend}
        </div>
      )}
    </div>
    <div>
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">{label}</div>
      <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'dashboard' | 'pricing'>('landing');
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'prospector' | 'leads' | 'profile'>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ category: '', location: '' });
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isGeneratingActionPlan, setIsGeneratingActionPlan] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isEditingOutreach, setIsEditingOutreach] = useState(false);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);
  const [editedOutreach, setEditedOutreach] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Handle redirect back from Stripe
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('session_id')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // onAuthStateChange covers two critical cases:
    // 1. INITIAL_SESSION - fires on every page load with the existing session
    // 2. SIGNED_IN - fires after Google OAuth redirect lands back on the app
    // Previously we only called checkAuth() once on mount, so Google OAuth
    // sessions were never detected and users were dropped back to the landing page.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          if (session) {
            await checkAuth(session.access_token);
          }
          // No session on INITIAL_SESSION = not logged in, stay on landing
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setView('landing');
        } else if (event === 'TOKEN_REFRESHED' && session) {
          await checkAuth(session.access_token);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // accessToken is forwarded to your backend so it can verify Google OAuth
  // users even when there is no traditional email/password session cookie.
  const checkAuth = async (accessToken?: string) => {
    try {
      const me = await getMe(accessToken);
      if (me) {
        setUser(me);
        if (me.is_paid) {
          setView('dashboard');
          fetchLeads();
          fetchProfile();
        } else {
          setView('pricing');
        }
      } else {
        // getMe returned nothing - fall back to Supabase session directly
        // so Google OAuth users are not stranded on the landing page
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setView('pricing');
        }
      }
    } catch (err) {
      console.error('checkAuth error:', err);
      // On any backend error, still check if Supabase has a live session
      // so Google OAuth users are not silently dropped to the landing page
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setView('pricing');
        }
      } catch {
        // Truly no session - stay on landing
      }
    }
  };

  const handleAuthSuccess = (user: UserType) => {
    setUser(user);
    if (user.is_paid) {
      setView('dashboard');
      fetchLeads();
      fetchProfile();
    } else {
      setView('pricing');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setView('landing');
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const { url } = await createCheckoutSession();
      window.open(url, '_blank');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubscribing(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      if (!data) {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestEmail = async () => {
    if (!profile?.email) {
      alert("Please save your email in the profile first.");
      return;
    }
    setIsTestingEmail(true);
    try {
      await sendEmail(
        profile.email,
        "Scoutflow Test Email",
        "This is a test email to verify your SMTP configuration. If you received this, your email settings are correct!"
      );
      alert("Test email sent successfully! Please check your inbox.");
    } catch (err: any) {
      alert(err.message || "Failed to send test email. Check your SMTP settings.");
    } finally {
      setIsTestingEmail(false);
    }
  };

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

  const handleSaveLead = async (business: Business) => {
    try {
      await saveLead(business);
      const updatedLeads = await getLeads();
      setLeads(updatedLeads);
      const newLead = updatedLeads.find(l => l.name === business.name);
      if (newLead) {
        setSelectedLead(newLead);
        setActiveTab('leads');
        handleAudit(newLead);
      }
    } catch (err) {
      console.error(err);
    }
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSaveOutreach = async () => {
    if (!selectedLead) return;
    try {
      await updateLead(selectedLead.id, { outreach_message: editedOutreach });
      fetchLeads();
      setSelectedLead(prev => prev ? { ...prev, outreach_message: editedOutreach } : null);
      setIsEditingOutreach(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await deleteLead(id);
      fetchLeads();
      if (selectedLead?.id === id) setSelectedLead(null);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, status: Lead['status']) => {
    try {
      await updateLead(id, { status });
      fetchLeads();
      setSelectedLead(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleActionPlan = async (lead: Lead) => {
    if (!lead.audit_report) {
      alert("Please generate an audit first.");
      return;
    }
    setIsGeneratingActionPlan(true);
    try {
      const plan = await generateActionPlan(lead, lead.audit_report, profile || undefined);
      await updateLead(lead.id, { action_plan: plan });
      fetchLeads();
      setSelectedLead(prev => prev ? { ...prev, action_plan: plan } : null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingActionPlan(false);
    }
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopyOutreach = () => {
    navigator.clipboard.writeText(editedOutreach || selectedLead?.outreach_message || '');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!selectedLead || !selectedLead.email) {
      alert("Please provide a lead email address first.");
      return;
    }
    
    setIsSendingEmail(true);
    try {
      await sendEmail(
        selectedLead.email,
        `Digital Improvement for ${selectedLead.name}`,
        editedOutreach || selectedLead.outreach_message || ''
      );
      alert("Email sent successfully!");
      updateStatus(selectedLead.id, 'contacted');
    } catch (err: any) {
      alert(err.message || "Failed to send email. Check your SMTP settings.");
    } finally {
      setIsSendingEmail(false);
    }
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
    } catch (err) {
      console.error(err);
    }
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
      if (activeTab === 'profile') setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshingStatus(true);
    // Get the current Supabase session token and pass it to checkAuth
    const { data: { session } } = await supabase.auth.getSession();
    await checkAuth(session?.access_token);
    setIsRefreshingStatus(false);
  };

  if (view === 'landing') return <LandingPage onGetStarted={() => setView('signup')} />;
  if (view === 'login') return <AuthPage mode="login" onSwitch={() => setView('signup')} onSuccess={handleAuthSuccess} />;
  if (view === 'signup') return <AuthPage mode="signup" onSwitch={() => setView('login')} onSuccess={handleAuthSuccess} />;
  if (view === 'pricing') return <PricingPage onSubscribe={handleSubscribe} onRefresh={handleRefreshStatus} loading={isSubscribing} refreshing={isRefreshingStatus} />;

  if (showOnboarding) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-[2.5rem] max-w-4xl w-full shadow-2xl relative overflow-hidden flex"
        >
          {/* Left Side: Image/Branding */}
          <div className="hidden md:block w-5/12 bg-indigo-600 relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
              alt="Onboarding" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="text-white" size={24} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Scale your agency with AI.</h2>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Scoutflow helps you find high-intent local leads and automates your outreach with personalized digital audits.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-10 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
            
            <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">Get Started</h1>
            <p className="text-slate-500 mb-8 text-sm font-medium">Configure your agency profile to begin prospecting.</p>
            
            <form onSubmit={handleSaveProfile} className="space-y-5 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    name="full_name"
                    required
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agency/Business Name</label>
                <input 
                  name="business_name"
                  required
                  placeholder="e.g. Apex Digital Solutions"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Website</label>
                <input 
                  name="business_website"
                  required
                  placeholder="https://apex.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">What services do you offer?</label>
                <textarea 
                  name="business_description"
                  required
                  rows={3}
                  placeholder="e.g. We specialize in high-performance web design and SEO for local medical practices."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
                />
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 mt-2 active:scale-[0.98]">
                Initialize Account
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

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
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Leads" 
            active={activeTab === 'leads'} 
            onClick={() => setActiveTab('leads')} 
          />
          <SidebarItem 
            icon={Search} 
            label="Campaigns" 
            active={activeTab === 'prospector'} 
            onClick={() => setActiveTab('prospector')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
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
              {profile?.full_name?.[0] || 'U'}
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
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search platform..." 
                className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
              <HelpCircle size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
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
                <div className="flex gap-3">
                  <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    Export Report
                  </button>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                    New Campaign
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Leads" value={leads.length} icon={Users} color="bg-blue-500" trend="+12% from last month" />
                <StatCard label="New Opportunities" value={leads.filter(l => l.status === 'new').length} icon={AlertCircle} color="bg-amber-500" trend="5 new today" />
                <StatCard label="Contacted" value={leads.filter(l => l.status === 'contacted').length} icon={Clock} color="bg-indigo-500" trend="+8% conversion" />
                <StatCard label="Closed Deals" value={leads.filter(l => l.status === 'closed').length} icon={CheckCircle2} color="bg-emerald-500" trend="+24% revenue" />
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
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          lead.status === 'new' ? "bg-amber-100 text-amber-700" :
                          lead.status === 'contacted' ? "bg-blue-100 text-blue-700" :
                          lead.status === 'closed' ? "bg-emerald-100 text-emerald-700" :
                          "bg-slate-100 text-slate-600"
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
                        <p className="text-slate-400 text-sm font-medium italic">
                          No leads found. Start prospecting to find opportunities!
                        </p>
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
                      <div className="text-center py-8 text-slate-400 text-sm">
                        All leads have websites. Good job!
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'prospector' && (
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
                          onChange={e => setSearchQuery({...searchQuery, location: e.target.value})}
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
                          onChange={e => setSearchQuery({...searchQuery, category: e.target.value})}
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
                  <img 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" 
                    alt="Map Preview" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
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
                                <img 
                                  src={`https://picsum.photos/seed/${business.name}/100/100`} 
                                  alt={business.name} 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
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
                                  <span key={i} className={i < Math.floor(business.rating || 0) ? "fill-current" : "text-slate-200"}>★</span>
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
                        <img 
                          src="https://images.unsplash.com/photo-1584931423298-c576fda54bd2?auto=format&fit=crop&q=80&w=400" 
                          alt="No Results" 
                          className="w-full h-full object-cover rounded-3xl opacity-20 grayscale"
                          referrerPolicy="no-referrer"
                        />
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
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                    <Globe size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Missing Websites</div>
                    <div className="text-3xl font-bold text-slate-900">12</div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                    <Clock size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slow Speeds</div>
                    <div className="text-3xl font-bold text-slate-900">28</div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ready to Contact</div>
                    <div className="text-3xl font-bold text-slate-900">15</div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Score Gap</div>
                    <div className="text-3xl font-bold text-slate-900">64%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'leads' && (
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
                    }}
                    className={cn(
                      "text-left p-5 rounded-2xl border transition-all duration-200",
                      selectedLead?.id === lead.id 
                        ? "bg-white border-indigo-200 shadow-lg shadow-indigo-600/5" 
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 truncate pr-2">{lead.name}</h3>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        lead.status === 'new' ? "bg-amber-500" :
                        lead.status === 'contacted' ? "bg-blue-500" :
                        lead.status === 'closed' ? "bg-emerald-500" :
                        "bg-slate-300"
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
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                          No Website
                        </span>
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
                          <h2 className="text-4xl font-bold text-slate-900 tracking-tight editorial-title">{selectedLead.name}</h2>
                          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                            Priority Prospect
                          </span>
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
                            onChange={(e) => updateStatus(selectedLead.id, e.target.value as Lead['status'])}
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
                        <button 
                          onClick={() => setIsEditingLead(true)}
                          className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                        >
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
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Created</div>
                            <div className="text-sm font-bold text-slate-900">{new Date(selectedLead.created_at).toLocaleDateString()}</div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category</div>
                            <div className="text-sm font-bold text-slate-900">{selectedLead.category}</div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</div>
                            <div className="text-sm font-bold text-slate-900">{selectedLead.phone || 'Not provided'}</div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</div>
                            <div className="text-sm font-bold text-slate-900">★ {selectedLead.rating || 'N/A'}</div>
                          </div>
                        </div>

                        {/* Audit Section */}
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
                              <div className="grid grid-cols-4 gap-6">
                                <CircularGauge value={82} label="Mobile" sublabel="Responsiveness" />
                                <CircularGauge value={40} label="Loading" sublabel="Performance Speed" />
                                <CircularGauge value={65} label="Design" sublabel="Visual Quality" />
                                <CircularGauge value={50} label="SEO" sublabel="Search Presence" />
                              </div>
                              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm prose prose-slate prose-sm max-w-none">
                                <Markdown>{selectedLead.audit_report}</Markdown>
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
                                disabled={isAuditing}
                                className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-600/20 flex items-center gap-2 mx-auto hover:bg-indigo-700 transition-all"
                              >
                                {isAuditing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                Generate Audit Report
                              </button>
                            </div>
                          )}
                        </section>

                        {/* Action Plan Section */}
                        {selectedLead.action_plan && (
                          <section>
                            <div className="flex items-center justify-between mb-8">
                              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Target size={22} className="text-indigo-600" />
                                Strategic Action Plan
                              </h3>
                            </div>
                            <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 prose prose-indigo prose-sm max-w-none">
                              <Markdown>{selectedLead.action_plan}</Markdown>
                            </div>
                          </section>
                        )}

                        {/* Outreach Section */}
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
                                  onClick={() => setIsEditingOutreach(!isEditingOutreach)}
                                  className="text-[9px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest"
                                >
                                  {isEditingOutreach ? 'Done' : 'Edit'}
                                </button>
                              </div>
                            </div>
                            <div className="p-8">
                              {isEditingOutreach ? (
                                <textarea 
                                  value={editedOutreach}
                                  onChange={(e) => setEditedOutreach(e.target.value)}
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
                            <a 
                              href={`tel:${selectedLead.phone || ''}`}
                              className="flex-1 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                            >
                              <Phone size={20} /> Call / SMS
                            </a>
                            <button 
                              onClick={handleCopyOutreach}
                              className="bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                              {copySuccess ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                              {copySuccess ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </section>

                        {/* Tabs / History */}
                        <div className="pt-8">
                          <div className="flex border-b border-slate-100">
                            {['Action History', 'Lead Details'].map((tab, i) => (
                              <button 
                                key={tab}
                                className={cn(
                                  "px-8 py-4 text-xs font-bold transition-all border-b-2",
                                  i === 0 ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                              >
                                {tab}
                              </button>
                            ))}
                          </div>
                          <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h4>
                              <div className="space-y-6">
                                <div className="flex gap-4">
                                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                                    <Phone size={20} />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-slate-900">Lead Discovered</div>
                                    <div className="text-xs text-slate-500 mt-0.5">Added to CRM via Prospector scan in {selectedLead.location}.</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-2">{new Date(selectedLead.created_at).toLocaleDateString()}</div>
                                  </div>
                                </div>
                                {selectedLead.audit_report && (
                                  <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                                      <Sparkles size={20} />
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-slate-900">Digital Audit Generated</div>
                                      <div className="text-xs text-slate-500 mt-0.5">AI analyzed website and identified key performance gaps.</div>
                                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-2">Recently</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Info</h4>
                              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address</div>
                                  <div className="text-xs text-slate-700 font-medium">{selectedLead.address || 'Not available'}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Website</div>
                                  <a href={selectedLead.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-bold hover:underline">
                                    {selectedLead.website || 'No website'}
                                  </a>
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Globe size={18} />
                                  </button>
                                  <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Mail size={18} />
                                  </button>
                                  <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Phone size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
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
            </motion.div>
          )}

          {activeTab === 'profile' && (
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
                        <input 
                          name="full_name"
                          defaultValue={profile?.full_name}
                          required
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                        <input 
                          name="email"
                          type="email"
                          defaultValue={profile?.email}
                          required
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Business Details</h2>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agency Name</label>
                        <input 
                          name="business_name"
                          defaultValue={profile?.business_name}
                          required
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Website</label>
                        <input 
                          name="business_website"
                          defaultValue={profile?.business_website}
                          required
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
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
          )}
        </AnimatePresence>
      </main>

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
              <button 
                onClick={() => setIsEditingLead(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 tracking-tight text-slate-900">Edit Lead Details</h2>
              
              <form onSubmit={handleUpdateLeadInfo} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Name</label>
                  <input 
                    name="name"
                    defaultValue={selectedLead.name}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Website URL</label>
                  <input 
                    name="website"
                    defaultValue={selectedLead.website}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    name="email"
                    type="email"
                    defaultValue={selectedLead.email}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</label>
                  <input 
                    name="location"
                    defaultValue={selectedLead.location}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsEditingLead(false)}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
}
