import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function TermsPage() {
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
        <h1 className="text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
        <p className="text-slate-400 text-sm font-medium mb-16">Last updated: March 14, 2026</p>

        <div className="space-y-12 text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Scoutflow ("the Service"), you agree to be bound by these Terms of Service. If you are using the Service on behalf of a business, you represent that you have the authority to bind that business to these terms. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
            <p>
              Scoutflow is a subscription-based SaaS platform that uses artificial intelligence to help digital agencies find local business prospects, generate digital audit reports, create personalised outreach messages, and manage a sales pipeline. Features include AI-powered business search, automated website audits, outreach generation, and email sending.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. Accounts</h2>
            <div className="space-y-4">
              <p>You must create an account to use Scoutflow. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.</p>
              <p>You must provide accurate and complete information when registering. You may not share your account with others or create accounts for the purpose of circumventing usage limits.</p>
              <p>We reserve the right to suspend or terminate accounts that violate these terms, are used for spam or abuse, or are inactive for an extended period.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Subscription & Billing</h2>
            <div className="space-y-4">
              <p>Access to Scoutflow requires an active paid subscription at <span className="font-bold text-slate-800">$20 USD per month</span>. Payments are billed monthly and processed securely by Stripe.</p>
              <p>Your subscription renews automatically each billing cycle unless you cancel. You may cancel at any time from your account settings or by contacting us. Cancellation takes effect at the end of the current billing period — no partial refunds are issued for unused time.</p>
              <p>We reserve the right to change subscription pricing with at least 30 days' notice. Continued use after the price change date constitutes acceptance of the new price.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Acceptable Use</h2>
            <p className="mb-4">You agree to use Scoutflow only for lawful business prospecting purposes. You must not:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Use the Service to send spam or unsolicited bulk communications in violation of applicable law (including CAN-SPAM, GDPR, and CASL)</li>
              <li>Attempt to scrape, reverse engineer, or access the Service through unauthorised means</li>
              <li>Use AI-generated content to impersonate others or create misleading communications</li>
              <li>Use the Service for any purpose that is illegal, harmful, or deceptive</li>
              <li>Attempt to circumvent subscription requirements or access controls</li>
              <li>Resell or sublicense access to the Service without prior written consent</li>
            </ul>
            <p className="mt-4">You are solely responsible for the content of any emails sent through Scoutflow and for compliance with all laws governing commercial electronic messages in your jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. AI-Generated Content</h2>
            <p className="mb-4">
              Scoutflow uses Google Gemini to generate audit reports, outreach messages, and action plans. You acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>AI-generated content may contain inaccuracies and should be reviewed before use</li>
              <li>You are responsible for any content you send or publish that was generated by the Service</li>
              <li>We make no guarantees about the accuracy, completeness, or effectiveness of AI-generated outputs</li>
              <li>Business information retrieved via AI web search may be outdated or incorrect</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
            <p className="mb-4">
              Scoutflow and its original content, features, and design are owned by us and protected by intellectual property law. You retain ownership of any data, leads, and content you create within the platform.
            </p>
            <p>
              By using the Service, you grant us a limited licence to store and process your data for the sole purpose of providing the Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">8. Disclaimers</h2>
            <p className="mb-4">
              The Service is provided <span className="font-bold text-slate-800">"as is"</span> without warranties of any kind, express or implied. We do not warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>The Service will be uninterrupted, error-free, or secure</li>
              <li>Results obtained from the Service (leads, audits, outreach) will generate business revenue</li>
              <li>Business data retrieved by the AI is accurate or current</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Scoutflow shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of — or inability to use — the Service. Our total liability to you for any claim arising out of these terms or your use of the Service shall not exceed the amount you paid us in the 3 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold Scoutflow harmless from any claims, damages, losses, or expenses (including legal fees) arising out of your use of the Service, your violation of these terms, or your violation of any third-party rights including privacy or intellectual property rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">11. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time, with or without notice, if you breach these terms or if we discontinue the Service. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination (including liability limitations and indemnification) will survive.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">12. Governing Law</h2>
            <p>
              These terms are governed by the laws of the jurisdiction in which Scoutflow is registered, without regard to conflict of law principles. Any disputes shall be resolved in the courts of that jurisdiction, and you consent to personal jurisdiction there.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">13. Changes to Terms</h2>
            <p>
              We may update these terms at any time. We will notify you by email or in-app notice at least 14 days before material changes take effect. Continued use of the Service after changes are effective constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">14. Contact</h2>
            <p>
              For questions about these Terms of Service, contact us at{' '}
              <span className="text-indigo-600 font-bold">legal@scoutflow.xyz</span>.
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
