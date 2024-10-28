import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import imagesLoaded from "imagesloaded"; // Import imagesLoaded

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Marquee = () => {
  useEffect(() => {
    const images = gsap.utils.toArray("img");
    // const loader = document.querySelector(".loader--text");

    // const updateProgress = (instance) =>
    //   (loader.textContent = `${Math.round(
    //     (instance.progressedCount * 100) / images.length
    //   )}%`);

    const showDemo = () => {
      document.body.style.overflow = "auto";
      document.scrollingElement.scrollTo(0, 0);
      //gsap.to(document.querySelector(".loader"), { autoAlpha: 0 });

      gsap.utils.toArray("section").forEach((section, index) => {
        const w = section.querySelector(".wrapper");
        const [x, xEnd] =
          index % 2
            ? ["100%", (w.scrollWidth - section.offsetWidth) * -1]
            : [w.scrollWidth * -1, 0];

        gsap.fromTo(
          w,
          { x },
          {
            x: xEnd,
            scrollTrigger: {
              trigger: section,
              scrub: 0.5,
              onLeave: () => gsap.to(w, { x }), // Reset position when leaving
              onEnterBack: () => gsap.to(w, { x: xEnd }), // Resume animation when entering back
            },
          }
        );
      });
    };

    // Wait until all images are loaded
    imagesLoaded(images).on("always", showDemo);
  }, []);

  return (
    <div className="demo-wrapper overflow-hidden">
      <section className="demo-text">
        <div className="wrapper text instrument">ST. GEORGE'S SUITS </div>
      </section>
    
      <section className="demo-gallery">
        <ul className="wrapper">
          <li>
            <img src="../images/a1.png" className="w-96 h-96" />
          </li>
          <li>
            <img src="../images/a2.png" className="w-96 h-96" />
          </li>
          <li>
            <img src="../images/a3.png" className="w-96 h-96" />
          </li>
        </ul>
      </section>
      <section className="demo-gallery">
        <ul className="wrapper">
          <li>
            <img
              src="http://localhost:3000/images/c2.png"
              className="w-96 h-96"
            />
          </li>
          <li>
            <img
              src="http://localhost:3000/images/c1.png"
              className="w-96 h-96"
            />
          </li>
          <li>
            <img
              src="http://localhost:3000/images/c3.png"
              className="w-96 h-96"
            />
          </li>
        </ul>
      </section>
      {/* Repeat sections as needed */}
      <section className="demo-text">
        <div className="wrapper text instrument">ST. GEORGE'S SUITS </div>
      </section>
    </div>
  );
};

export default Marquee;
