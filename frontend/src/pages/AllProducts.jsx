import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Checkbox, Slider, Pagination } from "antd"; // Import Pagination
import { toast } from "react-hot-toast";
import { useCart } from "../context/cart";
import { useSelector, useDispatch } from "react-redux";
import { showProduct } from "../redux/features/productSlice";
import { showCategory } from "../redux/features/categorySlice";
import { NavLink } from "react-router-dom";

const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "Freesize"];
const colorOptions = [
  { name: "Pink", colorCode: "bg-pink-300" },
  { name: "Red", colorCode: "bg-red-500" },
  { name: "Green", colorCode: "bg-green-300" },
  { name: "Yellow", colorCode: "bg-yellow-400" },
  { name: "Purple", colorCode: "bg-purple-400" },
  { name: "Black", colorCode: "bg-black" },
  { name: "White", colorCode: "bg-gray-200" },
];

const AllProducts = () => {
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products for display
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [pageSize, setPageSize] = useState(8); // Page size (products per page)

  const { addToCart } = useCart();
  const dispatch = useDispatch();

  // Fetch products and categories from Redux store
  const {
    productDetail = [],
    loading,
    error,
  } = useSelector((state) => state.product);
  const { categoryDetail = [] } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(showProduct());
    dispatch(showCategory());
  }, [dispatch]);

  // Apply filters whenever any filtering criteria changes
  useEffect(() => {
    applyFilters(checkedCategories, priceRange, selectedSize, selectedColor);
  }, [
    productDetail,
    checkedCategories,
    priceRange,
    selectedSize,
    selectedColor,
  ]);

  // Filter application logic
  const applyFilters = (categories, priceRange, size, color) => {
    let filtered = Array.isArray(productDetail) ? productDetail : [];

    // Filter by category
    if (categories.length) {
      filtered = filtered.filter((product) =>
        product?.category?.some((cat) => categories.includes(cat?._id))
      );
    }

    // Filter by price range
    filtered = filtered.filter((product) =>
      product?.variants?.some(
        (variant) =>
          variant.price >= priceRange[0] && variant.price <= priceRange[1]
      )
    );

    // Filter by size
    if (size) {
      filtered = filtered.filter((product) =>
        product?.variants?.some((variant) => variant.size?.name === size)
      );
    }

    // Filter by color
    if (color) {
      filtered = filtered.filter((product) =>
        product?.variants?.some((variant) => variant.color?.name === color)
      );
    }

    setFilteredProducts(filtered);
  };

  // Handle category filter
  const handleFilter = (checked, categoryId) => {
    const newCheckedCategories = checked
      ? [...checkedCategories, categoryId]
      : checkedCategories.filter((id) => id !== categoryId);
    setCheckedCategories(newCheckedCategories);
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success("Item Added to Cart");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <Layout title={"All Products - Ecommerce"}>
      <div className="grid lg:grid-cols-4 gap-20 lg:px-16 px-4 py-10">
        {/* Filters Section */}
        <aside className="block w-full md:block md:w-auto">
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Product Types</h3>
            <div className="flex-col flex gap-2">
              {Array.isArray(categoryDetail.categories) &&
              categoryDetail.categories.length > 0 ? (
                categoryDetail.categories.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  >
                    <li className="text-md font-medium dark:text-white">
                      {c.name}
                    </li>
                  </Checkbox>
                ))
              ) : (
                <p>No Category Available</p>
              )}
            </div>
          </div>
          <hr className="mt-5" />
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  className={`py-2 px-4 border rounded-full ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } hover:bg-gray-200`}
                  onClick={() => handleSizeSelection(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <hr className="mt-5" />
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Filter by Price</h3>
            <Slider
              range
              min={0}
              max={5000}
              step={100}
              defaultValue={priceRange}
              value={priceRange}
              onChange={handlePriceRangeChange}
              tipFormatter={(value) => `₹${value}`}
            />
          </div>
          <hr className="mt-5" />
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Colors</h3>
            <div className="grid grid-cols-2 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.name}
                  className={`flex items-center gap-2 py-2 px-4 border rounded-full ${
                    selectedColor === color.name ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => handleColorSelection(color.name)}
                >
                  <span className={`w-5 h-5 rounded-full ${color.colorCode}`} />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-6">
              <button
                className="bg-red-400 px-4 py-2 rounded-md text-white"
                onClick={() => window.location.reload()}
              >
                Reset Filter
              </button>
            </div>
          </div>
        </aside>

        {/* Products Section */}
        <div className="col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Products</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((p) => (
                <NavLink
                  key={p._id} // Ensure correct key
                  to={`/all-products/${p.slug}`}
                  className="relative "
                >
                  {p.variants?.[0]?.costPrice >
                    p.variants?.[0]?.sellingPrice && (
                    <span className="text-sm price absolute top-2 left-2 bg-[#D2EF9A] px-2 py-1 rounded-md">
                      -{" "}
                      {(
                        ((p.variants[0]?.costPrice -
                          p.variants[0]?.sellingPrice) /
                          p.variants[0]?.costPrice) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  )}
                  {p.sale && (
                    <span className="absolute price top-10 left-2 bg-[#D2EF9A] text-sm px-2 py-1 rounded-md">
                      {p.sale}
                    </span>
                  )}

                  <img
                    src={p.images[0]?.url || ""}
                    alt={p.name}
                    className="w-full h-64 duration-300 object-cover bg-gray-50"
                  />
                  <div className="px-2 py-2">
                    <span className="text-xl instrument-sans text-gray-800">
                      {p.name}
                    </span>
                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg instrument text-gray-700">
                        ${p.variants?.[0]?.sellingPrice || p.sellingPrice}
                      </span>
                      <span className="text-lg instrument text-gray-400 line-through">
                        ${p.variants?.[0]?.costPrice || p.costPrice}
                      </span>
                    </div>
                  </div>
                </NavLink>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllProducts;
