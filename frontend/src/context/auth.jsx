// src/context/auth.js

import React, { createContext, useState, useEffect, useContext } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component that wraps your app and makes auth object available
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    addresses: [],
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const addresses = JSON.parse(localStorage.getItem("addresses")) || [];

    // If token and user exist, set isAuthenticated to true
    if (token && user) {
      setAuth({
        isAuthenticated: true,
        user,
        addresses,
        loading: false,
      });
    } else {
      // If no token or user, set to not authenticated
      setAuth({
        isAuthenticated: false,
        user: null,
        addresses: [],
        loading: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {auth.loading ? (
        <div className="flex items-center justify-center min-h-screen">
          {/* Loading indicator */}
          <p>Loading...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
