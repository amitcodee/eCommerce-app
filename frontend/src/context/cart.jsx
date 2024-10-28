import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Initialize cart from localStorage when component mounts
  useEffect(() => {
    let existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) setCart(JSON.parse(existingCartItem));
  }, []);

  // Add to cart function (with size, color, and price)
  const addToCart = (product, quantity = 1, selectedColor, selectedSize, sellingPrice) => {
    const existingProduct = cart.find(
      (item) =>
        item._id === product._id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existingProduct) {
      // Update quantity if product with the same color and size already exists
      const updatedCart = cart.map((item) =>
        item._id === product._id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      // Add new product to cart
      const newCart = [
        ...cart,
        {
          ...product,
          quantity,
          selectedColor,
          selectedSize,
          sellingPrice, // Custom price (can be user-defined or product's base price)
        },
      ];
      setCart(newCart);
      console.log(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
