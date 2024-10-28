import React from "react";
import { Button } from "antd";

const CategoryButtons = ({ categories, handleCategoryChange }) => {
  return (
    <div className="flex space-x-2 mb-4">
      {/* All Categories Button */}
      <Button
        type="primary"
        onClick={() => handleCategoryChange(null)} // Pass null for all categories
      >
        All Categories
      </Button>

      {/* Render a button for each category */}
      {categories.map((category) => (
        <Button
          key={category._id}
          onClick={() => handleCategoryChange(category._id)} // Pass the category ID on click
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryButtons;
