import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export async function animateTeam() {
  if (typeof window === "undefined") return;

  const gsap = (await import("gsap")).default;
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");

  gsap.registerPlugin(ScrollTrigger);

  setTimeout(() => {
    console.log("animateTeam triggered");

    const teamColumns = document.querySelectorAll(".team-column");
    console.log("Found", teamColumns.length, "team columns");

    if (teamColumns.length === 0) return;

    // Animate hero
    gsap.fromTo(
      ".hero-content",
      { scale: 5.3, y: "55%", transformOrigin: "center center" },
      {
        scale: 1,
        y: "0%",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    // Animate team
    teamColumns.forEach((col, index) => {
      let xPercentVal = 0;
      let scaleVal = 1;
      let blurVal = 0;
      let transformOriginVal = "50% 50%";

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
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: col,
            start: "top 95%",
            end: "top 60%",
            scrub: false,
            toggleActions: "play none reverse none",
          },
        }
      );
    });
  }, 100);
}
