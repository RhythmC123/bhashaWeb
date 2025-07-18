import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function useTeamAnimation() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    gsap.registerPlugin(ScrollTrigger);
    const columns = document.querySelectorAll(".team-column");

    columns.forEach((col, index) => {
      let xPercentVal = 0;
      let scaleVal = 1;
      let blurVal = 0;
      let transformOriginVal = "50% 50%";

      // Set different starting properties for variety
      if (index % 3 === 0) {
        xPercentVal = -400;
        scaleVal = 0.6;
        blurVal = 10;
        transformOriginVal = "0% 50%";
      } else if (index % 3 === 1) {
        xPercentVal = 0;
        scaleVal = 0.7;
        blurVal = 5;
        transformOriginVal = "50% 50%";
      } else {
        xPercentVal = 400;
        scaleVal = 0.6;
        blurVal = 10;
        transformOriginVal = "100% 50%";
      }

      gsap.fromTo(
        col,
        {
          xPercent: xPercentVal,
          scale: scaleVal,
          filter: `blur(${blurVal}px)`,
          opacity: 0,
          transformOrigin: transformOriginVal,
        },
        {
          xPercent: 0,
          scale: 1,
          filter: "blur(0px)",
          opacity: 1,
          transformOrigin: transformOriginVal,
          scrollTrigger: {
            trigger: col,
            start: "top 80%",
            end: "top 60%",
            scrub: 1,
          },
        }
      );
    });
  }, []);
}
