// components/Navbar.jsx
import { useEffect, useState, useMemo, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";

// Separate Mobile Menu Button Component - isolated from session state, memoized
const MobileMenuButton = memo(function MobileMenuButton({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="sm:hidden text-white p-2 hover:bg-orange-500/20 rounded-lg transition-colors bg-orange-500/30 backdrop-blur-sm min-w-[40px] min-h-[40px] flex items-center justify-center"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      style={{ 
        display: 'block',
        position: 'relative',
        visibility: 'visible',
        zIndex: 10000,
        pointerEvents: 'auto'
      }}
    >
      {isOpen ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
});

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    // Set initial scroll state
    setScrolled(window.scrollY > 10);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useMemo(() => () => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useMemo(() => () => {
    setIsMenuOpen(false);
  }, []);

  const handleLinkClick = (href) => {
    closeMenu();
    if (href.startsWith('#')) {
      router.push(href);
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-[9999] transition-all duration-500 ${
          scrolled 
            ? "bg-gradient-to-r from-orange-500/90 to-orange-600/90 backdrop-blur-md shadow-2xl border-b border-orange-400/30" 
            : "bg-gradient-to-r from-orange-500/80 to-orange-600/80 backdrop-blur-md sm:bg-gradient-to-r sm:from-orange-500/20 sm:to-orange-600/20 sm:backdrop-blur-sm"
        }`}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          maxWidth: '100vw',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}
      >
        <nav className="w-full max-w-full mx-auto flex justify-between items-center py-4 sm:py-6 px-4 sm:px-6" style={{ maxWidth: '100%' }}>
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              src="/images/bhasha.jpeg"
              alt="Bhasha logo"
              className="w-10 h-10 rounded-full shadow-lg ring-2 ring-orange-300/50"
            />
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-4 md:gap-6 flex-1 justify-center">
            <a
              href="/"
              className="text-lg font-semibold text-white hover:text-orange-200 px-3 py-2 rounded-lg hover:bg-orange-500/20 transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-lg font-semibold text-white hover:text-orange-200 px-3 py-2 rounded-lg hover:bg-orange-500/20 transition-colors"
            >
              About Us
            </a>
            <a
              href="#team"
              className="text-lg font-semibold text-white hover:text-orange-200 px-3 py-2 rounded-lg hover:bg-orange-500/20 transition-colors"
            >
              Team
            </a>
          </div>

          {/* Right side container */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mobile Menu Button - Isolated component */}
            <MobileMenuButton isOpen={isMenuOpen} onToggle={toggleMenu} />

            {/* Desktop Auth Buttons - Hidden on mobile */}
            <div className="hidden sm:flex items-center">
              {session?.user ? (
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                  aria-label="Sign in with Google"
                >
                  <Image
                    src={require("@/components/signin-assets/Web (mobile + desktop)/png@2x/dark/web_dark_rd_SI@2x.png")}
                    alt="Sign in with Google"
                    width={200}
                    height={48}
                    priority
                  />
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-gradient-to-r from-orange-500/95 to-orange-600/95 backdrop-blur-md border-t border-orange-400/30 px-4 py-4 space-y-2">
            <button
              onClick={() => handleLinkClick('/')}
              className="w-full text-left text-lg font-semibold text-white hover:text-orange-200 px-3 py-2 rounded-lg hover:bg-orange-500/20 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleLinkClick('#about')}
              className="w-full text-left text-lg font-semibold text-white hover:text-orange-200 px-3 py-2 rounded-lg hover:bg-orange-500/20 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => handleLinkClick('#team')}
              className="w-full text-left text-lg font-semibold text-white hover:text-orange-200 px-3 py-2 rounded-lg hover:bg-orange-500/20 transition-colors"
            >
              Team
            </button>
            {session?.user ? (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  router.push('/dashboard');
                }}
                className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  router.push('/login');
                }}
                className="w-full text-left px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                aria-label="Sign in with Google"
              >
                <Image
                  src={require("@/components/signin-assets/Web (mobile + desktop)/png@2x/dark/web_dark_rd_SI@2x.png")}
                  alt="Sign in with Google"
                  width={200}
                  height={48}
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Smooth scroll CSS */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          overflow-x: hidden;
          max-width: 100vw;
        }
        body {
          overflow-x: hidden;
          max-width: 100vw;
          width: 100%;
        }
      `}</style>
    </>
  );
}
