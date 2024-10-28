import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout/Layout";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  // Fetch order details on component mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`/api/order/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data.success) {
          setOrder(data.data);
          console.log(data);
        } else {
          toast.error("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to fetch order details");
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-2 ">
              <div className="">
                <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                <p className="">
                  <strong>Status:</strong> {order.status}
                </p>
                <p className="">
                  <strong>Total Amount:</strong> ₹{order.totalAmount}
                </p>
                <p className="">
                  <strong>Ordered by:</strong> {order.user?.fullName} -{" "}
                  {order.user?.phone}
                </p>
              </div>
              <div className="ml-28">
                {order.items.map((item) => (
                  
                  <img
                    src={`http://localhost:1000/${item.product.barcodeImagePath}`}
                    alt="Product Barcode"
                  />
                ))}
              </div>
            </div>



            <h3 className="text-lg font-bold mt-6 mb-2">Order Items</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100 dark:bg-gray-900">
                  <tr>
                    <th className="py-2 px-4 text-left border">
                      Product Image
                    </th>
                    <th className="py-2 px-4 text-left border">Product Name</th>
                    <th className="py-2 px-4 text-left border">Price</th>
                    <th className="py-2 px-4 text-left border">Quantity</th>
                    <th className="py-2 px-4 text-left border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.product._id}>
                      <td className="py-2 px-4 border">
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-16 h-16"
                        />
                      </td>
                      <td className="py-2 px-4 border">{item.product?.name}</td>
                      <td className="py-2 px-4 border">
                        ₹{item.product?.price}
                      </td>
                      <td className="py-2 px-4 border">{item.quantity}</td>
                      <td className="py-2 px-4 border">
                        ₹{item.product?.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Link
              to="/dashboard/user/order"
              className="text-blue-500 underline mt-6 inline-block"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
