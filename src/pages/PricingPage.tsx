import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { createCheckoutSession } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PricingPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    await refreshUser();
    setIsRefreshing(false);
    navigate('/dashboard');
  };

  return (
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
            onClick={handleSubscribe}
            disabled={isSubscribing || isRefreshing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubscribing ? <Loader2 className="animate-spin" size={24} /> : null}
            {isSubscribing ? 'Redirecting to Stripe...' : 'Subscribe & Access Dashboard'}
          </button>

          <button
            onClick={handleRefreshStatus}
            disabled={isSubscribing || isRefreshing}
            className="w-full bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isRefreshing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
            {isRefreshing ? 'Checking status...' : 'Already paid? Refresh Status'}
          </button>
        </div>

        <p className="text-slate-400 text-sm font-medium mt-8 flex items-center justify-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-500" />
          Secure payment via Stripe
        </p>
      </motion.div>
    </div>
  );
}
