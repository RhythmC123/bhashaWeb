import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function animateStickyCards(stickyCardsRef) {
  if (typeof window === "undefined" || !stickyCardsRef.current) return;
  gsap.registerPlugin(ScrollTrigger);

  const cards = stickyCardsRef.current.querySelectorAll(".card");

  // Set initial state: first card visible (y: 0%), others off-screen (y: 100%)
  cards.forEach((card, i) => {
    if (i === 0) {
      gsap.set(card, { y: "0%", scale: 1, rotation: 0 });
      gsap.set(card.querySelector("img"), { scale: 1 });
    } else {
      gsap.set(card, { y: "100%", scale: 1, rotation: 0 });
      gsap.set(card.querySelector("img"), { scale: 1 });
    }
  });

  // Create timeline for scroll-based transitions
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sticky-section",
      start: "top top",
      end: "+=700", // or try 800, 1000 depending on feel
      scrub: 0.5,
      pin: true,
    },
  });

  // For each card (except the last), animate current card and next card
  cards.forEach((card, i) => {
    if (i < cards.length - 1) {
      const nextCard = cards[i + 1];
      const currentImg = card.querySelector("img");
      tl.to(
        card,
        {
          scale: 0.5,
          rotation: 5,
          ease: "power1.inOut",
          duration: 1,
        },
        i
      )
        .to(
          currentImg,
          {
            scale: 1.5,
            ease: "power1.inOut",
            duration: 1,
          },
          i
        )
        .to(
          nextCard,
          {
            y: "0%",
            ease: "power1.inOut",
            duration: 1,
          },
          i
        );
    }
  });

  return () => {
    tl.kill();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}
