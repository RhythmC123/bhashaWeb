// components/Navbar.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
        
        {/* Mobile menu button */}
        <div className="sm:hidden">
          <button className="text-white hover:text-orange-200 transition-colors duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
