import React, { useState, useEffect } from "react";
import { Drawer, Button } from "antd";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const QuickViewModal = ({ product, open, setOpen, addToCart }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

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
    setOpen(false); // Close the modal after adding to cart
  };

  const availableColors = [
    ...new Map(
      product.variants?.map((variant) => [variant.color._id, variant.color])
    ).values(),
  ];

  const availableSizes = [
    ...new Map(
      product.variants?.map((variant) => [variant.size._id, variant.size])
    ).values(),
  ];

  return (
    <Drawer
      title={product.name}
      placement="right"
      closable={true}
      onClose={() => setOpen(false)}
      visible={open}
      width={500}
      className="rounded-l-3xl "
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
          <h1 className="text-2xl mb-4">{product.name}</h1>
          <p className="description" dangerouslySetInnerHTML={{ __html: product.description }}></p>

          {/* Price */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-2xl font-semibold text-gray-800">
              ${product.variants?.[0]?.price || product.price}
            </span>
            {product.variants?.[0]?.costPrice >
              product.variants?.[0]?.price && (
              <span className="text-md bg-[#D2EF9A] px-2 py-1 rounded-lg">
                Save $
                {(
                  product.variants[0]?.costPrice - product.variants[0]?.price
                ).toFixed(2)}{" "}
                (
                {(
                  ((product.variants[0]?.costPrice -
                    product.variants[0]?.price) /
                    product.variants[0]?.costPrice) *
                  100
                ).toFixed(0)}
                % Off)
              </span>
            )}
          </div>

          {/* Colors */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2">Colors:</h4>
            <div className="flex space-x-3">
              {availableColors.length > 0 ? (
                availableColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color._id)}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color._id ? "ring-2 ring-black" : ""
                    }`}
                    style={{ backgroundColor: color.name.toLowerCase() }}
                  ></button>
                ))
              ) : (
                <span>No colors available</span>
              )}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2">Sizes:</h4>
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
                    {size.name}
                  </button>
                ))
              ) : (
                <span>No sizes available</span>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2">Quantity:</h4>
            <div className="flex items-center space-x-3">
              <Button onClick={handleDecrement} disabled={quantity <= 1}>
                <MinusIcon className="w-5 h-5" />
              </Button>
              <span className="px-4 py-2 border rounded-md">{quantity}</span>
              <Button onClick={handleIncrement}>
                <PlusIcon className="w-5 h-5" />
              </Button>
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
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default QuickViewModal;
