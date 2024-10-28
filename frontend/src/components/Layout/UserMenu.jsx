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

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false); // Collapse sidebar on smaller screens
    } else {
      setIsOpen(true); // Keep sidebar open on larger screens
    }
  };
  
   useEffect(() => {
    handleResize(); // Set initial state based on screen size
    window.addEventListener("resize", handleResize); // Listen for screen resize

    return () => window.removeEventListener("resize", handleResize); // Cleanup event listener
  }, []);
  return (
    <>
     <div className="flex">
      <aside
        className={`${
          isOpen ? "w-full" : "w-20"
        } h-screen bg-[#1F1F1F] text-white transition-all duration-300 ease-in-out z-40`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Sidebar Header */}
          <div
            className={`flex justify-between items-center mb-4 transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <h2 className="font-bold text-2xl flex items-center gap-2">
              <span className="mt-1 ml-2">User Dashboard</span>
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

          {/* Sidebar Menu */}
          <ul className="space-y-2 text-lg transition-all duration-300 ease-in-out">
             <li>
              <NavLink
                to="/dashboard/user"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <ChartPieIcon className="h-6 w-6 text-white" />
                <span
                  className={`ml-3 transition-opacity duration-300 ease-in-out${
                    !isOpen ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Dashboard
                </span>
              </NavLink>
            </li>

          

            <li>
              <NavLink
                to="/dashboard/user/orders"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                <span
                  className={`ml-3 transition-opacity duration-300 ease-in-out ${
                    !isOpen ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Orders
                </span>
              </NavLink>
            </li>

           
          </ul>
        </div>
      </aside>
    </div>
    </>
  );
};

export default UserMenu;
