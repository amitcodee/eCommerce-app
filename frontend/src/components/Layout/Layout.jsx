import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Breadcrumb } from "antd"; // Importing Breadcrumbs from Ant Design
import { Link, useLocation } from "react-router-dom"; // Assuming you're using react-router for routing
import { Helmet } from "react-helmet";
import Banner from "./Banner";
import Model from "../Model";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP's ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

// Loading Animation Component
const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F6F0] dark:bg-[#F8F6F0]">
      {/* Outer dot */}
      <div className="relative flex justify-center items-center">
        <div className="w-16 h-16 bg-[#1f1f1f] rounded-full animate-outer-blink"></div>
        {/* Inner dot */}
        <div className="absolute w-8 h-8 bg-[#1f1f1f] rounded-full animate-inner-blink"></div>
      </div>
    </div>
  );
};

const Layout = ({ children, title, description, keyword, author }) => {
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const location = useLocation(); // Get the current location from react-router

  // Check localStorage for existing theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"; // Fallback to light if nothing is saved
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false); // Hide loading animation after 2 seconds
    }, 1000);

    return () => clearTimeout(loadingTimeout); // Cleanup
  }, []);

  // Function to toggle between light and dark modes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Ensure to remove old theme class and add the new one
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
  };

  // Scroll to Top Button visibility handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true); // Show button after scrolling down 300px
      } else {
        setShowScrollButton(false); // Hide button when scrolling back up
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  // Scroll to Top function
  const scrollToTop = () => {
    gsap.to(window, { duration: 1.5, scrollTo: { y: 0 }, ease: "expo.out" });
  };

  // Generate breadcrumbs dynamically based on the location
  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);

    return pathnames.map((value, index) => {
      const url = `/${pathnames.slice(0, index + 1).join("/")}`;

      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{value.charAt(0).toUpperCase() + value.slice(1)}</Link>
        </Breadcrumb.Item>
      );
    });
  };

  return (
    <div className="smooth-scroll">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keyword} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      {isLoading ? (
        <LoadingAnimation /> // Show loading animation while the page is loading
      ) : (
        <>
          <Banner />
          <Model />
          <Navbar toggleTheme={toggleTheme} currentTheme={theme} />
          {/* Breadcrumbs Section - Hidden on Home Page */}
          {location.pathname !== "/" && (
            <div className="bg-gray-100 dark:bg-gray-800 p-2">
              <div className="max-w-6xl mx-auto">
                <Breadcrumb className="text-md">
                  <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                  </Breadcrumb.Item>
                  {generateBreadcrumbItems()}
                </Breadcrumb>
              </div>
            </div>
          )}

          <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
            {children}
          </main>
          <Footer />
          {/* Scroll to Top Button */}
          {showScrollButton && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-10 right-10 z-50 p-3 rounded-full bg-[#1f1f1f] text-white shadow-lg hover:bg-[#333] transition-all duration-300"
            >
              <ArrowUpIcon class="h-6 w-6 " />
            </button>
          )}
        </>
      )}
    </div>
  );
};

Layout.defaultProps = {
  title: "Ecommerce - Shop Now",
  description: "Ecommerce web app for grocery shopping",
  keyword: "amazon,flipkart,bigbasket,blinkit,grocery,flour,oil,spices",
  author: "Nikhil",
};

export default Layout;
