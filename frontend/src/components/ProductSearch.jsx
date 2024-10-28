import axios from "axios";
import React, { useState } from "react";

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // API Call to search products
  const searchProducts = async (query) => {
    try {
      const response = await axios.get(`http://localhost:1000/api/products/search`, {
        params: { searchQuery: query },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Unexpected error occurred" };
    }
  };

  // Handler for searching products
  const handleSearch = async () => {
    if (!searchQuery) {
      setErrorMessage("Please enter a search query");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      const result = await searchProducts(searchQuery);
      setProducts(result.data);
    } catch (error) {
      setErrorMessage(error.message || "Error searching products");
      setProducts([]); // Clear products if there's an error
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products by name or category"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      {loading && <div className="text-blue-500 mb-4">Loading...</div>}

      {products.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Search Results:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 shadow-lg"
              >
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700">{product.description}</p>
                <p className="text-gray-600">
                  Category: {product.category?.name}
                </p>
                <p className="text-gray-600">Price: ${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && products.length === 0 && !errorMessage && (
        <div className="text-gray-500">No products found.</div>
      )}
    </div>
  );
};

export default ProductSearch;
