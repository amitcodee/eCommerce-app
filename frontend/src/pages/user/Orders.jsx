import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import UserMenu from "../../components/Layout/UserMenu";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/order/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data.success) {
          setOrders(data.data);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex">
      <div className="stick h-screen top-0">
        <UserMenu />
      </div>
      <div className="p-4 overflow-auto w-3/4">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="max-w-md mx-auto border bg-white rounded-lg overflow-hidden my-4"
              >
                <div className="p-4">
                  <h2 className="text-lg font-semibold">
                    Order ID: {order._id}
                  </h2>
                  <p>Status: {order.status}</p>
                  <p>Total: ₹{order.totalAmount}</p>
                  <p>
                    Ordered by: {order.user?.fullName} - {order.user?.phone}
                  </p>
                  <Link
                    to={`/order/${order._id}`}
                    className="text-blue-500 underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;