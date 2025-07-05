// components/bigLogo.js
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const messages = [
  "જલ્દી આવે છે",        // Gujarati
  "சமீபத்தில் வரும்",       // Tamil
  "Coming Soon.",         // English
  "త్వరలో వస్తుంది",        // Telugu
  "आ रहा है",            // Hindi
];

export default function BigLogo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5 }
      );
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <p ref={textRef} className="text-5xl md:text-6xl font-bold text-center">
        {messages[currentIndex]}
      </p>
    </div>
  );
}
