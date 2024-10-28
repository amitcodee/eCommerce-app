import React, { useState, useEffect } from "react";
import AdminNav from "./AdminNav";
import AdminMenu from "./AdminMenu"; // Moved AdminMenu to the layout
import { useAuth } from "../../context/auth"; // Assuming you use AuthContext for user data
import { useLocation } from "react-router-dom"; // Import to get current route

const AdminLayout = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const { auth } = useAuth(); // Fetch user data from auth context
  const location = useLocation(); // Get current location

  // Map routes to breadcrumb titles
  const breadcrumbMap = {
    "/dashboard/admin": "Admin Dashboard",
    "/dashboard/admin/inventory": "Inventory List",
    "/dashboard/admin/inventory-dashboard": "Inventory Dashboard",
    "/dashboard/admin/orders": "Orders Dashboard",
   "/dashboard/admin/products": "POS Dashboard",
   "/dashboard/admin/users": "Users Dashboard",
   "/dashboard/admin/create-product": "Create Products",
   "/dashboard/admin/create-category": "Create Categories",
   "/dashboard/admin/create-Size": "Create Sizes",
   "/dashboard/admin/create-color": "Create Colors",

  };

  // Determine the current breadcrumb title based on the location
  const breadcrumbTitle = breadcrumbMap[location.pathname] || "Admin Dashboard";

  // Check localStorage for existing theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  // Function to toggle between light and dark modes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Toggle the 'dark' class on the <html> element
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sticky h-screen top-0">
        <AdminMenu />
      </div>

      {/* Main Content */}
      <div className="w-full overflow-auto">
        {/* Admin Navigation Bar */}
        <AdminNav
          adminName={auth?.user?.name || "Admin"} // Fetch the admin name from auth
          toggleTheme={toggleTheme}
          currentTheme={theme}
          breadcrumbTitle={breadcrumbTitle} // Pass the breadcrumb title to AdminNav
        />

        {/* Page Content */}
        <main className="bg-white pr-3 pb-3 min-h-screen dark:bg-gray-900 dark:text-white">
          {children} {/* Render the wrapped content */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
