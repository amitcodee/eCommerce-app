import React, { useEffect, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { NavLink } from "react-router-dom";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux"; // Import from react-redux
import { showCategory } from "../redux/features/categorySlice"; // Import your action
import { Skeleton } from "antd";

const responsive = {
  0: { items: 2.3 },
  568: { items: 4 },
  1024: { items: 6 },
};

const handleDragStart = (e) => e.preventDefault();

const CategoryCarousal = () => {
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
        <NavLink key={index} to={`/category/${category._id}`}>
          <div onDragStart={handleDragStart} className="item mt-3 ml-2 mr-2">
            <div className=" text-center">
              <div className="  ">
                <img
                  src={category.image} // Assuming the API returns an image field
                  alt={category.name} // Assuming the API returns a name field
                  className=" rounded-md bg-gray-100 px-3 h-44 w-full"
                />

                <div className="instrument-sans text-xl mt-4">
                  {category.name} {/* Assuming the API returns a name field */}
                </div>
              </div>
            </div>
          </div>
        </NavLink>
      ))
    : []; // Return an empty array if categoryDetail is not an array
  // Create Skeleton items to display while loading
  const skeletonItems = [...Array(6)].map((_, index) => (
    <div key={index} className="item mt-3">
      <div className="max-w-xs text-center">
        <Skeleton.Avatar size={128} shape="circle" active className="ml-4" />
        <Skeleton active paragraph={{ rows: 1 }} />
      </div>
    </div>
  ));

  return (
    <div className="relative">
      {/* Show Skeleton when loading */}
      {loading && (
        <AliceCarousel
          ref={carouselRef}
          mouseTracking
          items={skeletonItems}
          responsive={responsive}
          disableDotsControls
          disableButtonsControls
        />
      )}

      {/* Show Error Message if there's an error
      {error && (
        <div className="text-center text-red-500">Error: {error.message}</div>
      )} */}

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
            className="absolute top-20 -right-5 bg-white hover:bg-gray-100 hover:scale-125 duration-200 transition-all focus:border-blue-400 border-2 text-white p-3 rounded-full hidden sm:block"
            onClick={() => carouselRef.current?.slideNext()}
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-500" />
          </button>

          {/* Previous Button */}
          <button
            className="absolute top-20 -left-2 bg-white hover:bg-gray-100 hover:scale-125 duration-200 transition-all focus:border-blue-400 border-2 text-white p-3 rounded-full hidden sm:block"
            onClick={() => carouselRef.current?.slidePrev()}
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-500" />
          </button>
        </>
      )}
    </div>
  );
};

export default CategoryCarousal;
