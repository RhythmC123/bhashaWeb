import React, { useState, useEffect, useRef } from "react";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import NotifyMe from "@/components/NotifyMe";
import Footer from "@/components/Footer";

const Logo3D = dynamic(() => import("../components/Logo3D"), { ssr: false });


export default function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Auto-advance slider for mobile
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(slideInterval);
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
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-stone-100 font-sans" style={{ maxWidth: "100vw", width: "100%" }}>
      <Navbar />

      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.14),_transparent_35%),linear-gradient(180deg,#0a0a0a_0%,#050505_100%)] flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 py-12 gap-10 lg:gap-20">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-32 left-[-8rem] h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10 text-center lg:text-left space-y-6 lg:w-1/2 order-2 lg:order-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm uppercase tracking-[0.3em] text-orange-300">
            Language learning for the modern learner
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-[8.5rem] font-semibold tracking-tight text-white leading-[0.92]">
            Bhasha
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-orange-400 via-orange-500 to-transparent mx-auto lg:mx-0" />

          <p className="text-xl sm:text-2xl lg:text-4xl text-stone-200 font-light leading-relaxed">
            Learn Indian Languages
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl text-stone-400 font-light">
            Download Now!
          </p>

          <div className="flex flex-col items-center gap-4 mx-auto lg:mx-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                className="bg-orange-500 text-black px-5 py-3.5 sm:px-6 sm:py-4 rounded-full hover:bg-orange-400 flex items-center gap-2 transition-all duration-300 text-sm sm:text-base font-semibold shadow-[0_18px_40px_rgba(249,115,22,0.25)] w-full sm:w-auto"
              >
                Download Bhasha!
              </button>
              <button
                onClick={handleScrollToNotify}
                className="bg-white/5 text-white border border-white/10 px-5 py-3.5 sm:px-6 sm:py-4 rounded-full hover:bg-white/10 flex items-center gap-2 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
              >
                <Mail size={20} />
                Get Bhasha news
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-stone-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Self-paced</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Structured curriculum</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Indian languages</span>
            </div>

            {showDownloadOptions && (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto transition-all duration-300">
                <a
                  href="https://apps.apple.com/us/app/learn-with-bhasha/id6755058645"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 border border-white/10 text-white px-5 py-3.5 sm:px-6 sm:py-4 rounded-full hover:bg-white/10 flex items-center gap-2 transition-all duration-300 text-sm sm:text-base font-semibold w-full sm:w-auto justify-center"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-1.44-1.88-.78-2.91-1.21-3.24-2.12-.28-.78-.02-1.94.7-3.08.7-1.09 1.54-2.19 2.52-3.27.98-1.08 2.1-2.2 3.25-3.35.78-.78 1.64-1.38 2.58-1.8 1.05-.48 2.05-.56 3.08-.08.98.45 1.99 1.01 3.24 1.64l-1.55 2.35c-.98-.61-1.88-1.1-2.72-1.5-.78-.36-1.5-.3-2.18.12-.6.38-1.2 1.02-1.82 1.68-.62.66-1.26 1.34-1.92 2.02-.66.68-1.34 1.36-2.02 2.02-.66.62-1.3 1.22-1.68 1.82-.42.68-.48 1.4-.12 2.18.4.84.89 1.74 1.5 2.72l-2.35 1.55c-.63-1.25-1.19-2.26-1.64-3.24z" />
                  </svg>
                  iOS
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.bhasha.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 border border-orange-500/60 text-orange-300 px-5 py-3.5 sm:px-6 sm:py-4 rounded-full hover:bg-orange-500 hover:text-black flex items-center gap-2 transition-all duration-300 text-sm sm:text-base font-semibold w-full sm:w-auto justify-center"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9993.9993-.9993.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9993.9993-.9993.551 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.5032C17.5902 8.2439 16.8553 7.8508 16.0446 7.8508c-2.5543 0-4.6355 2.0812-4.6355 4.6355 0 .49.0822.9618.2132 1.4116l-2.4627 1.7527c-.3058-.9348-1.177-1.6294-2.2211-1.6294-1.3126 0-2.3818 1.0692-2.3818 2.3818 0 1.3125 1.0692 2.3817 2.3818 2.3817 1.044 0 1.9152-.6946 2.2211-1.6294l2.4627 1.7527c-.131.4498-.2132.9216-.2132 1.4116 0 2.5543 2.0812 4.6355 4.6355 4.6355 2.5542 0 4.6355-2.0812 4.6355-4.6355 0-2.126-1.4447-3.9087-3.4006-4.4218zm-1.0465 8.5838c0 1.3125-1.0692 2.3817-2.3818 2.3817-1.3125 0-2.3817-1.0692-2.3817-2.3817 0-1.3126 1.0692-2.3818 2.3817-2.3818 1.3126 0 2.3818 1.0692 2.3818 2.3818z" />
                  </svg>
                  Android
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 w-full lg:w-1/2 max-w-sm sm:max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl order-1 lg:order-2">
          <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-stone-400">
            <span className="text-orange-300">Bhasha</span>
          </div>
          <div className="w-full h-64 sm:h-80 lg:h-96 rounded-[1.5rem] bg-black/40">
            <Logo3D />
          </div>
        </div>
      </section>

      <section id="about" className="w-full flex justify-center border-y border-white/5 bg-[#0b0b0b] py-16 sm:py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.08),_transparent_30%)]" />
        <div className="relative z-10 w-full max-w-7xl text-left px-4 sm:px-6">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-orange-400" />
            <span className="text-xs uppercase tracking-[0.35em] text-orange-300">About the product</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">What is Bhasha?</h1>

              <div className="mt-6 max-w-3xl space-y-5 text-base sm:text-lg text-stone-300 leading-8">
                <p>
                  Bhasha is built for the modern learner. Instead of forcing a rigid course on you, we give you the ability to learn your way, at your own pace, using a plethora of open-world language learning tools.
                </p>

                <p>
                  Oh, and we also have a fantastic hand-crafted curriculum, so you can take both the structured and the open-world approach to learning.
                </p>

                <p>
                  Or you can take both at the same time. It's your choice, and that's what makes Bhasha special.
                </p>

                <p>
                  With Bhasha, you'll learn grammar, pronunciation and script. You'll pick up useful phrases, understand sentence patterns and gain the confidence to speak naturally.
                </p>

                <p>
                  The best part? You'll decide how you learn.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-white/[0.03] to-white/[0.01] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm uppercase tracking-[0.25em] text-orange-300">Available languages</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white">Hindi</span>
                      <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white">Telugu</span>
                      <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white">Tamil</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
                  More languages coming soon!
                </div>
              </div>
            </div>

            <div className="hidden lg:block rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <Image
                src="/images/vaani.png"
                alt="Vaani the Bhasha mascot"
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 bg-[#070707]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-orange-400" />
            <span className="text-xs uppercase tracking-[0.35em] text-orange-300">Product highlights</span>
          </div>

          <div className="hidden md:grid grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="flex justify-center rounded-[1.75rem] border border-white/10 bg-white/5 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <Image src="/images/1.png" alt="Bhasha feature 1" width={320} height={320} className="w-full h-auto max-w-xs" />
            </div>
            <div className="flex justify-center rounded-[1.75rem] border border-white/10 bg-white/5 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <Image src="/images/2.png" alt="Bhasha feature 2" width={320} height={320} className="w-full h-auto max-w-xs" />
            </div>
            <div className="flex justify-center rounded-[1.75rem] border border-white/10 bg-white/5 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <Image src="/images/3.png" alt="Bhasha feature 3" width={320} height={320} className="w-full h-auto max-w-xs" />
            </div>
            <div className="flex justify-center rounded-[1.75rem] border border-white/10 bg-white/5 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <Image src="/images/4.png" alt="Bhasha feature 4" width={320} height={320} className="w-full h-auto max-w-xs" />
            </div>
          </div>

          <div className="md:hidden overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3" style={{ height: "400px", touchAction: "pan-y" }}>
            <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              <div className="min-w-full flex items-center justify-center h-full flex-shrink-0">
                <Image src="/images/1.png" alt="Bhasha feature 1" width={400} height={400} className="w-full h-full object-contain" style={{ touchAction: "none", userSelect: "none" }} draggable={false} />
              </div>
              <div className="min-w-full flex items-center justify-center h-full flex-shrink-0">
                <Image src="/images/4.png" alt="Bhasha feature 4" width={400} height={400} className="w-full h-full object-contain" style={{ touchAction: "none", userSelect: "none" }} draggable={false} />
              </div>
              <div className="min-w-full flex items-center justify-center h-full flex-shrink-0">
                <Image src="/images/2.png" alt="Bhasha feature 2" width={400} height={400} className="w-full h-full object-contain" style={{ touchAction: "none", userSelect: "none" }} draggable={false} />
              </div>
              <div className="min-w-full flex items-center justify-center h-full flex-shrink-0">
                <Image src="/images/3.png" alt="Bhasha feature 3" width={400} height={400} className="w-full h-full object-contain" style={{ touchAction: "none", userSelect: "none" }} draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="fade-in-section container flex flex-col items-center mx-auto px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-orange-400" />
          <span className="text-xs uppercase tracking-[0.35em] text-orange-300">Meet the team</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold py-4 sm:py-6 text-center text-white">
          Meet The Team
        </h1>
        <p className="max-w-2xl text-center text-stone-400 leading-8">
          might be biased but I think they're really cool
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-stretch w-full">
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
              name: "Amvi Dwivedi",
              role: "Head of Marketing",
              img: "/images/amvi.png",
            },
          ].map((member, idx) => (
            <div
              key={idx}
              className="team-column flex flex-col items-center rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:bg-white/[0.08]"
              data-index={idx % 3}
            >
              <Image className="rounded-full w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-cover ring-4 ring-orange-500/20" src={member.img} alt={member.name} width={128} height={128} />
              <p className="text-base sm:text-lg font-semibold mt-4 text-center text-white">{member.name}</p>
              <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-orange-300 mt-2">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0a0a0a] border-t border-white/5 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div ref={notifyRef} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <NotifyMe />
          </div>
        </div>
      </section>

      <Footer />
      <div className="fixed bottom-0 right-0 p-4"></div>
    </div>
  );
}
