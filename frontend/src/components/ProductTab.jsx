import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // For making API requests
import gsap from "gsap";
import {
  ShoppingBagIcon,
  HeartIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Radio, RadioGroup, Transition } from "@headlessui/react";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { Button, Drawer } from "antd";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductCard = ({ product, openQuickView }) => {
  const { addToCart } = useCart();
  const handleAddToCart = (product) => {
    addToCart(product, 1); // Add 1 quantity of the product to the cart
    toast.success("Item Added to Cart");
  };
  return (
    <div className=" dark:bg-gray-900 relative group overflow-hidden">
      <NavLink
        key={product._id} // Ensure correct key
        to={`/all-products/${product.slug}`}
        className="relative "
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
              ${product.variants?.[0]?.sellingPrice || product.sellingPrice}
            </span>
            <span className="text-lg instrument text-gray-400 line-through">
              ${product.variants?.[0]?.costPrice || product.costPrice}
            </span>
          </div>
        </div>
      </NavLink>
      <div className="absolute bottom-20 left-0 right-0 py-4 px-16 bg-transparent bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => openQuickView(product)}
          className="w-full bg-white text-black py-2 rounded-full hover:bg-gray-300 transition"
        >
          Quick View
        </button>
      </div>
    </div>
  );
};

// Define a mapping between color names and Tailwind CSS color classes
const colorClassMap = {
  Red: "bg-red-500",
  Blue: "bg-blue-500",
  Green: "bg-green-500",
  Yellow: "bg-yellow-500",
  Pink: "bg-pink-500",
  Black: "bg-black",
  White: "bg-white border",
  Gray: "bg-gray-500",
};

const QuickViewModal = ({ product, open, setOpen }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    const selectedVariant = product.variants?.find(
      (variant) =>
        variant.color._id === selectedColor && variant.size._id === selectedSize
    );

    if (!selectedVariant) {
      toast.error("This color and size combination is not available.");
      return;
    }

    addToCart(
      product,
      quantity,
      selectedColor,
      selectedSize,
      selectedVariant.price
    );
    toast.success("Item added to cart!");
  };

  // Extract unique colors with their IDs and names from product variants
  const availableColors = [
    ...new Map(
      product.variants?.map((variant) => [variant.color._id, variant.color])
    ).values(),
  ];

  // Extract unique sizes with their IDs and names from product variants
  const availableSizes = [
    ...new Map(
      product.variants?.map((variant) => [variant.size._id, variant.size])
    ).values(),
  ];

  const transitionStyles = {
    entering: { opacity: 1, transform: "translateX(0)" },
    entered: { opacity: 1, transform: "translateX(0)" },
    exiting: { opacity: 0, transform: "translateX(100%)" },
    exited: { opacity: 0, transform: "translateX(100%)" },
  };

  return (
    <Transition show={true} in={open} timeout={300}>
      {(state) => (
        <Drawer
          title={product.name}
          placement="right"
          closable={true}
          onClose={() => setOpen(false)}
          visible={open}
          style={{
            transition: "transform 300ms ease-in-out",
            ...transitionStyles[state],
          }}
          width={500}
          className="rounded-l-3xl"
        >
          <div>
            {/* Product Image */}
            <div className="space-y-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-64 object-contain rounded-lg"
              />
              <div className="flex space-x-3 ml-8">
                {product.images?.map((image, idx) => (
                  <img
                    key={idx}
                    onClick={() => handleImageClick(image.url)}
                    src={image.url}
                    alt={`Thumbnail ${idx}`}
                    className={`w-16 h-16 rounded-lg cursor-pointer ${
                      selectedImage === image.url ? "ring-2 ring-black" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-6">
              <h1 className="text-2xl instrument-sans mb-4 dark:text-white">
                {product.name}
              </h1>
              <p
                className="instrument description "
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></p>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-2xl font-semibold text-gray-800 dark:text-white">
                  ${product.variants?.[0]?.sellingPrice || product.sellingPrice}
                </span>
                {product.variants?.[0]?.costPrice >
                  product.variants?.[0]?.sellingPrice && (
                  <span className="text-md bg-[#D2EF9A] px-2 py-1 rounded-lg">
                    Save $
                    {(
                      product.variants[0]?.costPrice -
                      product.variants[0]?.sellingPrice
                    ).toFixed(2)}{" "}
                    (
                    {(
                      ((product.variants[0]?.costPrice -
                        product.variants[0]?.sellingPrice) /
                        product.variants[0]?.costPrice) *
                      100
                    ).toFixed(0)}
                    % Off)
                  </span>
                )}
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-2 dark:text-white">
                  Colors:
                </h4>
                <div className="flex space-x-3">
                  {availableColors.length > 0 ? (
                    availableColors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color._id)}
                        className={`w-8 h-8 rounded-full border ${
                          selectedColor === color._id ? "ring-2 ring-black" : ""
                        } ${colorClassMap[color.name] || "bg-gray-300"}`}
                      ></button>
                    ))
                  ) : (
                    <span>No colors available</span>
                  )}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-2 dark:text-white">
                  Sizes:
                </h4>
                <div className="flex space-x-3">
                  {availableSizes.length > 0 ? (
                    availableSizes.map((size, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(size._id)}
                        className={`px-3 py-2 border rounded-md text-sm ${
                          selectedSize === size._id ? "border-black" : ""
                        }`}
                      >
                        {size.name} {/* Display size name */}
                      </button>
                    ))
                  ) : (
                    <span>No sizes available</span>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-2 dark:text-white">
                  Quantity:
                </h4>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleDecrement}
                    icon={<MinusIcon className="w-5 h-5" />}
                    disabled={quantity <= 1}
                  />
                  <span className="px-4 py-2 border rounded-md dark:text-white">
                    {quantity}
                  </span>
                  <Button
                    onClick={handleIncrement}
                    icon={<PlusIcon className="w-5 h-5" />}
                  />
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mb-6 flex space-x-4">
                <Button
                  className="bg-[#1f1f1f] text-white"
                  block
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button block onClick={handleAddToCart}>
                  Buy it Now
                </Button>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </Transition>
  );
};

const ProductTabs = () => {
  const [selectedTab, setSelectedTab] = useState("new-arrivals");
  const [products, setProducts] = useState([]); // Store products
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setQuickViewOpen] = useState(false);
 const productGridRef = useRef(null); // Reference for product grid
  // Fetch products based on category
  const fetchProducts = async (categorySlug) => {
    try {
      const { data } = await axios.get(
        `/api/products/category/${categorySlug}`
      );
      //console.log("Fetched data:", data); // Log to check the API response
      if (data.success) {
        setProducts(data.data);
        //console.log("Product Tab", data.variants);
      } else {
        setProducts([]);
        console.log("No products found for this category.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(selectedTab); // Fetch products based on the selected tab
  }, [selectedTab]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  // GSAP Slide-In Animation
  useEffect(() => {
    if (productGridRef.current) {
      // Set initial position off-screen
      gsap.set(productGridRef.current.children, { y: -100, opacity: 0 });

      // Animate each product item with stagger
      gsap.to(productGridRef.current.children, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.4,
        ease: "power.inOut",
      });
    }
  }, [products]); // Trigger animation on produ

  return (
    <>
      <div className="flex justify-center">
        <div className="flex justify-center max-w-lg rounded-full space-x-6 mb-6 border-2 dark:border-white border-black py-1 px-1 ">
          <button
            className={`px-6 py-2 font-semibold ${
              selectedTab === "best-selling"
                ? "bg-[#1f1f1f] dark:bg-white dark:text-black rounded-full py-3 text-white text-sm instrument-sans"
                : "dark:text-white text-sm instrument-sans"
            }`}
            onClick={() => handleTabClick("best-selling")}
          >
            Best Selling
          </button>
          <button
            className={`px-6 py-2 font-semibold ${
              selectedTab === "suits"
                ? "bg-[#1f1f1f] dark:bg-white dark:text-black rounded-full py-3 text-white text-sm instrument-sans"
                : "dark:text-white text-sm instrument-sans"
            }`}
            onClick={() => handleTabClick("suits")}
          >
            Suits
          </button>
          <button
            className={`px-6 py-2 font-semibold ${
              selectedTab === "new-arrivals"
                ? "bg-[#1f1f1f] dark:bg-white dark:text-black rounded-full py-3 text-white text-sm instrument-sans"
                : "dark:text-white text-sm instrument-sans"
            }`}
            onClick={() => handleTabClick("new-arrivals")}
          >
            New Arrivals
          </button>
        </div>
      </div>
      <div className=" lg:px-16 dark:bg-gray-900">
        {/* Tab Navigation */}
        {/* <div className="grid lg:grid-cols-2"> */}
        {/* <div>
          <h1 className=" instrument-sans text-5xl">Most popular products</h1>
        </div> */}

        {/* </div> */}
        {/* Product Display */}
        <div ref={productGridRef} className="grid grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                openQuickView={openQuickView}
              />
            ))
          ) : (
            <p>No products found for this category.</p>
          )}
        </div>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            open={isQuickViewOpen}
            setOpen={setQuickViewOpen}
          />
        )}
      </div>
    </>
  );
};

export default ProductTabs;
