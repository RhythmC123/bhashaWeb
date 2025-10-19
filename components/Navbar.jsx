// components/Navbar.jsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-gradient-to-r from-orange-500/90 to-orange-600/90 backdrop-blur-md shadow-2xl border-b border-orange-400/30" 
          : "bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center py-6 px-6">
        <div className="flex items-center gap-4 md:gap-6">
          <img
            src="/images/bhasha.jpeg"
            alt="Bhasha logo"
            className="w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ring-2 ring-orange-300/50"
          />
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            <a
              href="/"
              className="text-lg font-semibold transition-all duration-300 text-white hover:text-orange-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-orange-500/20"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-lg font-semibold transition-all duration-300 text-white hover:text-orange-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-orange-500/20"
            >
              About Us
            </a>
            <a
              href="#team"
              className="text-lg font-semibold transition-all duration-300 text-white hover:text-orange-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-orange-500/20"
            >
              Team
            </a>
          </div>
        </div>
        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button className="text-white hover:text-orange-2 00 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Auth-aware action */}
          {session?.user ? (
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="hidden sm:inline px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-900/30 hover:from-orange-600 hover:to-orange-700 transition-colors"
            >
              Dashboard
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="hidden sm:inline rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
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
      </nav>

      {/* Smooth scroll CSS */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </header>
  );
}
