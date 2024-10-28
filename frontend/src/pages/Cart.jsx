import React, { useEffect, useState } from "react";
import { useCart } from "../context/cart";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout/Layout";
import axios from "axios";

const Cart = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
   const [cartWithDetails, setCartWithDetails] = useState([]);

   // Function to fetch color and size names from API
  const fetchColorAndSizeDetails = async () => {
    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        try {
          // Fetch color details based on the selectedColorId
          const colorResponse = await axios.get(`/api/colors/${item.selectedColor}`);
          const colorName = colorResponse?.data?.name || "Unknown Color";

          // Fetch size details based on the selectedSizeId
          const sizeResponse = await axios.get(`/api/size/${item.selectedSize}`);
          const sizeName = sizeResponse?.data?.name || "Unknown Size";

          // Return item with updated size and color names
          return {
            ...item,
            selectedColorName: colorName,
            selectedSizeName: sizeName,
          };
        } catch (error) {
          console.error("Error fetching color or size details:", error);
          return item; // If there's an error, return the item without changes
        }
      })
    );
    setCartWithDetails(updatedCart);
  };

    // Fetch size and color details when the cart is loaded
  useEffect(() => {
    fetchColorAndSizeDetails();
  }, [cart]);

  // Remove an item from the cart
  const removeFromCart = (productId, selectedColor, selectedSize) => {
    const updatedCart = cart.filter(
      (item) =>
        !(
          item._id === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
        )
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart");
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return cartWithDetails.reduce((total, item) => {
      const matchedVariant = item.variants?.find(
        (variant) =>
          variant.color === item.selectedColor &&
          variant.size === item.selectedSize
      );
      const price = matchedVariant ? matchedVariant.sellingPrice : item.sellingPrice;
      return total + price * item.quantity;
    }, 0);
  };

const handleCheckout = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user) {
      toast.error("You need to be logged in to place an order.");
      navigate("/login");
      return;
    }

    const orderData = {
      user: user.id, // Send the user's ID
      totalAmount: calculateTotalPrice(),
      items: cartWithDetails.map((item) => ({
        productId: item._id,
        color: item.selectedColor, // Send selected color
        size: item.selectedSize,   // Send selected size
        price: item.sellingPrice || item.variant?.sellingPrice, // Send price, fallback to variant price
        quantity: item.quantity,   // Send quantity
      })),
    };

    // Log orderData to check if everything is correctly structured
    console.log('Order Data:', orderData);

    // Make the API call to place the order
    const response = await axios.post(
      "/api/order/place-order", // Your API endpoint
      orderData,
    );

    if (response?.data?.success) {
      toast.success(response?.data?.message || "Order placed successfully!");

      // Clear cart after order is placed
      setCart([]);
      localStorage.removeItem("cart");
      navigate("/"); // Redirect after successful order placement
    } else {
      toast.error(response.data.message || "Order placement failed.");
    }
  } catch (error) {
    console.error('Error placing order:', error.response?.data );
    toast.error(
      error.response?.data?.message || "Failed to place the order. Try again."
    );
  }
};


  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-900">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <Link to="/" className="mt-4 text-blue-500 underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 dark:bg-gray-900 lg:px-32">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
        <div className="grid grid-cols-2 gap-10">
          <div className="grid lg:grid-cols-2 gap-4">
          {cartWithDetails.map((item) => {
              const matchedVariant = item.variants?.find(
                (variant) =>
                  variant.color === item.selectedColor &&
                  variant.size === item.selectedSize
              );

              return (
                <div
                  key={`${item._id}-${item.selectedColor}-${item.selectedSize}`} // Make sure each cart item is unique
                  className="max-w-md mx-auto border cursor-pointer bg-white dark:bg-gray-900 hover:shadow-xl duration-300 transition-all rounded-lg overflow-hidden my-4"
                >
                  <img
                    src={item.images[0]?.url || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-96 h-48 object-cover"
                  />
                  <div className="p-2">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm">
                     Color: {item.selectedColorName}, Size: {item.selectedSizeName}
                    </p>
                    <p className="text-green-600 text-lg font-bold">
                      ₹{matchedVariant?.sellingPrice || item.sellingPrice} {/* Show the correct price */}
                    </p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                    <button
                      onClick={() =>
                        removeFromCart(
                          item._id,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                      className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold">Total: ₹{calculateTotalPrice()}</h2>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
