// components/Footer.jsx
import Link from "next/link";
import { InstagramIcon, TwitterIcon } from "lucide-react"; // Replace with your icon source

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-12">
      <div className="container mx-auto text-center">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-6 tracking-wide">Follow Us</h2>

        {/* Icons */}
        <div className="flex justify-center gap-6 mb-8">
          <Link
            href="https://www.instagram.com/learnwithbhasha?igsh=YjdhaHh4amU1YWdj"
            target="_blank"
            className="transition-all duration-300 hover:text-[#e67732]"
          >
            <InstagramIcon size={32} />
          </Link>
          <Link
            href=""
            target="_blank"
            className="transition-all duration-300 hover:text-[#e67732]"
          >
            <TwitterIcon size={32} />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400 mb-4">© 2025 Bhasha. All rights reserved.</p>

        {/* Optional admin link */}
        {/* 
        <Link
          href="/admin"
          className="inline-block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-[#e67732] transition-colors duration-300"
        >
          Admin
        </Link>
        */}
      </div>
    </footer>
  );
}
