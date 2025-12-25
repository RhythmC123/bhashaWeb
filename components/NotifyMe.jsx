import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";
import IndianFlag3D from "@/components/IndianFlag3D";
import supabase from "@/lib/supabaseClient";

export default function NotifySection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [animateBird, setAnimateBird] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const session = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill in both fields.");
      return;
    }

    setError("");
    setAnimateBird(true);

    // Insert into Supabase
    const { data, error } = await supabase.from("subscribers").insert([{ name, email }]);

    if (error) {
      console.error("Supabase Error:", error.message);
      setError("Something went wrong. Try again.");
      setAnimateBird(false);
      return;
    }

    // Proceed with animation
    setTimeout(() => {
      setIsSubmitted(true);
      setShowToast(true);
      setAnimateBird(false);
      setName("");
      setEmail("");

      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }, 3000);
  };

  return (
    <section className="bg-white relative overflow-hidden">
      <div className="container mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 p-10">
        {/* LEFT: Form */}
        <div className="flex-1">
          <h1 className="text-4xl text-black font-bold py-10"> Sign up for Bhasha News! </h1>
          <p className="text-lg text-black"> You may get updates on Bhasha, feedback forms, and beta feature access. No, we will not spam you. </p>
          {isSubmitted ? (
            <p className="text-lg text-green-600"> You'll be kept in the loop! ) </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-black">
              <input
                type="text"
                placeholder="Name (eg. John Doe)..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-4 bg-gray-100 rounded-lg w-96"
                disabled={animateBird}
              />
              <input
                type="email"
                placeholder="Email (eg. johndoe@abc.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-4 bg-gray-100 rounded-lg w-96"
                disabled={animateBird}
              />
              {error && <p className="text-red-600">{error}</p>}
              <div className="flex items-center gap-4 my-10">
                <button
                  disabled={animateBird}
                  className={`bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-300 hover:text-black transition-colors duration-300 ${
                    animateBird ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  Get News! (+1 swag)
                </button>
                {session?.user ? (
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-900/30 hover:from-orange-600 hover:to-orange-700 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    aria-label="Sign in with Google"
                  >
                    <Image
                      src={require("@/components/signin-assets/Web (mobile + desktop)/png@2x/neutral/web_neutral_rd_SI@2x.png")}
                      alt="Sign in with Google"
                      width={200}
                      height={48}
                      priority
                    />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* RIGHT: Indian Flag 3D */}
        <div className="flex-1 flex justify-center items-center">
          <IndianFlag3D />
        </div>
      </div>

      {/* Bird animation */}
      {animateBird && (
        <img
          key={Date.now()}
          src="/images/bird.gif"
          alt="Flying Bird"
          className="bird absolute top-[150px] left-[150px] w-32 h-32 pointer-events-none animate-birdFly z-50"
        />
      )}

      {/* Toast */}
      {showToast && (
        <div className="toast fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-fadeInOut">
          You have been added to the mailing list!
        </div>
      )}

      {/* Animations styles */}
      <style jsx>{`
        @keyframes birdFly {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(150px, -100px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(600px, -300px) scale(0.5);
            opacity: 0;
          }
        }
        .animate-birdFly {
          animation: birdFly 3s ease-in forwards;
          will-change: transform, opacity;
        }
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0;
          }
          10%,
          90% {
            opacity: 1;
          }
        }
        .animate-fadeInOut {
          animation: fadeInOut 3s ease forwards;
        }
      `}</style>
    </section>
  );
}
