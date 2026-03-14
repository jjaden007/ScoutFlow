import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Search, TrendingUp, Mail, BarChart3, ArrowRight, Sparkles, Check, X
} from 'lucide-react';

const testimonials = [
  { name: "Sarah Jenkins", role: "Founder", agency: "Jenkins Digital", content: "Scoutflow has completely transformed our sales workflow. We used to spend hours manually auditing local business websites before even sending a cold email. Now, we generate a professional report in 30 seconds. Our conversion rate from 'cold' to 'interested' has nearly tripled because we lead with so much value.", avatar: "https://picsum.photos/seed/sarah/100/100" },
  { name: "Marcus Thorne", role: "CEO", agency: "Thorne Media", content: "The personalized outreach generation is a game-changer. It doesn't just send a generic template; it actually references the specific issues found in the audit. Business owners are shocked that we've already done the homework for them. It makes the first call so much easier when they already trust your expertise.", avatar: "https://picsum.photos/seed/marcus/100/100" },
  { name: "Elena Rodriguez", role: "Growth Lead", agency: "LocalBoost", content: "Finding businesses without websites in specific high-value niches was a goldmine for us. We used the AI Prospector to scan Austin for dentists and contractors with no digital presence. We closed 3 new clients in our first week using the platform. The ROI was immediate.", avatar: "https://picsum.photos/seed/elena/100/100" },
  { name: "David Chen", role: "Owner", agency: "Chen SEO", content: "The strategic action plans are what really seal the deal. Presenting a lead with a 6-month roadmap based on their actual performance gaps makes us look like a high-end consultancy rather than just another agency. It's allowed us to increase our retainer prices by 40%.", avatar: "https://picsum.photos/seed/david/100/100" },
  { name: "Jessica Wu", role: "Founder", agency: "Wu Design", content: "I've tried every lead gen tool on the market, and most of them charge per lead, which really kills your margins as you scale. Scoutflow's flat monthly fee is incredibly fair. The quality of the data is better than tools that cost 5x as much.", avatar: "https://picsum.photos/seed/jessica/100/100" },
  { name: "Tom Baker", role: "Managing Director", agency: "Baker & Co", content: "The AI audits are surprisingly sophisticated. They don't just check for 'best practices'; they actually analyze the visual quality and user experience. It catches things that even my junior developers sometimes miss. It's like having an extra senior strategist on the team.", avatar: "https://picsum.photos/seed/tom/100/100" },
  { name: "Amara Okafor", role: "CEO", agency: "Okafor Marketing", content: "The SMTP integration is seamless. Being able to send the audits directly from the platform using my own agency email address adds that extra layer of professionalism. The tracking features help us know exactly when to follow up. It's the most cohesive tool in our stack.", avatar: "https://picsum.photos/seed/amara/100/100" },
  { name: "Liam O'Connor", role: "Founder", agency: "Dublin Digital", content: "We've been able to scale our outreach by 5x without hiring any additional sales staff. Scoutflow handles the heavy lifting of research and personalization, allowing my team to focus entirely on closing the deals. It's been the key to our 200% growth this year.", avatar: "https://picsum.photos/seed/liam/100/100" },
  { name: "Sophia Martinez", role: "Owner", agency: "Martinez Creative", content: "The interface is beautiful and so easy to use. I was able to onboard my entire team in less than an hour. Usually, enterprise-grade tools have a steep learning curve, but Scoutflow feels like it was designed for modern agency owners who need to move fast.", avatar: "https://picsum.photos/seed/sophia/100/100" },
  { name: "Ryan Smith", role: "Growth Architect", agency: "ScaleUp", content: "Scoutflow is the missing link in our sales process. It bridges the gap between finding a raw lead and having a meaningful conversation. By leading with a detailed audit, we're not 'selling'—we're solving problems. That shift in perspective has been huge for our brand.", avatar: "https://picsum.photos/seed/ryan/100/100" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
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
          <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-all">Log In</button>
          <button onClick={() => navigate('/signup')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 hover:bg-black transition-all active:scale-95">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
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
              <button onClick={() => navigate('/signup')} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 group">
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

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="absolute -inset-4 bg-indigo-100 rounded-[3rem] blur-3xl opacity-30 animate-pulse" />
            <div className="relative bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-[4/3]">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" alt="Dashboard Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                    <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5, delay: 1 }} className="bg-emerald-500 h-full" />
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
              { icon: Mail, title: "Smart Outreach", desc: "AI-crafted personalized messages that reference specific audit findings to boost response rates." },
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

      {/* Testimonials */}
      <section id="testimonials" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">Trusted by <span className="text-indigo-600">500+</span> agencies worldwide.</h2>
            <p className="text-lg text-slate-500 font-medium">Don't just take our word for it. Here's how Scoutflow is helping agency owners scale their operations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
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
                <div className="mt-6 flex text-amber-400">{[...Array(5)].map((_, i) => <span key={i}>★</span>)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
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
                      <div className="flex justify-center"><div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><Check size={18} /></div></div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center">
                        {row.them
                          ? <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><Check size={18} /></div>
                          : <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-400"><X size={18} /></div>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-5xl font-bold text-white tracking-tight mb-8">One simple price for <span className="text-indigo-400">unlimited</span> growth.</h2>
                <ul className="space-y-6">
                  {["Unlimited AI Prospecting Searches", "Automated Digital Audits", "Personalized Outreach Generation", "Strategic Action Plans", "Direct Email Integration", "Priority Support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                      <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400"><Check size={14} /></div>
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
                <button onClick={() => navigate('/signup')} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all mb-6">
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
}
