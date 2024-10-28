import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";

const CategoryPage = () => {
  const { category } = useParams(); // Get the category ID from the URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products for the selected category
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/products/category/${category}`
        );
        setProducts(response.data.data); // Assuming the API returns products in data field
      } catch (error) {
        setError("Error fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {loading && <div>Loading products...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="px-20 py-10">
            <h1 className="text-2xl font-bold mb-4">
              Products in this category
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
              {products.length > 0 ? (
                products.map((product) => (
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
                          $
                          {product.variants?.[0]?.sellingPrice ||
                            product.sellingPrice}
                        </span>
                        <span className="text-lg instrument text-gray-400 line-through">
                          $
                          {product.variants?.[0]?.costPrice ||
                            product.costPrice}
                        </span>
                      </div>
                    </div>
                  </NavLink>
                ))
              ) : (
                <div className="text-gray-500">
                  No products found for this category.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
