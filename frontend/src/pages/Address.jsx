// src/components/Address/AddressForm.js

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth"; // Ensure correct import path
import { useNavigate } from "react-router-dom";

const AddressForm = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientName: `${auth.user.firstName} ${auth.user.lastName}` || "",
    company: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: auth.user.phone || "",
    addressType: "home",
    isDefault: true, // Set as default since it's the first address
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please log in again.");
        navigate("/login");
        return;
      }

      const response = await axios.post("/api/addresses", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Address created:", response.data);

      // Update auth context with new addresses
      const newAddresses = [...auth.addresses, response.data.address];
      setAuth({
        ...auth,
        addresses: newAddresses,
      });

      // Store addresses in localStorage
      localStorage.setItem("addresses", JSON.stringify(newAddresses));

      // Navigate to home or dashboard
      navigate("/");
    } catch (error) {
      console.error(
        "Error creating address:",
        error.response?.data || error.message
      );

      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setError(error.response.data.errors[0].msg);
        } else if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred while creating the address.");
        }
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("No response received from the server.");
      } else {
        console.error("Error message:", error.message);
        setError("An unexpected error occurred.");
      }
    }
  };
  
  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Add New Address
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipient Name */}
        <div>
          <label
            htmlFor="recipientName"
            className="block text-sm font-medium text-gray-700"
          >
            Recipient Name
          </label>
          <input
            id="recipientName"
            name="recipientName"
            type="text"
            value={formData.recipientName}
            onChange={handleChange}
            required
            placeholder="Enter recipient's full name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Company (Optional)
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Address Line 1 */}
        <div>
          <label
            htmlFor="line1"
            className="block text-sm font-medium text-gray-700"
          >
            Address Line 1
          </label>
          <input
            id="line1"
            name="line1"
            type="text"
            value={formData.line1}
            onChange={handleChange}
            required
            placeholder="Street address, P.O. box"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <label
            htmlFor="line2"
            className="block text-sm font-medium text-gray-700"
          >
            Address Line 2 (Optional)
          </label>
          <input
            id="line2"
            name="line2"
            type="text"
            value={formData.line2}
            onChange={handleChange}
            placeholder="Apartment, suite, unit, building, floor, etc."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="City"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State / Province
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              placeholder="State or Province"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Postal Code and Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Postal Code */}
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700"
            >
              Postal Code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleChange}
              required
              placeholder="ZIP or postal code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="Country"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g., +1 (555) 123-4567"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Address Type */}
        <div>
          <label
            htmlFor="addressType"
            className="block text-sm font-medium text-gray-700"
          >
            Address Type
          </label>
          <select
            id="addressType"
            name="addressType"
            value={formData.addressType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Default Address Checkbox */}
        <div className="flex items-center">
          <input
            id="isDefault"
            name="isDefault"
            type="checkbox"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isDefault"
            className="ml-2 block text-sm text-gray-900"
          >
            Set as default address
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm
                     font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none
                     focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
