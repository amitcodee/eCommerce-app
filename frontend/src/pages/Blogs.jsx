import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Blogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBlog, setActiveBlog] = useState(null);

  const blogs = [
    {
      title: "Fashion Trends To Watch Out For In Summer 2023",
      description:
        "Explore the latest trends in professional and casual suits that are taking the fashion industry by storm.",
      fullContent:
        "This is the full content of the blog post about Fashion Trends To Watch Out For In Summer 2023. Here you can expand into detailed insights about the latest trends.",
      author: "Chris Evans",
      date: "Dec 20, 2023",
      category: "JEAN, GLASSES",
      image:
        "https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fblog%2F1.png&w=3840&q=75",
    },
    {
      title: "How To Build A Sustainable And Stylish Wardrobe",
      description:
        "Learn how to pick the right suit that fits your style and the event you’re attending.",
      fullContent:
        "This is the full content of the blog post about building a sustainable and stylish wardrobe. Detailed tips on wardrobe choices and more.",
      author: "Alex Balde",
      date: "Dec 21, 2023",
      category: "JEAN, SHOES",
      image:
        "https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fblog%2F2.png&w=3840&q=75",
    },
    {
      title: "Fashion And Beauty Tips For Busy Professionals",
      description:
        "From ties to pocket squares, discover the must-have accessories to complement your suit.",
      fullContent:
        "This is the full content of the blog post about fashion and beauty tips for busy professionals. You can add in-depth tips and styling guides here.",
      author: "Leona Pablo",
      date: "Dec 22, 2023",
      category: "JEAN, SKIRT",
      image:
        "https://images.tailorstore.com/YToxOntzOjU6IndpZHRoIjtpOjk2MDt9/images%252Fcms%252F4820-imperia-navy-two-extra.jpg",
    },
  ];

  const handleViewMore = (blog) => {
    setActiveBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveBlog(null);
  };

  return (
    <Layout>
      <div className="min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl instrument-sans text-center text-[#1f1f1f] mb-10">
            Our Blogs
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden relative"
              >
                  <button
                    onClick={() => handleViewMore(blog)}
                    className="absolute bg-white rounded-full border-2 p-2 top-2 right-4"
                  >
                   <EyeIcon class="h-6 w-6 text-gray-500" />
                  </button>
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-6">
                  <span className="inline-block bg-lime-200 text-lime-800 instrument-sans text-sm px-3 py-1 rounded-full mb-3">
                    {blog.category}
                  </span>
                  <hr />
                  <h2 className="text-xl instrument-sans text-gray-700 mb-2 mt-1">
                    {blog.title}
                  </h2>
                  <div className="flex justify-between items-center instrument text-gray-500 text-sm">
                    <p>by {blog.author}</p>
                    <p>{blog.date}</p>
                  </div>
                
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && activeBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full  relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white border-2 rounded-full p-2"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500 text-2xl" />
              </button>
              <img
                src={activeBlog.image}
                alt={activeBlog.title}
                className="w-full h-72 object-cover rounded-t-2xl "
              />
              <div className="p-3">
                <h2 className="text-3xl instrument-sans mb-4 text-gray-700">
                  {activeBlog.title}
                </h2>
                <div className="flex justify-between items-center text-gray-500 text-sm instrument ">
                  <p>by {activeBlog.author}</p>
                  <p>{activeBlog.date}</p>
                </div>
                <p className="text-lg text-gray-600 mb-6 instrument">
                  {activeBlog.fullContent}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blogs;
