import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Collapse, Button, Popover } from "antd";
import { CaretRightOutlined } from "@ant-design/icons"; // Import CaretRightOutlined from Ant Design icons
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const { Panel } = Collapse; // Destructure Panel from Collapse

const InventoryDashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalBuyingPrice, setTotalBuyingPrice] = useState(0);
  const [outOfStockProducts, setOutOfStockProducts] = useState(0);
  const [soldProducts, setSoldProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]); // Store products data
  const [stockData, setStockData] = useState({ labels: [], data: [] });
  const [stockLevelsData, setStockLevelsData] = useState({
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    // Fetch product data from the API
    const fetchInventoryData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:1000/api/products/get-products"
        );

        if (data.status === "success") {
          const productsData = data.data;
          setProducts(productsData); // Set the products data for table

          // Calculate total number of products available in stock
          const availableProducts = productsData.filter((product) =>
            product.variants.some((variant) => variant.quantity > 0)
          );
          setTotalProducts(availableProducts.length);

          // Calculate total buying price (sum of cost prices for each variant)
          const totalPrice = productsData.reduce((acc, product) => {
            return (
              acc +
              product.variants.reduce(
                (variantAcc, variant) =>
                  variantAcc + variant.costPrice * variant.quantity,
                0
              )
            );
          }, 0);
          setTotalBuyingPrice(totalPrice);

          // Calculate total number of out-of-stock products
          const outOfStock = productsData.filter((product) =>
            product.variants.every((variant) => variant.quantity === 0)
          );
          setOutOfStockProducts(outOfStock.length);

          // Prepare data for chart
          const chartLabels = productsData.map((product) => product.name);
          const chartData = productsData.map((product) =>
            product.variants.reduce((acc, variant) => acc + variant.quantity, 0)
          );

          setStockData({
            labels: chartLabels,
            data: chartData,
          });

          // Calculate stock levels (In Stock, Low Stock, Out of Stock)
          let inStockCount = 0;
          let lowStockCount = 0;
          let outOfStockCount = 0;

          productsData.forEach((product) => {
            product.variants.forEach((variant) => {
              if (variant.quantity === 0) {
                outOfStockCount++;
              } else if (variant.quantity > 0 && variant.quantity <= 10) {
                lowStockCount++;
              } else {
                inStockCount++;
              }
            });
          });

          setStockLevelsData({
            inStock: inStockCount,
            lowStock: lowStockCount,
            outOfStock: outOfStockCount,
          });

          // Fetch the sold products
          const soldResponse = await axios.get(
            "http://localhost:1000/api/inventory/sold-products"
          );

          const totalSoldProducts = soldResponse.data.soldProducts.reduce(
            (acc, product) => acc + product.quantitySold,
            0
          );
          setSoldProducts(totalSoldProducts);
        }
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  // Define columns for the Ant Design table
  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Variants",
      key: "variants",
      render: (text, record) => (
        <Collapse
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          className="site-collapse-custom-collapse"
        >
          <Panel header={`View Variants (${record.variants.length})`} key="1">
            {record.variants.map((variant, index) => (
              <div key={index} className="p-2 mb-2  rounded-lg">
                <p>
                  <strong>Size:</strong> {variant.size.name},{" "}
                  <strong>Color:</strong> {variant.color.name}
                </p>
                <p>
                  <strong>Price:</strong> ${variant.price.toFixed(2)},{" "}
                  <strong>Quantity:</strong> {variant.quantity}
                </p>
                <p>
                  <strong>Cost Price:</strong> ${variant.costPrice.toFixed(2)}
                </p>
              </div>
            ))}
          </Panel>
        </Collapse>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`px-2 py-1 rounded-full ${status === "active" ? "text-green-600 bg-green-50 border border-green-300" : "text-red-600 bg-red-50 border border-red-300"}`}>
          {status}
        </span>
      ),
    },
    {
      title: "Total Stock",
      dataIndex: "variants",
      key: "totalStock",
      render: (variants) =>
        variants.reduce((acc, variant) => acc + variant.quantity, 0),
    },
  ];

  // Data for the chart
  const barChartData = {
    labels: stockData.labels,
    datasets: [
      {
        label: "Inventory Stock",
        data: stockData.data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data for the inventory stock levels chart
  const stockLevelsChartData = {
    labels: ["In Stock", "Low Stock", "Out of Stock"],
    datasets: [
      {
        label: "Stock Levels",
        data: [
          stockLevelsData.inStock,
          stockLevelsData.lowStock,
          stockLevelsData.outOfStock,
        ],
        backgroundColor: ["#8B6BFA", "#B694FF", "#9AECFE"],
        borderColor: ["#8B6BFA", "#B694FF", "#9AECFE"],
        borderWidth: 1,
      },
    ],
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <AdminLayout>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg  border-2 border-gray-200">
            <h2 className="text-lg instrument-sans">Total Products In Stock</h2>
            <p className="text-2xl instrument-sans">{totalProducts}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg  border-2 border-gray-200">
            <h2 className="text-lg instrument-sans">Total Buying Price</h2>
            <p className="text-2xl instrument-sans">
              ${totalBuyingPrice.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg  border-2 border-gray-200">
            <h2 className="text-lg instrument-sans">Out Of Stock Products</h2>
            <p className="text-2xl instrument-sans">{outOfStockProducts}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg  border-2 border-gray-200">
            <h2 className="text-lg instrument-sans">Total Sold Products</h2>
            <p className="text-2xl instrument-sans">{soldProducts}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid lg:grid-cols-2 gap-4 ">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-gray-200 lg:max-w-full max-w-[280px] ">
            <h2 className="text-xl instrument-sans mb-4">Total Stock</h2>
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-gray-200 lg:max-w-full max-w-[280px] ">
            <h2 className="text-xl font-semibold mb-4">
              Inventory Stock Chart
            </h2>
            <Bar data={stockLevelsChartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Ant Design Table for Product Inventory */}
        <div className=" px-4 pt-5 mt-5 rounded-lg border-2 border-gray-200 lg:max-w-full max-w-[280px] ">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg instrument-sans">Product Inventory</h4>
            <a
              href="/dashboard/admin/inventory"
              className="text-blue-500 hover:text-blue-600"
            >
              View All →
            </a>
          </div>
          <Table
            columns={columns}
            dataSource={products}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 5 }}
            className="dark:text-white"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default InventoryDashboard;
