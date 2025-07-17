import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient"; // Ensure this is the correct path to your Supabase client
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { InstagramIcon, TwitterIcon } from "lucide-react";
import { Mail } from "lucide-react";

const animateTeam = dynamic(() =>
  import("./animateTeam").then((mod) => mod.animateTeam), { ssr: false }
);

const BigLogo = dynamic(() => import("./bigLogo"), { ssr: false });


export default function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  async function runAnimation() {
    const mod = await import("./animateTeam");
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
    <div className="min-h-screen bg-[#e67732] text-white font-serif">
      <header className="sticky z-50 top-0 w-full bg-[#cf9d72]">
        <nav className="container mx-auto justify-between items-center py-6 px-4">
          <div className="flex items-center gap-4">
            <img className="bhashaicon w-15 h-15 rounded-full" src="/images/bhasha.jpeg" alt="bhasha" />
            <Link href="/">
              <span className="text-lg">Home</span>
            </Link>
            <Link href="/admin">
              <span className="text-lg">Admin</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <div className="mx-auto flex items-center justify-center p-10">
        <div className="flex flex-col justify-center items-center">
          <img className="bhashaicon" src="/images/bhasha.jpeg" alt="bhasha" />
          <p className="text-4xl">
            <span className="text-left">Bhasha</span>
          </p>
          <p className="text-md">Learn Indian Languages</p>
        </div>
      </div>

      <div className="flex justify-center items-center mx-auto p-10">
        <BigLogo />
      </div>

      <div className="flex justify-center items-center mx-auto p-20">
        <button className="bg-white text-black p-4 rounded-lg hover:bg-black hover:text-white flex items-center gap-2">
          <Mail size={20} /> Notify Me
        </button>
      </div>

      <section className="w-full flex flex-col items-center p-10 bg-white">
        <div className="w-full max-w-6xl text-left text-[#e67732]">
          <h1 className="text-5xl font-bold py-10">Who we are?</h1>
          <p className="text-lg py-2">
            Bhāsha was founded with the goal of making Indian language learning as simple as possible.
          </p>
          <p className="text-lg py-2">
            Currently, there are limited resources to learn Indian languages online, which are not customizable to a
            user’s personalized needs.
          </p>
          <p className="text-lg py-2">
            Our vision is to offer all of India’s major languages in one app, and to spearhead a movement to spread
            awareness on the beauty and rich history of Indian languages.
          </p>
          <p className="text-lg py-2">Choose a language and we’ll take care of the rest.</p>

          <p className="text-2xl italic font-bold py-5">Join Us.</p>
        </div>
      </section>


      <section className="container flex flex-col items-left mx-auto p-10">
        <h1 className="text-5xl font-bold py-10">Meet The Team</h1>
        <div className="container grid grid-cols-3 gap-5">
          {[
            { name: "Shrivas Manglampalli", role: "CEO" },
            { name: "Gurtej Bagga", role: "CTO" },
            { name: "Sri Kotala", role: "Lead Software Developer" },
            { name: "Amvi Dwivedi", role: "Marketer" },
            { name: "Abhinav Jain", role: "Developer" },
            { name: "Rhythm Chawla", role: "Developer" }
          ].map((member, index) => (
            <div key={index} className="team-column flex flex-col items-center">
              <img className="rounded-full w-32 h-32" src="/images/bhasha.jpeg" alt={member.name} />
              <p className="text-lg font-bold">{member.name}</p>
              <p className="text-md">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="container flex flex-col items-left mx-auto p-10">
          <h1 className="text-4xl text-black font-bold py-10">Get Notified</h1>
          {isSubmitted ? (
            <p className="text-lg text-green-600">Thank you! You will be notified soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <input
                type="text"
                placeholder="Name (eg. John Doe)..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-4 bg-gray-100 rounded-lg w-96"
              />
              <input
                type="email"
                placeholder="Email (eg.johndoe@abc.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-4 bg-gray-100 rounded-lg w-96"
              />
              {error && <p className="text-red-600">{error}</p>}
              <button className="bg-black text-white w-48 my-10 p-4 rounded-2xl hover:bg-gray-300 hover:text-black">
                Notify Me
              </button>
            </form>
          )}
        </div>
      </section>


      <section className="bg-black text-white p-10">
        <div className="container mx-auto text-center p-10 mb-16">
          <h1 className="text-4xl font-bold mb-6">Follow Us</h1>
          <div className="flex justify-center gap-6 pb-6">
            <Link href="https://www.instagram.com/learnwithbhasha?igsh=YjdhaHh4amU1YWdj" target="_blank">
              <InstagramIcon size={32} />
            </Link>
            <Link href="" target="_blank">
              <TwitterIcon size={32} />
            </Link>
          </div>
          <p className="text-sm mb-6">© 2025 Bhasha. All rights reserved.</p>
          <Link href="/admin" className="bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-700">
            Admin
          </Link>   
        </div>
      </section>
    
      <div className="fixed bottom-0 right-0 p-4">
        
      </div>
    </div>
  );
}
