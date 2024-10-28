import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [isLoading, setIsLoading] = useState(true); // Spinner shows until verification is complete
  const [ok, setOk] = useState(false);
  const { auth } = useAuth(); // Access auth from context

  useEffect(() => {
    // Check if the user is authenticated and has the admin role
    if (auth?.isAuthenticated && auth?.user?.role === "customer") {
      setOk(true);
    } else {
      setOk(false);
    }
    setIsLoading(false); // Stop loading after check
  }, [auth]);

  // Show loading spinner while checking admin status
  if (isLoading) {
    return <Spinner path="" />;
  }

  // If not authorized as admin, redirect to login or home
  return ok ? <Outlet /> : <Navigate to="/login" />;
}
