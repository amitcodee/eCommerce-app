import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useCart } from "../context/cart";
import axios from "axios";
import { StarIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Layout from "../components/Layout/Layout";
import toast from "react-hot-toast";
import { Progress } from "antd";

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

const ProductDetail = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("description"); // Track active tab

  const { addToCart } = useCart();

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${params.slug}`);
      if (data.success) {
        setProduct(data.product);
        setSelectedImage(data.product.images?.[0]?.url || "");
        fetchSimilarProducts(data.product._id);
      }
      console.log(product.variants);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProducts = async (productId) => {
    try {
      const { data } = await axios.get(`/api/products/similar/${productId}`);
      if (data.status) {
        setSimilarProducts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  useEffect(() => {
    if (params?.slug) fetchProduct();
  }, [params?.slug]);

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
    // Find the selected variant based on the color and size (compare name if color and size are objects)
    const selectedVariant = product.variants?.find(
      (variant) =>
        variant.color._id === selectedColor && variant.size._id === selectedSize
    );

    // Check if the selected variant exists
    if (!selectedVariant) {
      toast.error("This color and size combination is not available.");
      return;
    }
    console.log(selectedVariant);
    // Add to cart if the variant exists
    addToCart(
      product,
      quantity,
      selectedColor,
      selectedSize,
      selectedVariant.sellingPrice
    );
    toast.success("Item added to cart!");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  // Extract unique colors with their IDs from product variants
  const availableColors = [
    ...new Map(
      product.variants?.map((variant) => [variant.color._id, variant.color])
    ).values(),
  ];

  // Extract unique sizes with their IDs from product variants
  const availableSizes = [
    ...new Map(
      product.variants?.map((variant) => [variant.size._id, variant.size])
    ).values(),
  ];
  // Debugging: Check if available colors and sizes are being extracted
  console.log("Available Colors:", availableColors);
  console.log("Available Sizes:", availableSizes);

  // Calculate stock information for the selected variant
  const selectedVariant = product.variants?.find(
    (variant) =>
      variant.color._id === selectedColor && variant.size._id === selectedSize
  );
  const stock = selectedVariant ? selectedVariant.quantity : 0;
  const maxStock = 500; // Set a default max stock value; adjust based on your product data
  const stockPercentage = (stock / maxStock) * 100;

  return (
    <Layout>
      <div className="container mx-auto lg:px-44 lg:py-10 py-4 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left - Product Image */}
        <div className="flex gap-4">
          <div className="lg:mt-5 mt-11 space-y-3">
            {product.images?.length > 0 ? (
              product.images.map((image, idx) => (
                <img
                  key={idx}
                  onClick={() => handleImageClick(image.url)}
                  src={image.url}
                  alt={`Thumbnail ${idx}`}
                  className={`w-16 h-16 rounded-md cursor-pointer ${
                    selectedImage === image.url ? "ring-2 ring-black" : ""
                  }`}
                />
              ))
            ) : (
              <span>No images available</span>
            )}
          </div>
          <div className="relative">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Product"
                className="w-full h-96 object-contain bg-gray-50 py-4"
              />
            )}
          </div>
        </div>

        {/* Right - Product Details */}
        <div>
          <h1 className="text-4xl instrument-sans mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="text-yellow-500 w-5 h-5" />
            ))}
            {/* <p className="text-sm text-gray-500">(1,234 reviews)</p> */}
          </div>

          {/* Price */}
          <div className="flex gap-3 mb-4">
            <span className="text-2xl instrument-sans text-gray-600">
              ${product.variants?.[0]?.sellingPrice || product.sellingPrice}
            </span>

            <p className="text-xl instrument text-gray-400 line-through ">
              ${product.variants[0]?.costPrice || "N/A"}
            </p>
            {/* Calculate and show discount if costPrice is greater than the price */}
            {product.variants?.[0]?.costPrice >
              product.variants?.[0]?.sellingPrice && (
              <p className="text-md mt-1 bg-[#D2EF9A] px-2 py-1 rounded-md price">
                {(
                  ((product.variants[0]?.costPrice -
                    product.variants[0]?.sellingPrice) /
                    product.variants[0]?.costPrice) *
                  100
                ).toFixed(0)}
                % Off
              </p>
            )}
          </div>

          {/* Product Description */}
          <p className="text-gray-500 instrument-sans dark:text-white mb-6">
            {product.shortDescription}
          </p>
          <hr className="mb-4 border-1 " />

          {/* Colors */}
          <div className="mb-4 flex gap-4">
            <h4 className="text-md instrument-sans ">Colors:</h4>
            <div className="flex space-x-4">
              {availableColors.length > 0 ? (
                availableColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color._id)} // Save the _id when color is selected
                    className={`w-5 h-5 rounded-full border ${
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
          <div className="mb-4 flex gap-4">
            <h4 className="text-md instrument-sans mt-2">Size:</h4>
            <div className="flex space-x-3 ">
              {availableSizes.length > 0 ? (
                availableSizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size._id)} // Save the _id when size is selected
                    className={`px-3 py-1 border rounded-md text-sm ${
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
          <div className="mb-4 flex gap-4">
            <h4 className="text-md instrument-sans mt-2">Quantity:</h4>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDecrement}
                className="p-2 border rounded-md"
              >
                <MinusIcon className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 border rounded-md">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-2 border rounded-md"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stock Progress Indicator */}
          <span className="mb-4 text-[#1f1f1f]">
            Hurry! Only {stock} Items Left In Stock
          </span>
          <Progress
            percent={stockPercentage}
            showInfo={false}
            strokeColor="#1f1f1f"
          />

          {/* Buttons */}
          <div className="mb-6 flex space-x-4 mt-3">
            <button
              onClick={handleAddToCart}
              className="w-full px-5 py-3 bg-black text-white rounded-md"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full px-5 py-3 bg-gray-200 dark:bg-gray-700 rounded-md"
            >
              Buy it Now
            </button>
          </div>
        </div>
      </div>

      {/* Custom Tabs Section */}
      <div className="container mx-auto lg:px-44 lg:py-10 px-4">
        <div className="border border-gray-300 rounded-t-3xl p-4 ">
          <nav className="-mb-px flex lg:space-x-4 space-x-2">
            <button
              className={`lg:px-6 px-4 py-2 font-medium text-md ${
                activeTab === "description"
                  ? "bg-[#1f1f1f] dark:bg-white dark:text-black rounded-full py-3 text-white text-sm instrument-sans"
                  : "dark:text-white text-sm instrument-sans border rounded-full border-gray-300"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`px-6 py-2 font-medium text-md ${
                activeTab === "details"
                  ? "bg-[#1f1f1f] dark:bg-white dark:text-black rounded-full py-3 text-white text-sm instrument-sans"
                  : "dark:text-white text-sm instrument-sans border rounded-full border-gray-300"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Product Details
            </button>
            <button
              className={`px-6 py-2 font-medium text-md ${
                activeTab === "reviews"
                  ? "bg-[#1f1f1f] dark:bg-white dark:text-black rounded-full py-3 text-white text-sm instrument-sans"
                  : "dark:text-white text-sm instrument-sans border rounded-full border-gray-300"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </nav>
        </div>

        <div className=" border border-gray-300 rounded-b-3xl p-4">
          {activeTab === "description" && (
            <div className=" rounded-md">
              <h3 className="text-2xl instrument-sans">Description</h3>
              <p
                className="mt-4 text-gray-600 dark:text-white description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></p>
            </div>
          )}

          {activeTab === "details" && (
            <div className=" rounded-md">
              <h3 className="text-2xl instrument-sans">Product Details</h3>
              <ul className="mt-4 text-gray-600 leading-6 dark:text-white">
                <li>
                  Price: ₹
                  {product.variants?.[0]?.sellingPrice || product.sellingPrice}
                </li>
                <li>
                  Stock Quantity: {product.variants?.[0]?.quantity || "N/A"}
                </li>
                <li className="flex gap-2">
                  Size:
                  {availableSizes.map((size, idx) => (
                    <span key={idx}>
                      {size.name} {/* Display size name */}
                    </span>
                  ))}
                </li>
                <li className="flex gap-2">
                  Color:{" "}
                  {availableColors.map((color, idx) => (
                    <span key={idx}>{color.name}</span>
                  ))}
                </li>
              </ul>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className=" rounded-md">
              <h3 className="text-2xl instrument-sans">Reviews</h3>
              <p className="mt-4 text-gray-600 dark:text-white">
                {/* Add review components here or integrate with review API */}
                Customer reviews go here...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="py-10 lg:px-44 px-4">
        <h2 className="text-3xl instrument-sans mb-6">Similar Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarProducts?.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <NavLink
                key={similarProduct._id} // Ensure correct key
                to={`/all-products/${similarProduct.slug}`}
                className="relative "
              >
                {similarProduct.variants?.[0]?.costPrice >
                  similarProduct.variants?.[0]?.sellingPrice && (
                  <span className="text-sm price absolute top-2 left-2 bg-[#D2EF9A] px-2 py-1 rounded-md">
                    -{" "}
                    {(
                      ((similarProduct.variants[0]?.costPrice -
                        similarProduct.variants[0]?.sellingPrice) /
                        similarProduct.variants[0]?.costPrice) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                )}
                {similarProduct.sale && (
                  <span className="absolute price top-10 left-2 bg-[#D2EF9A] text-sm px-2 py-1 rounded-md">
                    {similarProduct.sale}
                  </span>
                )}

                <img
                  src={similarProduct.images[0]?.url || ""}
                  alt={similarProduct.name}
                  className="w-full h-64 duration-300 object-cover bg-gray-50 "
                />
                <div className="px-4 py-2">
                  <span className="text-xl instrument-sans text-gray-800">
                    {similarProduct.name}
                  </span>
                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg instrument text-gray-700">
                      $
                      {similarProduct.variants?.[0]?.sellingPrice ||
                        similarProduct.sellingPrice}
                    </span>
                    <span className="text-lg instrument text-gray-400 line-through">
                      $
                      {similarProduct.variants?.[0]?.costPrice ||
                        similarProduct.costPrice}
                    </span>
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <p>No similar products available</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
