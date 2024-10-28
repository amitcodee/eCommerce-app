import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import from react-redux
import { showProduct } from "../redux/features/productSlice"; // Import your fetch action
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Skeleton } from "antd";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const NewArrival = () => {
  const dispatch = useDispatch();
  const productsRef = useRef([]);
  const textRef = useRef([]);

  // Safely access products, loading, and error using optional chaining
  const {
    productDetail = [],
    loading,
    error,
  } = useSelector((state) => state.product);

  // Fetch products when the component mounts
  useEffect(() => {
    dispatch(showProduct());
  }, [dispatch]);

  // Debug: Log the fetched product details to ensure correct data is being fetched
  useEffect(() => {
    console.log("Product Details:", productDetail); // Check the structure of productDetail
  }, [productDetail]);

  // New Arrivals
  // Ensure productDetail is an array and filter products
  const newArrivalProducts = Array.isArray(productDetail)
    ? productDetail.filter((product) => {
        const categories = product?.category || [];
        if (!Array.isArray(categories)) return false; // Ensure categories is an array
        return categories.some((cat) => cat.slug === "new-arrivals");
      })
    : [];
  // Animate products on scroll using GSAP and ScrollTrigger
  // Animate products on scroll using GSAP and ScrollTrigger with Timeline
  useEffect(() => {
    if (productsRef.current.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: productsRef.current[0],
          end: "top 10%",
          scrub: 2,
          once: true,
        },
      });

      productsRef.current.forEach((el, index) => {
        if (el) {
          tl.fromTo(
            el,
            {
              opacity: 0,
              y: 100,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            }
          );
        }
      });
    }
  }, [newArrivalProducts]);

  // GSAP animation for "New Arrivals" text
  useEffect(() => {
    gsap.fromTo(
      textRef.current.filter(Boolean), // Filter out any null refs
      { opacity: 0, y: 50 }, // Initial state
      {
        opacity: 1,
        y: 0,
        stagger: 0.2, // Stagger the animation of each word
        ease: "power3.out",
        duration: 1.5,
        scrollTrigger: {
          trigger: textRef.current[0], // Trigger when the first word enters the viewport
          // start: "top 90%", // Animation starts when top of the element hits 90% of the viewport
          end: "top 10%", // Animation ends when the bottom hits 20%
          once: true,
          scrub: 2, // Sync with scroll
          markers: false, // Set to `true` to see the trigger markers (useful for debugging)
        },
      }
    );
  }, []);

  return (
    <div className="dark:bg-gray-900">
      <div className="px-4 lg:px-16">
        <div className="flex gap-5 ">
          <h2 className="text-5xl instrument-sans">
            {["N", "e", "w", "A", "r", "r", "i", "v", "a", "l", "s"].map(
              (word, index) => (
                <span
                  key={index}
                  className="inline-block mr-2" // Separate the words
                  ref={(el) => (textRef.current[index] = el)} // Add ref for each word
                >
                  {word}
                </span>
              )
            )}
          </h2>
          <NavLink
            to={"/all-products"}
            className="mt-6 text-sm instrument-sans underline hover:text-[#1f1f1f]"
          >
            SEE ALL COLLECTIONS
          </NavLink>
        </div>

        {/* Show Skeleton when loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 ">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="shadow-lg bg-gray-100 rounded-xl p-4">
                <Skeleton.Image style={{ width: "100%", height: "200px" }} />
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))}
          </div>
        )}

        {/* Show Error Message
        {error && (
          <div className="text-center text-red-500">
            {error.message || "Something went wrong!"}
          </div>
        )} */}

        {/* No products found */}
        {!loading && newArrivalProducts.length === 0 && (
          <p className="text-center">No New Arrivals Found</p>
        )}

        {/* Show products if they are loaded */}
        {!loading && newArrivalProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 ">
            {newArrivalProducts.slice(0, 5).map((product, index) => (
              <NavLink
                key={product._id} // Ensure correct key
                to={`/all-products/${product.slug}`}
                className="relative "
                ref={(el) => (productsRef.current[index] = el)}
              >
                {product.variants?.[0]?.costPrice >
                  product.variants?.[0]?.sellingPrice && (
                  <span className="text-sm price absolute top-2 left-2 bg-[#D2EF9A] px-2 py-1 rounded-md">
                    -{" "}
                    {(
                      ((product.variants[0]?.costPrice -
                        product.variants[0]?.sellingPrice) /
                        product.variants[0]?.costPrice) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                )}
                {product.sale && (
                  <span className="absolute price top-10 left-2 bg-[#D2EF9A] text-sm px-2 py-1 rounded-md">
                    {product.sale}
                  </span>
                )}

                <img
                  src={product.images[0]?.url || ""}
                  alt={product.name}
                  className="w-full h-64 duration-300 object-cover bg-gray-50"
                />
                <div className="px-4 py-2">
                  <span className="text-xl instrument-sans text-gray-800">
                    {product.name}
                  </span>
                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg instrument text-gray-700">
                      $
                      {product.variants?.[0]?.sellingPrice ||
                        product.sellingPrice}
                    </span>
                    <span className="text-lg instrument text-gray-400 line-through">
                      ${product.variants?.[0]?.costPrice || product.costPrice}
                    </span>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrival;
