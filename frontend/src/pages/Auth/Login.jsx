// components/Auth/Login.js

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const { emailOrUsername, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setAuth({
        isAuthenticated: true,
        user: response.data.user,
        loading: false,
      });

      navigate("/");
      toast.success("Login Successfully");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Invalid credentials");
      } else if (error.request) {
        setErrorMessage("No response received from the server.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-fixed bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://charlotte-fashion-1.myshopify.com/cdn/shop/files/bg2.jpg?v=1721313899')`,
        }}
      >
        <div className="w-full max-w-md p-8 space-y-6 backdrop-blur-sm rounded shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-white">
            Login
          </h2>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <form className="space-y-6" onSubmit={onSubmit}>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={onChange}
              required
              className="w-full p-3 border border-gray-300 bg-transparent text-white rounded focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              required
              className="w-full p-3 border border-gray-300 bg-transparent text-white rounded focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
            >
              Login
            </button>
            <p className="font-thin text-center text-md">
              Not have an account{" "}
              <NavLink
                to={"/signup"}
                className="text-blue-400 underline text-sm"
              >
                Signup
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
