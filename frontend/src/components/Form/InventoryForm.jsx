import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const InventoryForm = ({
  fetchInventoryRecords,
  setIsModalVisible,
  currentRecord, // Used for editing
  setCurrentRecord, // Reset the current record after submission
}) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [movementType, setMovementType] = useState("in");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false); // Loader for products
  const [variantLoading, setVariantLoading] = useState(false); // Loader for variants
  const [price, setPrice] = useState(0); // New state for price


  // Fetch products
  const fetchProducts = async () => {
    setProductLoading(true); // Show product loading
    try {
      const { data } = await axios.get("/api/products/get-products");
      if (data.status === "success") {
        setProducts(data.data);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    } finally {
      setProductLoading(false); // Hide product loading
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Prefill form when currentRecord is available and products are loaded
  useEffect(() => {
    if (currentRecord && products.length > 0) {
      const product = products.find(
        (p) => p._id === currentRecord.product?._id
      );

      if (product) {
        setSelectedProduct(product._id); // Ensure product exists before accessing _id
        setVariants(product.variants || []); // Ensure variants are set properly
      }

      setSelectedVariant(currentRecord.variant?._id || ""); // Safely access variant._id
      setMovementType(currentRecord.movementType || "in");
      setQuantity(currentRecord.quantity || 1);
    }
  }, [currentRecord, products]);

  const handleProductChange = (productId) => {
    setSelectedVariant(""); // Clear previously selected variant
    setVariants([]); // Reset variants on product change

    const product = products.find((p) => p._id === productId);

    if (product) {
      setSelectedProduct(product._id); // Safely set the selected product ID
      setVariants(product.variants || []); // Safely set variants
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const values = {
      productId: selectedProduct, // Use selectedProduct directly
      variantId: selectedVariant,
      movementType,
      quantity,
      price, // Include price in submission data
    };

    try {
      let endpoint = "";
      if (currentRecord) {
        // If editing, use the update (PUT) endpoint
        endpoint = `/api/inventory/${currentRecord._id}`;
      } else {
        // For creating a new inventory record, select the proper endpoint
        switch (movementType) {
          case "in":
            endpoint = "/api/inventory/add";
            break;
          case "out":
            endpoint = "/api/inventory/remove";
            break;
          case "adjustment":
            endpoint = "/api/inventory/adjust";
            break;
          default:
            return;
        }
      }

      const response = currentRecord
        ? await axios.put(endpoint, values) // Use PUT for update
        : await axios.post(endpoint, values); // Use POST for create

      if (response.data.success) {
        toast.success(
          `Inventory ${currentRecord ? "updated" : movementType} successful`
        );
        fetchInventoryRecords(); // Refresh inventory records
        setIsModalVisible(false); // Close modal
        setCurrentRecord(null); // Reset currentRecord
      } else {
        toast.error(
          `Failed to ${currentRecord ? "update" : movementType} inventory`
        );
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error(
        `Error ${currentRecord ? "updating" : movementType} inventory`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      {/* Product Selection */}
      <div className="mb-4">
        <label htmlFor="productId" className="block text-gray-700 font-medium">
          Product
        </label>
        {productLoading ? (
          <p>Loading products...</p>
        ) : (
          <select
            id="productId"
            value={selectedProduct || ""}
            onChange={(e) => handleProductChange(e.target.value)}
            required
            className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Variant Selection */}
      {variantLoading ? (
        <p>Loading variants...</p>
      ) : (
        variants.length > 0 && (
          <div className="mb-4">
            <label
              htmlFor="variantId"
              className="block text-gray-700 font-medium"
            >
              Variant (Size / Color)
            </label>
            <select
              id="variantId"
              value={selectedVariant || ""}
              onChange={(e) => setSelectedVariant(e.target.value)}
              required
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select a variant</option>
              {variants.length > 0 &&
                variants.map((variant) => (
                  <option key={variant._id} value={variant._id}>
                    {variant.size?.name || "N/A"} /{" "}
                    {variant.color?.name || "N/A"}
                  </option>
                ))}
            </select>
          </div>
        )
      )}

      {/* Movement Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Movement Type</label>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="in"
              checked={movementType === "in"}
              onChange={(e) => setMovementType(e.target.value)}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Add Stock</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              value="out"
              checked={movementType === "out"}
              onChange={(e) => setMovementType(e.target.value)}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Remove Stock</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              value="adjustment"
              checked={movementType === "adjustment"}
              onChange={(e) => setMovementType(e.target.value)}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Adjust Stock</span>
          </label>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="mb-4">
        <label htmlFor="quantity" className="block text-gray-700 font-medium">
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          required
          className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      {/* Price Input */}
      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 font-medium">
          Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)} // Add price state and handler
          min="0"
          required
          className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          disabled={loading || productLoading || variantLoading}
          className={`w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            loading || productLoading || variantLoading
              ? "cursor-not-allowed"
              : ""
          }`}
        >
          {loading
            ? "Submitting..."
            : currentRecord
            ? "Update Inventory"
            : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;
