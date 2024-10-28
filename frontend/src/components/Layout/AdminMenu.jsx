import React, { useState, useEffect, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  TagIcon,
  ShoppingCartIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  Bars3BottomLeftIcon,
  XMarkIcon,
  UserCircleIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropOpen, setDropIsOpen] = useState(false); // Initialize dropdown as closed
  const [isDrop, setDrop] = useState(false); // Initialize dropdown as closed
  const navigate = useNavigate();
  const handleDropdown = () => {
    setDropIsOpen(!isDropOpen); // Toggle dropdown open/close
  };


 const handleDrop = () => {
    setDrop(!isDrop); // Toggle dropdown open/close
  };
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-4 dark:bg-gray-900">
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } h-screen rounded-2xl bg-[#1F1F1F] text-white transition-all duration-300 ease-in-out z-40`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Sidebar Header */}
          <div
            className={`flex justify-between items-center mb-4 transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <h2 className="font-bold text-2xl flex items-center gapx-2 py-1">
              <span className="mt-1 ml-2 instrument">Dashboard</span>
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
                to="/dashboard/admin"
                className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <ChartPieIcon className="h-6 w-6 text-white" />
                <span
                  className={`ml-3 transition-opacity duration-300 instrument ease-in-out ${
                    !isOpen ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Dashboard
                </span>
              </NavLink>
            </li>

            <li>
              <button
                type="button"
                onClick={handleDrop} // Handle dropdown toggle on click
                className="flex items-center w-full px-2 py-1 text-white transition duration-75 rounded-lg group hover:bg-gray-700  dark:hover:bg-gray-700"
                aria-controls="dropdown-example"
              >
                <ChartPieIcon className="h-6 w-6 text-white" />
                <span
                  className={`flex-1 ms-3 text-left transition-opacity text-[18px] instrument duration-300 ease-in-out" ${
                    !isOpen ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Inventory
                </span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isDrop ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {/* Dropdown menu visibility based on isDropOpen state */}
              <ul
                id="dropdown-example"
                className={`${isDrop ? "block" : "hidden"} py-2 space-y-2`}
              >
                 <li>
                  <NavLink
                    to="/dashboard/admin/inventory-dashboard"
                    className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                    activeClassName="bg-gray-700"
                  >
                    <ChartPieIcon className="h-6 w-6 text-white" />
                    <span
                      className={`ml-3 transition-opacity instrument text-[16px] duration-300 ease-in-out${
                        !isOpen ? "opacity-0 hidden" : "opacity-100"
                      }`}
                    >
                      Inventory Dashboard
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin/inventory"
                    className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-700  transition-colors"
                    activeClassName="bg-gray-700"
                  >
                    <BookmarkIcon className="h-6 w-6 text-white" />
                    <span
                      className={`ml-3 transition-opacity instrument text-[16px] duration-300 ease-in-out${
                        !isOpen ? "opacity-0 hidden" : "opacity-100"
                      }`}
                    >
                      Inventory List
                    </span>
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Dropdown Section */}
            <li>
              <button
                type="button"
                onClick={handleDropdown} // Handle dropdown toggle on click
                className="flex items-center w-full px-2 py-1 text-white transition duration-75 rounded-lg group hover:bg-gray-700  dark:hover:bg-gray-700"
                aria-controls="dropdown-example"
              >
                <ShoppingCartIcon class="h-6 w-6 text-white" />
                <span
                  className={`flex-1 ms-3 text-left transition-opacity text-[18px] instrument duration-300 ease-in-out" ${
                    !isOpen ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  E-commerce
                </span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isDropOpen ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {/* Dropdown menu visibility based on isDropOpen state */}
              <ul
                id="dropdown-example"
                className={`${isDropOpen ? "block" : "hidden"} py-2 space-y-2`}
              >
                <li>
                  <NavLink
                    to="/dashboard/admin/create-product"
                    className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                    activeClassName="bg-gray-700"
                  >
                    <ShoppingCartIcon className="h-6 w-6 text-white" />
                    <span
                      className={`ml-3 transition-opacity duration-300 instrument text-sm ease-in-out${
                        !isOpen ? "opacity-0 hidden" : "opacity-100"
                      }`}
                    >
                      Create Product
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin/create-category"
                    className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                    activeClassName="bg-gray-700"
                  >
                    <TagIcon className="h-6 w-6 text-white" />
                    <span
                      className={`ml-3 transition-opacity duration-300 instrument text-sm ease-in-out ${
                        !isOpen ? "opacity-0 hidden" : "opacity-100"
                      }`}
                    >
                      Create Category
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin/create-color"
                    className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                    activeClassName="bg-gray-700"
                  >
                    <TagIcon className="h-6 w-6 text-white" />
                    <span
                      className={`ml-3 transition-opacity duration-300 instrument text-sm ease-in-out ${
                        !isOpen ? "opacity-0 hidden" : "opacity-100"
                      }`}
                    >
                      Create Color
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin/create-Size"
                    className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                    activeClassName="bg-gray-700"
                  >
                    <TagIcon className="h-6 w-6 text-white" />
                    <span
                      className={`ml-3 transition-opacity duration-300 instrument text-sm ease-in-out ${
                        !isOpen ? "opacity-0 hidden" : "opacity-100"
                      }`}
                    >
                      Create Size
                    </span>
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <NavLink
                to="/dashboard/admin/products"
                className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <ShoppingBagIcon className="h-6 w-6 text-white" />
                <span
                  className={`ml-3 transition-opacity duration-300  ease-in-out ${
                    !isOpen ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  POS
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/admin/orders"
                className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                <span
                  className={`ml-3 transition-opacity duration-300 instrument ease-in-out ${
                    !isOpen ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Orders
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/admin/users"
                className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                activeClassName="bg-gray-700"
              >
                <UsersIcon className="h-6 w-6 text-white" />
                <span
                  className={`ml-3 transition-opacity duration-300 instrument ease-in-out ${
                    !isOpen ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Users
                </span>
              </NavLink>
            </li>
          </ul>
          <ul>
            <li className="mt-16 ml-3">
              <button onClick={handleLogout} className="flex items-center">
                <UserCircleIcon class="h-6 w-6 " />
                <span
                  className={`ml-2 transition-opacity duration-300 instrument ease-in-out ${
                    !isOpen ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
