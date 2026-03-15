import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { signup } from '../services/api';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export default function AuthPage({ mode }: AuthPageProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        // Create the user record in our DB first
        await signup(email, password);
      }

      // Sign in via Supabase client — this sets the session in localStorage
      // and triggers the SIGNED_IN event in AuthContext, which handles navigation
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // AuthContext's SIGNED_IN handler now takes over and navigates
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
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
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-2 text-slate-400 font-bold">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          <span className="text-sm">Google Account</span>
        </button>

        <div className="mt-8 text-center">
          <Link
            to={mode === 'login' ? '/signup' : '/login'}
            className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all"
          >
            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
