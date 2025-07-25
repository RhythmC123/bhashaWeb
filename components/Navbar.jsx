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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center py-8 px-6">
        <div className="flex items-center gap-6">
          <img
            src="/images/bhasha.jpeg"
            alt="Bhasha logo"
            className="w-10 h-10 rounded-full shadow-md transition-transform duration-300 hover:scale-105"
          />
          <div>
            <a
                href="/"
              className={`text-lg font-semibold transition-colors duration-300 ${
                scrolled ? "text-black" : "text-white"
              } hover:text-[#e67732]`}
            >
              Home
            </a>
          </div>
          <a
            href="#about"
            className={`text-lg font-semibold transition-colors duration-300 ${
              scrolled ? "text-black" : "text-white"
            } hover:text-[#e67732]`}
          >
            About Us
          </a>
          <a
            href="#team"
            className={`text-lg font-semibold transition-colors duration-300 ${
              scrolled ? "text-black" : "text-white"
            } hover:text-[#e67732]`}
          >
            Team
          </a>
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
