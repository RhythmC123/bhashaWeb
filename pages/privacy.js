import Link from 'next/link'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0f07] to-[#2d0d00] text-white flex flex-col">
      {/* Header */}
      <header className="w-full">
        <div className="container mx-auto flex items-center justify-between py-6 px-6">
          <div className="flex items-center gap-3">
            <img src="/images/bhasha.jpeg" alt="Bhasha" className="h-10 w-10 rounded-full ring-2 ring-orange-300/60 shadow-lg" />
            <div>
              <p className="text-xl font-extrabold tracking-tight">Bhasha</p>
              <p className="text-xs text-orange-200/80">Privacy Policy</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent mb-6">Privacy Policy</h1>

            <p className="text-orange-100/90 mb-6">Last updated: 2025-10-19</p>

            <p className="text-orange-100/90 mb-6">We value your privacy. This policy explains what information we collect, how we use it, and the choices you have. It’s written to be clear and friendly, similar to language-learning platforms like Duolingo.</p>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2 text-orange-100/90">
                <li><span className="font-medium">Account info</span>: name, email, avatar (if you sign in with Google).</li>
                <li><span className="font-medium">Usage data</span>: device type, interactions, pages visited, approximate location (based on IP) to improve the experience.</li>
                <li><span className="font-medium">Cookies</span>: small files to keep you signed in, remember preferences, and measure performance.</li>
              </ul>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">How We Use Information</h2>
              <ul className="list-disc pl-5 space-y-2 text-orange-100/90">
                <li>Provide and personalize the learning experience.</li>
                <li>Maintain account security and prevent abuse.</li>
                <li>Analyze performance and improve features.</li>
                <li>Send service updates, tips, and announcements (you can opt out of non-essential emails).</li>
              </ul>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">Data Sharing</h2>
              <p className="text-orange-100/90">We do not sell your personal data. We may share limited information with trusted providers (e.g., authentication, analytics, hosting) to operate the service. These providers must safeguard your data and use it only for our purposes. We may also share information to comply with law, protect safety, or enforce our terms.</p>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">Your Choices</h2>
              <ul className="list-disc pl-5 space-y-2 text-orange-100/90">
                <li><span className="font-medium">Access & update</span>: You can update your profile information in the app.</li>
                <li><span className="font-medium">Email preferences</span>: You can opt out of non-essential emails.</li>
                <li><span className="font-medium">Cookies</span>: You can control cookies via your browser settings; some features may not work without them.</li>
                <li><span className="font-medium">Delete account</span>: Contact support to request deletion. We will remove your data unless we need to retain it to meet legal obligations.</li>
              </ul>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">Children’s Privacy</h2>
              <p className="text-orange-100/90">Our service is not directed to children under 13. If you believe a child has provided personal information, please contact us and we will take appropriate steps to remove it.</p>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">Security</h2>
              <p className="text-orange-100/90">We use reasonable technical and organizational measures to protect your data. No online service can be 100% secure, but we work to protect your information and continuously improve our safeguards.</p>
            </section>

            <section className="space-y-3 mb-8">
              <h2 className="text-lg font-semibold text-orange-100">Changes to This Policy</h2>
              <p className="text-orange-100/90">We may update this policy from time to time. If changes are significant, we will provide a prominent notice in the app or via email.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-orange-100">Contact</h2>
              <p className="text-orange-100/90">Questions or requests? Contact Support from within the app or via our website.</p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 text-center text-xs text-orange-200/70">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© Bhasha 2025</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-orange-100 transition-colors">Terms</Link>
            <span className="text-orange-200/40">|</span>
            <Link href="/" className="hover:text-orange-100 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

