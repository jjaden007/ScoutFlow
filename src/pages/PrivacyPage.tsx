import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Nav */}
      <nav className="h-20 border-b border-slate-100 px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
            <Sparkles className="text-white" size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tighter">Scoutflow</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          ← Back to Home
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-slate-400 text-sm font-medium mb-16">Last updated: March 14, 2026</p>

        <div className="space-y-12 text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Overview</h2>
            <p>
              Scoutflow ("we", "us", or "our") operates a subscription-based AI prospecting platform. This Privacy Policy explains what personal information we collect, how we use it, and what rights you have over it. By creating an account or using Scoutflow, you agree to the practices described here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Account Information</h3>
                <p>When you sign up, we collect your email address and password (stored as a salted hash via Supabase Auth). If you sign in with Google, we receive your name and email from Google.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Profile & Business Information</h3>
                <p>During onboarding you provide your full name, agency name, business website, and a description of your services. This information is used solely to personalise AI-generated content (audits, outreach, action plans) on your behalf.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Payment Information</h3>
                <p>Payments are processed by Stripe. We never store your card details. We retain your Stripe Customer ID and subscription status to manage your access to the platform.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Email Configuration</h3>
                <p>If you configure SMTP credentials to send outreach emails, those credentials are stored encrypted (AES-256-CBC) in our database and are used only to send emails you explicitly trigger.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Lead Data</h3>
                <p>Leads you discover and save, including AI-generated audit reports, outreach messages, and action plans, are stored and associated with your account. This data is private to you and is never shared with third parties.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Usage Data</h3>
                <p>We may collect standard server logs including IP addresses, browser type, and pages visited for security and debugging purposes. We do not use third-party analytics trackers.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To create and manage your account</li>
              <li>To process subscription payments via Stripe</li>
              <li>To generate AI-powered audits and outreach using Google Gemini, personalised with your business profile</li>
              <li>To send emails from the platform on your behalf when you trigger a send action</li>
              <li>To provide customer support</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
            <p className="mt-4">We do not sell your personal information. We do not use your lead data or business profile to train AI models.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services to operate the platform:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="font-bold text-slate-800">Supabase</span> — authentication and database hosting</li>
              <li><span className="font-bold text-slate-800">Stripe</span> — payment processing</li>
              <li><span className="font-bold text-slate-800">Google Gemini API</span> — AI content generation (audits, outreach, action plans)</li>
              <li><span className="font-bold text-slate-800">Google OAuth</span> — optional sign-in and Gmail integration</li>
              <li><span className="font-bold text-slate-800">Vercel</span> — infrastructure and hosting</li>
            </ul>
            <p className="mt-4">Each service operates under its own privacy policy. We share only the minimum data necessary for each service to function.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. If you cancel your subscription and request account deletion, we will delete your personal information and lead data within 30 days, except where we are required to retain it for legal or financial compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access a copy of the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Object to or restrict certain processing</li>
              <li>Data portability (receive your data in a machine-readable format)</li>
            </ul>
            <p className="mt-4">To exercise any of these rights, contact us at <span className="text-indigo-600 font-bold">privacy@scoutflow.xyz</span>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">7. Security</h2>
            <p>
              We use industry-standard security practices including encrypted connections (HTTPS), encrypted storage of sensitive credentials, and access controls. No system is perfectly secure; if you believe your account has been compromised, contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">8. Children</h2>
            <p>
              Scoutflow is intended for business use by adults. We do not knowingly collect personal information from anyone under 16. If you believe a minor has created an account, please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We will notify you of material changes by email or by displaying a notice in the app. Continued use of Scoutflow after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">10. Contact</h2>
            <p>
              For any privacy-related questions or requests, please email us at{' '}
              <span className="text-indigo-600 font-bold">privacy@scoutflow.xyz</span>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-slate-100 py-10 text-center text-sm text-slate-400">
        <div className="flex justify-center gap-8 font-bold uppercase tracking-widest">
          <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
        </div>
        <p className="mt-4">© 2026 Scoutflow. All rights reserved.</p>
      </footer>
    </div>
  );
}
