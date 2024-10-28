import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1f1f1f] dark:bg-gray-900 instrument text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Anvogue</h3>
            <ul>
              <li className="mb-2">
                <strong>Mail:</strong> hi.avitex@gmail.com
              </li>
              <li className="mb-2">
                <strong>Phone:</strong> 1-333-345-6868
              </li>
              <li>
                <strong>Address:</strong> 549 Oak St. Crystal Lake, IL 60014
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Contact us</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Career</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">My Account</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Order & Returns</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Quick Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Shop</h3>
            <ul>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Women</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Men</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Clothes</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Accessories</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Blog</a>
              </li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Services</h3>
            <ul>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Orders FAQs</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Shipping</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Privacy Policy</a>
              </li>
              <li className="mb-2 hover:text-gray-700">
                <a href="#">Return & Refund</a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div></div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>©2023 Anvogue. All Rights Reserved.</p>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#">
              <i className="fab fa-facebook-f text-gray-300 hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram text-gray-300 hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter text-gray-300 hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube text-gray-300 hover:text-black"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
