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
          
          <button
            onClick={handleScrollToNotify}
            className="bg-white text-black p-3 sm:p-4 rounded-lg hover:bg-black hover:text-white flex items-center gap-2 transition-all duration-300 text-sm sm:text-base mx-auto lg:mx-0"
          >
            <Mail size={20} />
            Notify Me
          </button>
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
