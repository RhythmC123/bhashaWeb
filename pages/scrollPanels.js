"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

// A helper to preload images by selector
const preloadImages = (selector) => {
  const images = document.querySelectorAll(selector);
  const promises = Array.from(images).map((img) =>
    new Promise((resolve, reject) => {
      if (img.complete) {
        resolve(img);
      } else {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image: " + img.src));
      }
    })
  );
  return Promise.all(promises);
};

export default function ScrollPanelsEffect() {
  useEffect(() => {
    // Cache DOM elements needed for the animation
    const DOM = {
      sections: {
        columns: document.querySelector(".section--columns"),
        showcase: document.querySelector(".section--showcase"),
      },
      columnWraps: document.querySelectorAll(".section--columns .column-wrap"),
    };

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      lerp: 0.2,
      smooth: true,
    });
    const scrollFn = (time) => {
      lenis.raf(time);
      requestAnimationFrame(scrollFn);
    };
    requestAnimationFrame(scrollFn);

    // Create GSAP ScrollTrigger animation
    gsap
      .timeline({
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: true,
        },
      })
      .addLabel("start", 0)
      .to(
        DOM.sections.columns,
        {
          ease: "none",
          startAt: { scale: 1.1 },
          scale: 1,
        },
        "start"
      )
      .to(
        DOM.sections.columns,
        {
          scrollTrigger: {
            trigger: DOM.sections.showcase,
            start: 0,
            end: "top top",
            scrub: true,
          },
          ease: "power4.inOut",
          startAt: { opacity: 0.2 },
          opacity: 1,
          yoyo: true,
          repeat: 1,
        },
        "start"
      )
      .to(
        DOM.columnWraps,
        {
          ease: "none",
          // Apply a slight vertical offset alternating by column (3% up or down)
          yPercent: (index) => (index % 2 === 0 ? -3 : 3),
        },
        "start"
      );

    // Preload images and then remove a loading class if necessary
    preloadImages(".column__item-img")
      .then(() => {
        document.body.classList.remove("loading");
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/* Panels Section */}
      <section className="section--columns relative">
        <div className="columns flex">
          {/* Column 1: Panels 1-3 (.jpeg) */}
          <div className="column-wrap">
            <div className="column__item">
              <img
                className="column__item-img"
                src="/images/panel-1.jpeg"
                alt="Panel 1"
              />
            </div>
            <div className="column__item">
              <img
                className="column__item-img"
                src="/images/panel-2.jpeg"
                alt="Panel 2"
              />
            </div>
            <div className="column__item">
              <img
                className="column__item-img"
                src="/images/panel-3.jpeg"
                alt="Panel 3"
              />
            </div>
          </div>
          {/* Column 2: Panels 4-6 (panels 4 & 5 are .jpg, panel 6 is .jpeg) */}
          <div className="column-wrap">
            <div className="column__item">
              <img
                className="column__item-img"
                src="/images/panel-4.jpg"
                alt="Panel 4"
              />
            </div>
            <div className="column__item">
              <img
                className="column__item-img"
                src="/images/panel-5.jpg"
                alt="Panel 5"
              />
            </div>
            <div className="column__item">
              <img
                className="column__item-img"
                src="/images/panel-6.jpeg"
                alt="Panel 6"
              />
            </div>
          </div>
          {/* Column 3: Panels 7-9 (panels 7 & 8 are .jpeg, panel 9 is .jpg) */}
          <div className="column-wrap">
            <div className="column__item">
              <img
                className="column__item-img"
                src="/images/panel-7.jpeg"
                alt="Panel 7"
              />
            </div>
            <div className="column__item">
              <img
                className="column__item-img"
                src="/images/panel-8.jpeg"
                alt="Panel 8"
              />
            </div>
            <div className="column__item">
              <img
                className="column__item-img"
                src="/images/panel-9.jpg"
                alt="Panel 9"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Showcase Section (to trigger part of the scroll animation) */}
      <section className="section--showcase h-screen flex items-center justify-center">
        <h1 className="text-white text-4xl text-center">
          Scroll Down to see the effect
        </h1>
      </section>
    </>
  );
}
