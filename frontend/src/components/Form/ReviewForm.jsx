import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Optional for notifications

const CreateReviewForm = () => {
  const [rating, setRating] = useState(1); // Default rating
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      rating,
      title,
      content,
    };

    try {
      const token = localStorage.getItem("token");

      // API call to submit the review
      const response = await axios.post(
        "http://localhost:1000/api/reviews/create",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Review created successfully!");
        setRating(1);
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error("Failed to create review.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="rating" className="block mb-2 text-sm font-medium">
          Rating (1-5)
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md"
          required
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="title" className="block mb-2 text-sm font-medium">
          Review Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md"
          placeholder="Enter review title"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block mb-2 text-sm font-medium">
          Review Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md"
          placeholder="Enter your review"
          rows="5"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-blue-600 text-white rounded-md"
      >
        Submit Review
      </button>
    </form>
  );
};

export default CreateReviewForm;
