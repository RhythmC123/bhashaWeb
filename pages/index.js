import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // Ensure this is the correct path to your Supabase client
import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, TwitterIcon } from "lucide-react";
import { Mail } from "lucide-react";

export default function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

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
      <header className="sticky top-0 w-full bg-[#cf9d72]">
        <nav className="container mx-auto justify-between items-center py-6 px-4">
          <div className="flex text-left gap-4">
            <Link href="https://www.instagram.com/learnwithbhasha?igsh=YjdhaHh4amU1YWdj">
              <InstagramIcon size={32} />
            </Link>

            <Link href="">
              <TwitterIcon size={32} />
            </Link>

            <Link href="/">
              <span className="text-lg">Home</span>
            </Link>
            <Link href="/">
              <span className="text-lg">About</span>
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
        <div className="space-y-4">
          <p className="text-3xl font-bold opacity-50">
            <span className="flex justify-center">જલ્દી આવે છે</span>
          </p>
          <p className="text-4xl font-bold opacity-75">
            <span className="flex justify-center">சமீபத்தில் வரும்</span>
          </p>
          <h2 className="text-5xl font-bold my-4">
            <span className="flex justify-center">Coming Soon.</span>
          </h2>
          <p className="text-4xl font-bold opacity-75">
            <span className="flex justify-center">త్వరలో వస్తుంది</span>
          </p>
          <p className="text-3xl font-bold opacity-50">
            <span className="flex justify-center">आ रहा है</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center mx-auto p-20">
        <button className="bg-white text-black p-4 rounded-lg hover:bg-black hover:text-white flex items-center gap-2">
          <Mail size={20} /> Notify Me
        </button>
      </div>

      <section className="container flex flex-col items-center mx-auto p-10">
        <div className="text-left">
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
          <div className="flex flex-col items-center">
            <img className="rounded-full w-32 h-32" src="/images/bhasha.jpeg" alt="Shrivas Manglampalli" />
            <p className="text-lg font-bold">Shrivas Manglampalli</p>
            <p className="text-md">CEO</p>
          </div>

          <div className="flex flex-col items-center">
            <img className="rounded-full w-32 h-32" src="/images/bhasha.jpeg" alt="Gurtej Bagga" />
            <p className="text-lg font-bold">Gurtej Bagga</p>
            <p className="text-md">CTO</p>
          </div>

          <div className="flex flex-col items-center">
            <img className="rounded-full w-32 h-32" src="/images/bhasha.jpeg" alt="Sri Kotala" />
            <p className="text-lg font-bold">Sri Kotala</p>
            <p className="text-md">Lead Software Developer</p>
          </div>

          <div className="flex flex-col items-center">
            <img className="rounded-full w-32 h-32" src="/images/bhasha.jpeg" alt="Amvi Dwivedi" />
            <p className="text-lg font-bold">Amvi Dwivedi</p>
            <p className="text-md">Marketer</p>
          </div>

          <div className="flex flex-col items-center">
            <img className="rounded-full w-32 h-32" src="/images/bhasha.jpeg" alt="Abhinav Jain" />
            <p className="text-lg font-bold">Abhinav Jain</p>
            <p className="text-md">Developer</p>
          </div>

          <div className="flex flex-col items-center">
            <img className="rounded-full w-32 h-32" src="/images/bhasha.jpeg" alt="Rhythm Chawla" />
            <p className="text-lg font-bold">Rhythm Chawla</p>
            <p className="text-md">Developer</p>
          </div>
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
    </div>
  );
}
