import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout"; // Import the AdminLayout
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { Table } from "antd";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]); // For quick access orders

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          `http://localhost:1000/api/users`
        );
        const { data } = usersResponse.data;
        setUsers(usersResponse.data);
        setUserCount(data.filter((user) => user.role !== "admin").length);

        const categoryResponse = await axios.get(
          "http://localhost:1000/api/category"
        );
        setCategoryCount(categoryResponse?.data?.categories?.length || 0);

        const productResponse = await axios.get(
          "http://localhost:1000/api/products/get-products"
        );
        setProductCount(productResponse?.data?.data?.length || 0);

        const orderResponse = await axios.get(
          "http://localhost:1000/api/order/all"
        );
        const fetchedOrders = orderResponse?.data?.data || [];
        setOrders(fetchedOrders);
        //console.log(fetchedOrders)
        setOrderCount(fetchedOrders.length);

        const revenue = fetchedOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        setTotalRevenue(revenue);

        // Fetch recent products
        const recentProductData = productResponse?.data?.data.slice(0, 4); // Get only the 4 most recent products
        setRecentProducts(recentProductData);
        // Set the recent orders (e.g., last 5 orders)
        const recentOrderData = fetchedOrders.slice(0, 5); // Adjust the number as needed
        setRecentOrders(recentOrderData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Something went wrong while fetching data.");
      }
    };

    fetchData();
  }, []);

  // Process the orders data to count the orders by status
  const orderStatusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1; // Count each status
      return acc;
    },
    { pending: 0, completed: 0, shipped: 0 }
  );

  // Data for the bar chart
  const orderStatusBarChartData = {
    labels: ["Pending", "Completed", "Shipped"], // X-axis labels for each status
    datasets: [
      {
        label: "Order Status Count", // Label for the chart
        data: [
          orderStatusCounts.pending,
          orderStatusCounts.completed,
          orderStatusCounts.shipped,
        ], // Y-axis data: count of orders per status
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Color for pending orders
          "rgba(75, 192, 192, 0.6)", // Color for completed orders
          "rgba(54, 162, 235, 0.6)", // Color for shipped orders
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // Border color for pending orders
          "rgba(75, 192, 192, 1)", // Border color for completed orders
          "rgba(54, 162, 235, 1)", // Border color for shipped orders
        ],
        borderWidth: 1,
      },
    ],
  };

  const option = {
    scales: {
      y: {
        beginAtZero: true, // Start Y-axis at zero
        title: {
          display: true,
          text: "Number of Orders", // Y-axis label
        },
      },
      x: {
        title: {
          display: true,
          text: "Order Status", // X-axis label
        },
      },
    },
  };

  // Group orders by date and calculate total sales per day and number of orders per day
  const salesAndOrdersPerDay = orders.reduce(
    (acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      acc.sales[date] = (acc.sales[date] || 0) + order.totalAmount; // Sum the totalAmount per date
      acc.orders[date] = (acc.orders[date] || 0) + 1; // Count the number of orders per date
      return acc;
    },
    { sales: {}, orders: {} }
  );

  // Combined data for total sales and number of orders with dual Y-axis
  const combinedBarChartData = {
    labels: Object.keys(salesAndOrdersPerDay.sales), // Dates as X-axis labels
    datasets: [
      {
        label: "Total Sales (₹)", // Total sales dataset
        data: Object.values(salesAndOrdersPerDay.sales),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        yAxisID: "y", // Assign to primary Y-axis
      },
      {
        label: "Number of Orders", // Number of orders dataset
        data: Object.values(salesAndOrdersPerDay.orders),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        yAxisID: "y1", // Assign to secondary Y-axis
      },
    ],
  };

  // Options for the chart to enable dual Y-axes
  const options = {
    scales: {
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Total Sales (₹)", // Label for primary Y-axis
        },
        ticks: {
          beginAtZero: true,
        },
      },
      y1: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Number of Orders", // Label for secondary Y-axis
        },
        grid: {
          drawOnChartArea: false, // This prevents the grid lines of y1 from overlaying y
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  // Data for the total revenue line chart
  const totalRevenueLineChartData = {
    labels: Object.keys(salesAndOrdersPerDay.sales), // Dates as X-axis labels
    datasets: [
      {
        label: "Total Revenue (₹)",
        data: Object.values(salesAndOrdersPerDay.sales), // Total revenue per day
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };
  // Columns for the Recent Products Table
  const productColumns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <img
            src={`http://localhost:1000${record?.images[0]?.url || ""}`}
            alt={record.name}
            className="w-10 h-10 object-cover"
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "variants",
      key: "variants",
      render: (variants) => `₹${variants?.[0]?.price || "N/A"}`,
    },
  ];

  // Table columns for displaying recent orders
  const orderColumns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    // {
    //   title: "Customer Name",
    //   dataIndex: "user",
    //   key: "user",
    //   render: (user) => user?.fullname || "N/A",
    // },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `₹${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full ${
            status === "completed"
              ? "bg-green-50 text-green-600 border border-green-300"
              : status === "pending"
              ? "bg-yellow-50 text-yellow-600 border border-yellow-300"
              : "bg-gray-50 text-gray-600 border border-gray-300"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      {/* Dashboard content */}
      <div className="bg-white dark:bg-gray-900">
        {/* Summary: Users, Products, Categories, Orders */}
        <div className="mb-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg  border-2 border-gray-200">
              <h4 className="text-lg instrument-sans">Number of Users</h4>
              <p className="text-2xl instrument-sans">{userCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg  border-2 border-gray-200">
              <h4 className="text-lg instrument-sans">Total Products</h4>
              <p className="text-2xl instrument-sans">{productCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg  border-2 border-gray-200">
              <h4 className="text-lg instrument-sans">Total Categories</h4>
              <p className="text-2xl instrument-sans">{categoryCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg  border-2 border-gray-200">
              <h4 className="text-lg instrument-sans">Total Orders</h4>
              <p className="text-2xl instrument-sans">{orderCount}</p>
            </div>
          </div>
        </div>

        {/* Order Summary: Bar and Line charts */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Bar chart for Total Sales per Day */}
          <div className="bg-white pt-5 border-2 border-gray-200 rounded-lg px-3 lg:max-w-full max-w-[280px] ">
            <h4 className="text-lg instrument-sans text-black">Total Sales</h4>
            <div className="mt-10 max-h-96 w-full">
              {orders.length > 0 ? (
                <Bar data={combinedBarChartData} />
              ) : (
                <p>No Sales and Orders Data Available</p>
              )}
            </div>
          </div>
          <div className="bg-white pt-5 pb-3 border-2 border-gray-200 rounded-lg px-3 lg:max-w-full max-w-[280px] ">
            <h4 className="text-lg instrument-sans text-black">
              Total Revenue
            </h4>
            <div className="mt-10 ">
              {orders.length > 0 ? (
                <Line data={totalRevenueLineChartData} />
              ) : (
                <p>No Revenue Data Available</p>
              )}
            </div>
          </div>
        </div>

        {/* Line chart for Total Revenue per Day */}
        <div className="grid lg:grid-cols-3 gap-4 pt-5">
          <div className="bg-white pt-5 border-2 border-gray-200 rounded-lg px-3 lg:max-w-full max-w-[280px] col-span-2">
            <h4 className="text-lg instrument-sans text-black">Order Status</h4>
            <div className="mt-10">
              {orders.length > 0 ? (
                <Bar data={orderStatusBarChartData} options={option} />
              ) : (
                <p>No Order Data Available</p>
              )}
            </div>
          </div>

          <div className="bg-white px-4 pt-5 rounded-lg border-2 border-gray-200 col-span-1 lg:max-w-full max-w-[280px] ">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg instrument-sans">Products</h4>
              <a
                href="/dashboard/admin/create-product"
                className="text-blue-500 hover:text-blue-600"
              >
                View All →
              </a>
            </div>
            <Table
              dataSource={recentProducts}
              columns={productColumns}
              pagination={false}
              rowKey="_id"
            />
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="pt-5">
          <div className="px-4 pt-5 rounded-lg border-2 border-gray-200 lg:max-w-full max-w-[280px]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg instrument-sans">Recent Orders</h4>
              <a
                href="/dashboard/admin/orders"
                className="text-blue-500 hover:text-blue-600"
              >
                View All →
              </a>
            </div>
            <Table
              dataSource={recentOrders} // Display the recent orders
              columns={orderColumns}
              pagination={false}
              rowKey="_id"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
