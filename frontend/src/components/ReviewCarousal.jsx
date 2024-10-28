import React, { useEffect, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import { showReview } from "../redux/features/reviewSlice"; // Import action (ensure the correct import)
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  StarIcon,
} from "@heroicons/react/24/outline"; // Import HeroIcons

const responsive = {
  0: { items: 1.2 },
  568: { items: 2 },
  1024: { items: 3 },
};

const handleDragStart = (e) => e.preventDefault();

const ReviewCarousel = () => {
  const dispatch = useDispatch();
  const { reviewDetail, loading, error } = useSelector((state) => state.review); // Access reviews from Redux
  const carouselRef = useRef(null); // Ref to control carousel

  // Fetch reviews when component mounts
  useEffect(() => {
    dispatch(showReview()); // Dispatch action to fetch reviews
  }, [dispatch]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  // if (error) {
  //   return <p>Error: {error.message}</p>;
  // }

  // Generate review items for the carousel
  const items = reviewDetail.map((review, index) => (
    <div key={index} onDragStart={handleDragStart} className="item px-4">
      <div className="max-w-md bg-gray-100 dark:bg-gray-900 rounded-lg  p-6 mt-5 ">
        {/* Star Ratings */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
            />
          ))}
        </div>

        {/* Review Title */}
        <h2 className="instrument-sans text-xl mb-2">{review.title}</h2>

        {/* Review Content */}
        <p className="text-gray-600 mb-4 instrument-sans">{review.content}</p>

        {/* Reviewer Info */}
        <p className="font-semibold">{review.author?.name}</p>
        <p className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  ));

  return (
    <div className="relative">
      {/* Carousel */}
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
        className="absolute top-1/2 right-0 bg-white hover:bg-gray-100 hover:scale-125 duration-200 transition-all focus:border-blue-400 border text-white p-3 rounded-full hidden sm:block"
        onClick={() => carouselRef.current?.slideNext()}
      >
        <ChevronRightIcon className="h-6 w-6 text-gray-900" />
      </button>

      {/* Previous Button */}
      <button
        className="absolute top-1/2 left-0 bg-white hover:bg-gray-100 hover:scale-125 duration-200 transition-all focus:border-blue-400 border text-white p-3 rounded-full hidden sm:block"
        onClick={() => carouselRef.current?.slidePrev()}
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-900" />
      </button>
    </div>
  );
};

export default ReviewCarousel;
