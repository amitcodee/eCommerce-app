import React from "react";
import { useAuth } from "../../context/auth"; // Import the custom hook to access auth state
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
 // Icons for light/dark mode

const AdminNav = ({ toggleTheme, currentTheme, breadcrumbTitle }) => {
  const { auth } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Left side - Dynamic Breadcrumb or title */}
      <div className="text-xl instrument-sans truncate">
        {breadcrumbTitle || "Dashboard"} {/* Fallback title */}
      </div>

      {/* Right side - Admin name and theme toggler */}
      <div className="flex items-center space-x-4">
        {/* Admin Name */}
        <span className="font-medium uppercase text-xl truncate">
          {auth?.user?.username || "Admin"} {/* Fallback for missing username */}
        </span>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
        >
          {currentTheme === "light" ? (
            <>
              <MoonIcon className="h-5 w-5" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <SunIcon className="h-5 w-5" />
              <span>Light Mode</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
};

export default AdminNav;
