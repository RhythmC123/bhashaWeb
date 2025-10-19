import Link from 'next/link'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0f07] to-[#2d0d00] text-white flex flex-col">
      {/* Header */}
      <header className="w-full">
        <div className="container mx-auto flex items-center justify-between py-6 px-6">
          <div className="flex items-center gap-3">
            <img src="/images/bhasha.jpeg" alt="Bhasha" className="h-10 w-10 rounded-full ring-2 ring-orange-300/60 shadow-lg" />
            <div>
              <p className="text-xl font-extrabold tracking-tight">Bhasha</p>
              <p className="text-xs text-orange-200/80">Terms & Conditions</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <Link href="/" className="text-orange-200/80 hover:text-orange-100 transition-colors">Home</Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-10">
        <div className="container mx-auto max-w-3xl">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent mb-6">Terms & Conditions</h1>

            <p className="text-orange-100/90 mb-6">Last updated: 2025-10-19</p>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">1. Acceptance of Terms</h2>
              <p className="text-orange-100/90">By accessing or using our services, you agree to these Terms. If you do not agree, please do not use the service.</p>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">2. Eligibility</h2>
              <p className="text-orange-100/90">You must be at least 13 years old to use the service. If you are under the age of majority in your jurisdiction, you must have your parent/guardian’s permission.</p>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">3. Accounts</h2>
              <ul className="list-disc pl-5 space-y-2 text-orange-100/90">
                <li>You are responsible for maintaining the security of your account and password.</li>
                <li>Do not share your account or use someone else’s account without permission.</li>
                <li>Provide accurate and up-to-date information.</li>
              </ul>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">4. Acceptable Use</h2>
              <ul className="list-disc pl-5 space-y-2 text-orange-100/90">
                <li>Use the service for lawful purposes only.</li>
                <li>Don’t attempt to disrupt or reverse engineer the service.</li>
                <li>Respect other users; no harassment, hate speech, or abusive content.</li>
              </ul>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">5. Content and Intellectual Property</h2>
              <ul className="list-disc pl-5 space-y-2 text-orange-100/90">
                <li>All content (including lessons, graphics, and branding) is protected by intellectual property laws.</li>
                <li>You may not copy, distribute, or create derivative works without permission.</li>
              </ul>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">6. Payments (If Applicable)</h2>
              <p className="text-orange-100/90">If we offer paid features, you agree to the listed pricing and billing terms. Refunds are handled according to our refund policy (if provided).</p>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">7. Third-Party Services</h2>
              <p className="text-orange-100/90">We may integrate third-party services (e.g., Google sign-in). Your use of these services is subject to their terms and privacy policies.</p>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">8. Termination</h2>
              <p className="text-orange-100/90">We may suspend or terminate access if you violate these Terms or use the service in a harmful way.</p>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">9. Disclaimers</h2>
              <p className="text-orange-100/90">The service is provided “as is” without warranties of any kind. We do not guarantee specific learning outcomes.</p>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">10. Limitation of Liability</h2>
              <p className="text-orange-100/90">To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages resulting from your use of the service.</p>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">11. Changes to These Terms</h2>
              <p className="text-orange-100/90">We may update these Terms from time to time. If changes are significant, we will notify you in the app or via email.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-orange-100">Contact</h2>
              <p className="text-orange-100/90">If you have questions, please contact Support from within the app or via our website.</p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 text-center text-xs text-orange-200/70">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© Bhasha 2025</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-orange-100 transition-colors">Privacy</Link>
            <span className="text-orange-200/40">|</span>
            <Link href="/" className="hover:text-orange-100 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

