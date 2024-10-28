import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table, Select, Button, Modal } from "antd";
import { toast } from "react-hot-toast";
import { useReactToPrint } from "react-to-print"; // Library to handle print functionality
import AdminLayout from "../../components/Layout/AdminLayout";
import { EyeIcon, PrinterIcon } from "@heroicons/react/24/outline";
const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track the selected order for printing and viewing
  const [loading, setLoading] = useState(true);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false); // Modal visibility for viewing order details

  // Fetch all orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:1000/api/order/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.success) {
          setOrders(data.data);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Reference to the current order being printed
  const componentRef = useRef();

  // Function to print the selected order
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Order Receipt",
  });

  // Update order status
  const handleStatusChange = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:1000/api/order/update-status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
        toast.success("Order status updated successfully");
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const fetchSizeAndColorNames = async (sizeId, colorId) => {
    try {
      const sizeResponse = await axios.get(
        `http://localhost:1000/api/size/sizes/${sizeId}`
      );
      const colorResponse = await axios.get(
        `http://localhost:1000/api/colors/${colorId}`
      );

      return {
        sizeName: sizeResponse.data.name,
        colorName: colorResponse.data.name,
      };
    } catch (error) {
      console.error("Error fetching size or color details:", error);
      return { sizeName: "Unknown Size", colorName: "Unknown Color" };
    }
  };

  // Set the selected order and print only that order
  const handleReceiptPrint = async (order) => {
    const updatedItems = await Promise.all(
      order.items.map(async (item) => {
        // Ensure only the product ID is passed
        const productId = item.product._id || item.product; // Get the product's _id correctly
        const { sizeName, colorName } = await fetchSizeAndColorNames(
          item.size,
          item.color
        );

        // Fetch product details to get the barcodeImagePath
        const productResponse = await axios.get(
          `http://localhost:1000/api/products/${productId}` // Pass the correct productId
        );

        // Find the correct variant by matching size and color IDs
        const variant = productResponse.data.product.variants.find(
          (v) => v.size._id === item.size && v.color._id === item.color
        );

        // Return the updated item including sizeName, colorName, and barcode
        return {
          ...item,
          sizeName,
          colorName,
          barcodeImagePath: variant.barcodeImagePath || null, // Add barcodeImagePath
        };
      })
    );
    setSelectedOrder({ ...order, items: updatedItems }); // Set the order to be printed
    setTimeout(() => handlePrint(), 0); // Trigger print after setting the selected order
  };

  const handleViewOrder = async (order) => {
    const updatedItems = await Promise.all(
      order.items.map(async (item) => {
        // Ensure only the product ID is passed
        const productId = item.product._id || item.product; // Get the product's _id correctly
        const { sizeName, colorName } = await fetchSizeAndColorNames(
          item.size,
          item.color
        );

        // Fetch product details to get the barcodeImagePath
        const productResponse = await axios.get(
          `http://localhost:1000/api/products/${productId}` // Pass the correct productId
        );

        // Find the correct variant by matching size and color IDs
        const variant = productResponse.data.product.variants.find(
          (v) => v.size._id === item.size && v.color._id === item.color
        );

        // Return the updated item including sizeName, colorName, and barcode
        return {
          ...item,
          sizeName,
          colorName,
          barcodeImagePath: variant.barcodeImagePath || null, // Add barcodeImagePath
        };
      })
    );

    setSelectedOrder({ ...order, items: updatedItems });
    setIsViewModalVisible(true); // Open the modal to view order details
  };

  // Close the View Modal
  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedOrder(null); // Clear the selected order when the modal is closed
  };

  // Table columns with sorting and filtering
  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "id",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Customer Name",
      dataIndex: ["user", "fullName"],
      key: "customerName",
      filters: Array.from(
        new Set(orders.map((order) => order.user?.fullName || "N/A"))
      ).map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => (record.user?.fullName || "N/A") === value,
      sorter: (a, b) =>
        (a.user?.fullName || "").localeCompare(b.user?.fullName || ""),
      render: (text, record) => record.user?.fullName || "N/A",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount) => `$${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Completed", value: "completed" },
        { text: "Shipped", value: "shipped" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status, record) => (
        <Select
          defaultValue={status}
          onChange={(value) => handleStatusChange(record._id, value)}
          className="w-full"
        >
          <Option value="pending">Pending</Option>
          <Option value="completed">Completed</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className=" space-x-2">
          <Button
         
            onClick={() => handleViewOrder(record)}
          >
           <EyeIcon class="h-5 w-5 " />
          </Button>
          <Button
          
            onClick={() => handleReceiptPrint(record)}
          >
            <PrinterIcon class="h-5 w-5 " />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="bg-white dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 7 }}
            className="dark-table"
          />
        </div>

        {/* View Order Modal */}
        <Modal
          title="Order Details"
          visible={isViewModalVisible}
          onCancel={handleCloseViewModal}
          footer={null}
          width="50vw"
        >
          {selectedOrder && (
            <div>
              <div className="grid grid-cols-2">
                <div>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder._id}
                  </p>
                  <p>
                    <strong>Customer Name:</strong>{" "}
                    {selectedOrder.user?.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.user?.email}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>
                </div>
                <div className="mt-16">
                  <img
                    src={`http://localhost:1000/${selectedOrder.barcodeImagePath}`}
                    alt="Order Barcode"
                  />
                </div>
              </div>

              <h3 className="font-semibold mt-4">Products</h3>
              <table className="w-full border mt-2">
                <thead>
                  <tr>
                    {/* <th className="px-4 py-2 border">Product Barcode</th> */}
                    <th className="px-4 py-2 border">Product Image</th>
                    <th className="px-4 py-2 border">Product Name</th>
                    <th className="px-4 py-2 border">SKU</th>
                    <th className="px-4 py-2 border">Size</th>
                    <th className="px-4 py-2 border">Color</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item._id}>
                      {/* <td className="px-4 py-2 border">
                        {item.barcodeImagePath ? (
                          <img
                            src={`http://localhost:1000/${item.barcodeImagePath}`}
                            alt="Product Barcode"
                            className="w-20 h-20"
                          />
                        ) : (
                          <span>No Barcode</span>
                        )}
                      </td> */}
                      <td className="px-4 py-2 border">
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-full h-20"
                        />
                      </td>
                      <td className="px-4 py-2 border">{item.product.name}</td>
                      <td className="px-4 py-2 border">{item.product.sku}</td>
                      <td className="px-4 py-2 border">{item.sizeName}</td>
                      <td className="px-4 py-2 border">{item.colorName}</td>
                      <td className="px-4 py-2 border">{item.quantity}</td>
                      <td className="px-4 py-2 border">${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-2">
                <div className="text-right">
                  <p className="text-lg font-semibold">Total Amount:</p>
                  <p className="text-xl font-bold text-green-600">
                    ${selectedOrder.totalAmount}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Hidden component that holds the receipt details for printing */}
        {selectedOrder && (
          <div style={{ display: "none" }}>
            <div ref={componentRef}>
              <div className="receipt p-8">
                <div className="grid grid-cols-2">
                  <div>
                    <h2 className="text-lg font-semibold">Order Receipt</h2>
                    <p>
                      <strong>Order ID:</strong> {selectedOrder._id}
                    </p>
                    <p>
                      <strong>Customer Name:</strong>{" "}
                      {selectedOrder.user?.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedOrder.user?.email}
                    </p>
                    <p>
                      <strong>Order Status:</strong> {selectedOrder.status}
                    </p>
                  </div>
                  <div className="mt-16">
                    <img
                      src={`http://localhost:1000/${selectedOrder.barcodeImagePath}`}
                      alt="Order Barcode"
                    />
                  </div>
                </div>

                <h3 className="font-semibold mt-4">Products</h3>
                <table className="w-full border mt-2">
                  <thead>
                    <tr>
                      {/* <th className="px-4 py-2 border">Product Barcode</th> */}
                      <th className="px-4 py-2 border">Product Image</th>
                      <th className="px-4 py-2 border">Product Name</th>
                      <th className="px-4 py-2 border">SKU</th>
                      <th className="px-4 py-2 border">Size</th>
                      <th className="px-4 py-2 border">Color</th>
                      <th className="px-4 py-2 border">Quantity</th>
                      <th className="px-4 py-2 border">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item) => (
                      <tr key={item._id}>
                        {/* <td className="px-4 py-2 border">
                          {item.barcodeImagePath ? (
                            <img
                              src={`http://localhost:1000/${item.barcodeImagePath}`} // Use item's barcodeImagePath
                              alt="Product Barcode"
                            />
                          ) : (
                            <span>No Barcode</span>
                          )}
                        </td> */}
                        <td className="px-4 py-2 border">
                          <img
                            src={item.product.images[0]?.url}
                            alt={item.product.name}
                            className="w-full h-20"
                          />
                        </td>
                        <td className="px-4 py-2 border">
                          {item.product.name}
                        </td>
                        <td className="px-4 py-2 border">{item.product.sku}</td>
                        <td className="px-4 py-2 border">
                          {item.sizeName}
                        </td>{" "}
                        {/* Show fetched size name */}
                        <td className="px-4 py-2 border">
                          {item.colorName}
                        </td>{" "}
                        {/* Show fetched color name */}
                        <td className="px-4 py-2 border">{item.quantity}</td>
                        <td className="px-4 py-2 border">${item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total Amount Section */}
                <div className="flex justify-end mt-2">
                  <div className="text-right">
                    <p className="text-lg font-semibold">Total Amount:</p>
                    <p className="text-xl font-bold text-green-600">
                      ${selectedOrder.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
