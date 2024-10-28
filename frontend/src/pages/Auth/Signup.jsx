// components/Auth/Signup.js

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const { firstName, lastName, username, email, phone, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/auth/register",
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update the authentication state
      setAuth({
        user: response.data.user,
        addresses: [],
        loading: false,
      });
      navigate("/login");
      toast.success("Sign Up Suucessfully")
      // Redirect to add address
      //navigate("/add-address");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Something went wrong");
      } else if (error.request) {
        setErrorMessage("No response received from the server.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 bg-fixed bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://charlotte-fashion-1.myshopify.com/cdn/shop/files/bg2.jpg?v=1721313899')`,
      }}
    >
      
      <div className="w-full max-w-md p-8 space-y-6 backdrop-blur-sm rounded shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Sign Up
        </h2>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <form className="space-y-6" onSubmit={onSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={onChange}
            required
            className="w-full p-3 border border-gray-300 bg-transparent text-white rounded focus:outline-none"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={onChange}
            required
            className="w-full p-3 border border-gray-300 bg-transparent text-white rounded focus:outline-none "
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={onChange}
            required
            className="w-full p-3 border border-gray-300 bg-transparent text-white rounded focus:outline-none "
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
            required
            className="w-full p-3 border border-gray-300 bg-transparent text-white rounded focus:outline-none "
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={phone}
            onChange={onChange}
            required
            className="w-full p-3 border border-gray-300 bg-transparent text-white rounded focus:outline-none "
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            required
            className="w-full p-3 border border-gray-300 bg-transparent text-white rounded focus:outline-none "
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
          <p className="font-thin text-center text-md">
            Already Registerd{" "}
            <NavLink to={"/login"} className="text-blue-400 underline text-sm">
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
