import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0f07] to-[#2d0d00] text-white flex flex-col">
      {/* Header */}
      <header className="w-full">
        <div className="container mx-auto flex items-center justify-between py-6 px-6">
          <div className="flex items-center gap-3">
            <img src="/images/bhasha.jpeg" alt="Bhasha" className="h-10 w-10 rounded-full ring-2 ring-orange-300/60 shadow-lg" />
            <div>
              <p className="text-xl font-extrabold tracking-tight">Bhasha</p>
              <p className="text-xs text-orange-200/80">Company Mobile App</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <Link href="/" className="text-orange-200/80 hover:text-orange-100 transition-colors">Home</Link>
            <Link href="/privacy" className="text-orange-200/80 hover:text-orange-100 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-orange-200/80 hover:text-orange-100 transition-colors">Terms</Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-3xl">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10">
            {/* Visual / Illustration */}
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated graphic: soft phone silhouette */}
              <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/30 to-amber-300/20 blur-xl animate-pulse" />
                <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/30 border border-orange-300/20 shadow-lg flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-orange-200">
                    <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* Main copy */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
                  We’re getting things ready for you!
                </h1>
                <p className="text-orange-100/90">Hang tight while our mobile app launches…</p>
              </div>

              {/* Progress Indicator */}
              <div className="w-full max-w-xl mt-2">
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 animate-progress" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-orange-100/80 text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-orange-300 animate-pulse" />
                  Launching…
                </div>
              </div>

              {/* Encouragement + Links */}
              <div className="w-full max-w-xl mt-6 space-y-4">
                <p className="text-orange-100/90">
                  Feel free to grab a coffee, stretch, or check your messages. We’ll notify you as soon as your app is ready!
                </p>
                <div className="flex items-center justify-center gap-2 text-orange-100/90 text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-orange-200 animate-bounce">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  You’ll get a notification when the app is ready!
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes progressMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-progress {
            position: relative;
            width: 30%;
            border-radius: 9999px;
            animation: progressMove 1.6s linear infinite;
          }
        `}</style>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 text-center text-xs text-orange-200/70">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© Bhasha 2025</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-orange-100 transition-colors">Privacy</Link>
            <span className="text-orange-200/40">|</span>
            <Link href="/terms" className="hover:text-orange-100 transition-colors">Terms</Link>
            <span className="text-orange-200/40">|</span>
            <span className="italic">“Learning one word at a time.”</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

