import React, { useState } from "react";

const categories = [
  {
    name: "Shirts",
    image:
      "https://charlotte-fashion-1.myshopify.com/cdn/shop/files/pro1-4.webp?crop=center&height=580&v=1711512432&width=450", // Replace with your actual image path
  },
  {
    name: "Hoodies",
    image:
      "https://charlotte-fashion-1.myshopify.com/cdn/shop/files/pro6-3.webp?crop=center&height=580&v=1711513793&width=450",
  },
  {
    name: "T-Shirts",
    image:
      "https://charlotte-fashion-1.myshopify.com/cdn/shop/files/pro13-3.webp?crop=center&height=580&v=1711507889&width=450",
  },
  {
    name: "Jackets",
    image:
      "https://charlotte-fashion-1.myshopify.com/cdn/shop/files/pro11-1.webp?crop=center&height=580&v=1711509016&width=450",
  },
];

const ProductCarousal = () => {
  const [activeImage, setActiveImage] = useState(categories[0].image); // Default to the first image

  return (
    <div className="flex h-screen">
      {/* Right side: Background image */}
      <div
        className="w-full bg-contain bg-no-repeat bg-center transition-all duration-500"
        style={{
          backgroundImage: `url(${activeImage})`,
        }}
      >
        {/* Overlay for dark background effect */}
        <div className=" h-full w-full flex items-center justify-center">
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className="mb-4 text-5xl font-bold text-black hover:text-gray-300 cursor-pointer transition-all duration-300"
                onMouseEnter={() => setActiveImage(category.image)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductCarousal;
