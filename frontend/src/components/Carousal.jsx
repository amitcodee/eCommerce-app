import React, { useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { NavLink } from "react-router-dom";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

const responsive = {
  0: { items: 1 },
  568: { items: 1 },
  1024: { items: 1 },
};

const handleDragStart = (e) => e.preventDefault();

const hero = {
  hero1: {
    src: "../images/b1.png",
    para: "Sale! up to 50% off!",
    heading: "Stylish Looks For Any Season",
  },
  hero2: {
    src: "../images/b2.png",
    para: "Sale! up to 50% off!",
    heading: "Winter Sale Collections",
  },
  hero3: {
    src: "../images/b3.png",
    para: "Sale! up to 50% off!",
    heading: "Fashion For Every Occasion",
  },
};

const items = Object.keys(hero).map((heroName) => {
  const herosection = hero[heroName];
  return (
    <NavLink key={heroName}>
      <div onDragStart={handleDragStart} className="item lg:h-[700px]">
        <div className="grid grid-cols-2 bg-[#F8F6F0] dark:bg-gray-900">
          <div className="lg:mt-56 lg:ml-28 ml-5 mt-10 ">
            <p className="lg:text-xl uppercase instrument-sans text-[#1F1F1F] dark:text-white animate-left-to-right">
              {herosection.para}
            </p>
            <h1 className="lg:text-6xl text-xl instrument-sans text-[#1F1F1F] dark:text-white animate-left-to-right">
              {herosection.heading}
            </h1>
            <button
              onClick={() => {
                window.location.href = `/all-products`;
              }}
              className="px-4 py-3 text-white bg-[#1F1F1F]  rounded-xl animate-left-to-right"
            >
              SHOP NOW
            </button>
          </div>

          <div className="">
            <img
              src={herosection.src}
              className="lg:h-full h-64 animate-zoom-out"
              alt={heroName}
              role="presentation"
            />
          </div>
        </div>
      </div>
    </NavLink>
  );
});

const HeroSection = () => {
  const carouselRef = useRef(null); // Ref to control carousel

  return (
    <div className="relative">
      {/* Carousel */}
      <AliceCarousel
        ref={carouselRef}
        mouseTracking
        items={items}
        responsive={responsive}
        disableDotsControls
        infinite={true}
        autoPlay={true}
        autoPlayInterval={3000}
        disableButtonsControls
        keyboardNavigation
      />

      {/* Next Button */}
      <button
        className="absolute top-1/2 right-4 bg-white hover:bg-gray-100 hover:scale-125 duration-200 transition-all focus:border-blue-400 border text-white p-3 rounded-full hidden sm:block"
        onClick={() => carouselRef.current?.slideNext()}
      >
        <ChevronRightIcon class="h-6 w-6 text-gray-500" />
      </button>

      {/* Previous Button */}
      <button
        className="absolute top-1/2 left-4 bg-white hover:bg-gray-100 hover:scale-125 duration-200 transition-all focus:border-blue-400 border text-white p-3 rounded-full hidden sm:block"
        onClick={() => carouselRef.current?.slidePrev()}
      >
        <ChevronLeftIcon class="h-6 w-6 text-gray-500" />
      </button>
    </div>
  );
};

export default HeroSection;
