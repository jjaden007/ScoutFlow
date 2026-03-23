import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export default function AuthPage({ mode }: AuthPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/gmail.send',
          queryParams: { access_type: 'offline', prompt: 'consent' },
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
            <Sparkles className="text-white" size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tighter">Scoutflow</span>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">
          {mode === 'login' ? 'Welcome Back' : 'Get Started'}
        </h1>
        <p className="text-slate-500 text-center mb-8 font-medium">
          {mode === 'login' ? 'Sign in with your Google account to continue.' : 'Join 500+ agencies scaling with Scoutflow.'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
