import React, { useState, useEffect, useRef } from "react";
import supabase from "@/lib/supabaseClient"; // Ensure this is the correct path to your Supabase client
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
  const [showBetaPlatforms, setShowBetaPlatforms] = useState(false);
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
    <div className="min-h-screen bg-black text-white font-serif overflow-x-hidden" style={{ maxWidth: '100vw', width: '100%' }}>
      <Navbar />

      {/* Main content */}
      <div className="min-h-screen bg-black flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 py-10 gap-8 lg:gap-20">
        {/* Left Side: Text */}
        <div className="text-center lg:text-left space-y-4 lg:w-1/2 order-2 lg:order-1">
          <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-extrabold tracking-tight text-[#e67732] afacad leading-tight">
            Bhasha
          </h1>
          <div className="w-[70%] h-[2px] bg-green-500 mt-6 lg:mt-10 mx-auto lg:mx-0 lg:ml-[15%]" />        

          <p className="text-2xl sm:text-3xl lg:text-5xl text-white opacity-80 font-light">
            Learn Indian Languages
          </p>
          <p className="text-2xl sm:text-3xl lg:text-5xl text-green-500 opacity-80 font-light">
            Coming soon
          </p>
          
          <div className="flex flex-col items-center gap-3 sm:gap-4 mx-auto lg:mx-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowBetaPlatforms(!showBetaPlatforms)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 rounded-lg hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 transition-all duration-300 text-sm sm:text-base font-semibold shadow-lg w-full sm:w-auto"
              >
                Get Beta Access
              </button>
              <button
                onClick={handleScrollToNotify}
                className="bg-white text-black p-3 sm:p-4 rounded-lg hover:bg-black hover:text-white flex items-center gap-2 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
              >
                <Mail size={20} />
                Notify Me
              </button>
            </div>
            
            {/* Platform Selection Buttons */}
            {showBetaPlatforms && (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto transition-all duration-300">
                <a
                  href="https://testflight.apple.com/join/eCUhtP9V"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black border-2 border-white text-white p-3 sm:p-4 rounded-lg hover:bg-white hover:text-black flex items-center gap-2 transition-all duration-300 text-sm sm:text-base font-semibold w-full sm:w-auto justify-center"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-1.44-1.88-.78-2.91-1.21-3.24-2.12-.28-.78-.02-1.94.7-3.08.7-1.09 1.54-2.19 2.52-3.27.98-1.08 2.1-2.2 3.25-3.35.78-.78 1.64-1.38 2.58-1.8 1.05-.48 2.05-.56 3.08-.08.98.45 1.99 1.01 3.24 1.64l-1.55 2.35c-.98-.61-1.88-1.1-2.72-1.5-.78-.36-1.5-.3-2.18.12-.6.38-1.2 1.02-1.82 1.68-.62.66-1.26 1.34-1.92 2.02-.66.68-1.34 1.36-2.02 2.02-.66.62-1.3 1.22-1.68 1.82-.42.68-.48 1.4-.12 2.18.4.84.89 1.74 1.5 2.72l-2.35 1.55c-.63-1.25-1.19-2.26-1.64-3.24z"/>
                  </svg>
                  iOS
                </a>
                <button
                  onClick={() => alert("Hi")}
                  className="bg-black border-2 border-green-500 text-green-500 p-3 sm:p-4 rounded-lg hover:bg-green-500 hover:text-black flex items-center gap-2 transition-all duration-300 text-sm sm:text-base font-semibold w-full sm:w-auto justify-center"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9993.9993-.9993.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9993.9993-.9993.551 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.5032C17.5902 8.2439 16.8553 7.8508 16.0446 7.8508c-2.5543 0-4.6355 2.0812-4.6355 4.6355 0 .49.0822.9618.2132 1.4116l-2.4627 1.7527c-.3058-.9348-1.177-1.6294-2.2211-1.6294-1.3126 0-2.3818 1.0692-2.3818 2.3818 0 1.3125 1.0692 2.3817 2.3818 2.3817 1.044 0 1.9152-.6946 2.2211-1.6294l2.4627 1.7527c-.131.4498-.2132.9216-.2132 1.4116 0 2.5543 2.0812 4.6355 4.6355 4.6355 2.5542 0 4.6355-2.0812 4.6355-4.6355 0-2.126-1.4447-3.9087-3.4006-4.4218zm-1.0465 8.5838c0 1.3125-1.0692 2.3817-2.3818 2.3817-1.3125 0-2.3817-1.0692-2.3817-2.3817 0-1.3126 1.0692-2.3818 2.3817-2.3818 1.3126 0 2.3818 1.0692 2.3818 2.3818z"/>
                  </svg>
                  Android
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: 3D Logo */}
        <div className="w-full lg:w-1/2 max-w-sm sm:max-w-md p-4 sm:p-6 bg-black rounded-xl shadow-2xl order-1 lg:order-2">
          <div className="w-full h-64 sm:h-80 lg:h-96">
            <Logo3D />
          </div>
        </div>
      </div>

      <section id="about" className="w-full flex justify-center bg-gray-200 py-12 sm:py-16 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-6xl text-left text-[#e67732] px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold py-6 sm:py-10">Who we are?</h1>
          <p className="text-base sm:text-lg py-2 text-black">
            Bhāsha was founded with the goal of making Indian language learning as simple as possible.
          </p>
          <p className="text-base sm:text-lg py-2 text-black">
            Currently, there are limited resources to learn Indian languages online, which are not customizable to a
            user's personalized needs.
          </p>
          <p className="text-base sm:text-lg py-2 text-black">
            Our vision is to offer all of India's major languages in one app, and to spearhead a movement to spread
            awareness on the beauty and rich history of Indian languages.
          </p>
          <p className="text-base sm:text-lg py-2 text-black">Choose a language and we'll take care of the rest.</p>

          <p className="text-xl sm:text-2xl italic font-bold py-4 sm:py-5 text-black">Join Us.</p>
        </div>
      </section>



      <section id="team" className="fade-in-section container flex flex-col items-center mx-auto p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold py-6 sm:py-10 text-center">
          Meet The Team
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
          {[
            {
              name: "Shrivas Manglampalli",
              role: "CEO",
              img: "/images/shrivas.jpeg",
            },
            {
              name: "Gurtej Bagga",
              role: "CTO",
              img: "/images/gurtej.png",
            },
            {
              name: "Rhythm Chawla",
              role: "Software Developer",
              img: "/images/rhythm.jpg",
            },
            {
              name: "Abhinav Jain",
              role: "Web Developer",
              img: "/images/abhi.png",
            },
            {
              name: "Amvi Dwivedi",
              role: "Marketer",
              img: "/images/amvi.png",
            },
          ].map((member, idx) => (
            <div
              key={idx}
              className={`team-column flex flex-col items-center ${
                idx === 4 ? "lg:-translate-x-[30px]" : idx === 5 ? "lg:translate-x-[30px]" : ""
              }`}
              data-index={idx % 3}
            >
              <img className="rounded-full w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-cover" src={member.img} alt={member.name} />
              <p className="text-base sm:text-lg font-bold mt-3 sm:mt-4 text-center">{member.name}</p>
              <p className="text-sm sm:text-md text-center">{member.role}</p>
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
