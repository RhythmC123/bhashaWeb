import React, { useState } from "react";
import IndianFlag3D from "@/components/IndianFlag3D";

export default function NotifySection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [animateBird, setAnimateBird] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    setAnimateBird(true);

    // Simulate delay for bird animation duration (3s)
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
          <h1 className="text-4xl text-black font-bold py-10">Get Notified</h1>

          {isSubmitted ? (
            <p className="text-lg text-green-600">Thank you! You will be notified soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                placeholder="Email (eg.johndoe@abc.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-4 bg-gray-100 rounded-lg w-96"
                disabled={animateBird}
              />
              {error && <p className="text-red-600">{error}</p>}
              <button
                disabled={animateBird}
                className={`bg-black text-white w-48 my-10 p-4 rounded-2xl hover:bg-gray-300 hover:text-black transition-colors duration-300 ${
                  animateBird ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Notify Me
              </button>
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