import React, { useEffect, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { NavLink } from "react-router-dom";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux"; // Import from react-redux
import { showCategory } from "../redux/features/categorySlice"; // Import your action

const responsive = {
  0: { items: 1.8 },
  568: { items: 4 },
  1024: { items: 6 },
};

const handleDragStart = (e) => e.preventDefault();

const AadminCarousal = () => {
  const dispatch = useDispatch();
  const carouselRef = useRef(null); // Ref to control carousel

  // Get categories, loading, and error from Redux store
  const {
    categoryDetail = [],
    loading,
    error,
  } = useSelector((state) => state.category);

  // Fetch categories when the component mounts
  useEffect(() => {
    dispatch(showCategory());
  }, [dispatch]);

  // Ensure categoryDetail is an array before using map
  const items = Array.isArray(categoryDetail.categories)
    ? categoryDetail.categories.map((category, index) => (
        <div key={index} onDragStart={handleDragStart} className="item ml-1 mr-1">
          <div className="">
            <p className=" text-md px-3 py-2 rounded-lg text-center  bg-gray-300">
              {category.name} {/* Assuming the API returns a name field */}
            </p>
          </div>
        </div>
      ))
    : []; // Return an empty array if categoryDetail is not an array

  return (
    <div className="relative">
      {/* Show Loading Indicator */}
      {loading && <div className="text-center">Loading...</div>}

      {/* Show Error Message if there's an error
      {error && <div className="text-center text-red-500">Error: {error.message}</div>} */}

      {/* Show Carousel when data is loaded */}
      {!loading && items.length > 0 && (
        <>
          <AliceCarousel
            ref={carouselRef}
            mouseTracking
            items={items}
            responsive={responsive}
            disableDotsControls
            disableButtonsControls
            keyboardNavigation
          />

          {/* Next Button */}
          <button
            className="absolute top-0 -right-3 bg-white hover:bg-gray-100 hover:scale-125 duration-200 transition-all focus:border-blue-400 border-2 text-white p-1 rounded-full hidden sm:block"
            onClick={() => carouselRef.current?.slideNext()}
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-500" />
          </button>

          {/* Previous Button */}
          <button
            className="absolute top-0 -left-4 bg-white hover:bg-gray-100 hover:scale-125 duration-200 transition-all focus:border-blue-400 border-2 text-white p-1 rounded-full hidden sm:block"
            onClick={() => carouselRef.current?.slidePrev()}
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-500" />
          </button>
        </>
      )}
    </div>
  );
};

export default AadminCarousal;
