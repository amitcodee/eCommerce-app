import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  TagIcon,
  ShoppingCartIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  Bars3BottomLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Function to handle window resize and adjust the sidebar state
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false); // Collapse sidebar on smaller screens
    } else {
      setIsOpen(true); // Keep sidebar open on larger screens
    }
  };

  // useEffect to run on component mount and resize
  useEffect(() => {
    handleResize(); // Set initial state based on screen size
    window.addEventListener("resize", handleResize); // Listen for screen resize

    return () => window.removeEventListener("resize", handleResize); // Cleanup event listener
  }, []);

  return (
    <div className="flex">
      <aside
        className={`${
          isOpen ? "w-full" : "w-20"
        } h-screen bg-[#1F1F1F] text-white transition-all duration-300 z-40`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div
            className={`flex justify-between items-center mb-4 transition-all duration-300 ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <h2 className="font-bold text-2xl flex items-center gap-2">
              <ChartPieIcon className="h-8 w-8 text-white" />
              <span className="mt-1">Admin Dashboard</span>
            </h2>
            {/* XMarkIcon placed on the opposite side */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none mb-3"
            >
              <XMarkIcon className="h-8 w-8 text-white" />
            </button>
          </div>
          {/* Button for small screens */}
          {!isOpen && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none mb-4 ml-1"
            >
              <Bars3BottomLeftIcon className="h-9 w-9 text-white" />
            </button>
          )}
          <ul className="space-y-2 text-lg">
            <li>
              <NavLink
                to="/create-category"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <TagIcon className="h-6 w-6 text-white" />
                <span className={`ml-3 ${!isOpen ? "hidden" : ""}`}>
                  Create Category
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/create-product"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <ShoppingCartIcon className="h-6 w-6 text-white" />
                <span className={`ml-3 ${!isOpen ? "hidden" : ""}`}>
                  Create Product
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/admin/orders"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                <span className={`ml-3 ${!isOpen ? "hidden" : ""}`}>Orders</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/admin/products"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <ShoppingBagIcon className="h-6 w-6 text-white" />
                <span className={`ml-3 ${!isOpen ? "hidden" : ""}`}>
                  Products
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/admin/users"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <UsersIcon className="h-6 w-6 text-white" />
                <span className={`ml-3 ${!isOpen ? "hidden" : ""}`}>Users</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
