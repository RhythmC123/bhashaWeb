import React, { useState, useEffect, useRef } from "react";
import supabase from "../supabaseClient"; // Ensure this is the correct path to your Supabase client
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { InstagramIcon, TwitterIcon } from "lucide-react";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import NotifyMe from "@/components/NotifyMe";
import Footer from "@/components/Footer";

const animateTeam = dynamic(() =>
  import("../hooks/animateTeam").then((mod) => mod.animateTeam), { ssr: false }
);

// Replace this line:
// import BigLogo from "./bigLogo";

const Logo3D = dynamic(() => import("../components/Logo3D"), { ssr: false });


export default function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const notifyRef = useRef(null);

  const handleScrollToNotify = () => {
    notifyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
  async function runAnimation() {
    const mod = await import("../hooks/animateTeam");
    mod.animateTeam();
  }

  runAnimation();
}, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      setError("Please enter both name and email.");
      return;
    }

    // Insert into Supabase
    const { data, error } = await supabase.from("notifications").insert([{ name, email }]);

    if (error) {
      setError("Failed to save your information. Please try again later.");
    } else {
      setIsSubmitted(true); // Show success message
      setName(""); // Reset the form fields
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      <Navbar />

      {/* Main content */}
      <div className="min-h-screen bg-black flex flex-col md:flex-row items-center justify-center px-6 py-10 gap-10 md:gap-20">
        {/* Left Side: Text */}
        <div className="text-center md:text-left space-y-4 md:w-1/2">
          <h1 className="text-[10rem] font-extrabold tracking-tight text-[#e67732]">
            Bhasha
          </h1>
                          <div className="w-[70%] h-[2px] bg-green-500 mt-10 ml-0 md:ml-[15%]" />        

          <p className="text-5xl text-white opacity-80 font-light">
            Learn Indian Languages
          </p>
          <p className="text-5xl text-green-500 opacity-80 font-light">
            Coming soon
          </p>
          
          <button
            onClick={handleScrollToNotify}
            className="bg-white text-black p-4 rounded-lg hover:bg-black hover:text-white flex items-center gap-2 transition-all duration-300"
          >
            <Mail size={20} />
            Notify Me
          </button>
        </div>

        {/* Right Side: 3D Logo */}
        <div className="w-full md:w-1/2 max-w-md p-6 bg-black rounded-xl shadow-2xl">
          <Logo3D />
        </div>
      </div>

      <section id="about" className="w-full flex justify-center bg-gray-200 py-16 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-6xl text-left text-[#e67732] px-4">
          <h1 className="text-5xl font-bold py-10">Who we are?</h1>
          <p className="text-lg py-2 text-black">
            Bhāsha was founded with the goal of making Indian language learning as simple as possible.
          </p>
          <p className="text-lg py-2 text-black">
            Currently, there are limited resources to learn Indian languages online, which are not customizable to a
            user’s personalized needs.
          </p>
          <p className="text-lg py-2 text-black">
            Our vision is to offer all of India’s major languages in one app, and to spearhead a movement to spread
            awareness on the beauty and rich history of Indian languages.
          </p>
          <p className="text-lg py-2 text-black">Choose a language and we’ll take care of the rest.</p>

          <p className="text-2xl italic font-bold py-5 text-black">Join Us.</p>
        </div>
      </section>



      <section id="team" className="container flex flex-col items-left mx-auto p-10">
        <h1 className="text-5xl font-bold py-10">Meet The Team</h1>
        <div className="container grid grid-cols-2 gap-5">
        {[
          { name: "Shrivas Manglampalli", role: "CEO", image: "/images/shrivas.jpeg" },
          { name: "Gurtej Bagga", role: "CTO", image: "/images/gurtej.png" },
          { name: "Abhinav Jain", role: "Developer",  image: "/images/abhi.png" }, // No image, will use default
          { name: "Rhythm Chawla", role: "Developer", image: "/images/rhythm.JPG" }
        ].map((member, index) => (
          <div key={index} className="team-column flex flex-col items-center">
            <img
              className="rounded-full w-32 h-32 object-cover"
              src={member.image || "/images/bhasha.jpeg"}
              alt={member.name}
            />
            <p className="text-lg font-bold">{member.name}</p>
            <p className="text-md">{member.role}</p>
          </div>
        ))}
      </div>

      </section>

        <div ref={notifyRef}>
          <NotifyMe />
        </div>


      <Footer />
      <div className="fixed bottom-0 right-0 p-4">
        
      </div>
    </div>
  );
}
