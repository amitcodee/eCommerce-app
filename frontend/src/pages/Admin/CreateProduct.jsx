import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/Layout/AdminLayout";
import { Modal, Button, Table, Popconfirm } from "antd";
import toast from "react-hot-toast";
import ProductForm from "../../components/Form/ProductForm";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const CreateProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Fetch products, including variants, sizes, and colors
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:1000/api/products/get-products",
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (data.status === "success") {
        const processedProducts = data.data.map((product) => ({
          ...product,
          price: product.variants?.[0]?.price || 0, // Extract price from the first variant for table display
        }));
        setProducts(processedProducts);
      } else {
        toast.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:1000/api/category", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Something went wrong.");
    }
  };

  // Fetch colors
  const fetchColors = async () => {
    try {
      const { data } = await axios.get("http://localhost:1000/api/get-colors", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (data.status === "success") {
        setColors(data.data);
      } else {
        toast.error("Failed to fetch colors.");
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
      toast.error("Something went wrong.");
    }
  };

  // Fetch sizes
  const fetchSizes = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:1000/api/size/get-sizes",
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (data.status === "success") {
        setSizes(data.data);
      } else {
        toast.error("Failed to fetch sizes.");
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchColors();
    fetchSizes();
  }, []);

  // Handle Form Submission
  const handleFormSubmit = async (formData) => {
    const token = getToken();
    const form = new FormData();

    // Append all form data except for the variants and images
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => form.append(`${key}[]`, item));
      } else {
        form.append(key, formData[key]);
      }
    }

    // Append product variants
    formData.variants.forEach((variant, index) => {
      form.append(`variants[${index}][size]`, variant.size);
      form.append(`variants[${index}][color]`, variant.color);
      form.append(`variants[${index}][price]`, variant.price);
      form.append(`variants[${index}][sellingPrice]`, variant.sellingPrice);
      form.append(`variants[${index}][costPrice]`, variant.costPrice);
      form.append(`variants[${index}][quantity]`, variant.quantity);

      // If the barcode or barcodeImagePath exist for the variant, include them
      if (variant.barcode) {
        form.append(`variants[${index}][barcode]`, variant.barcode);
      }
      if (variant.barcodeImagePath) {
        form.append(
          `variants[${index}][barcodeImagePath]`,
          variant.barcodeImagePath
        );
      }
    });

    // Append images
    fileList.forEach((file) => form.append("images", file.originFileObj));

    try {
      let response;

      // Update existing product
      if (editingProduct) {
        response = await axios.put(
          `http://localhost:1000/api/products/update/${editingProduct._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      // Create new product
      else {
        response = await axios.post(
          "http://localhost:1000/api/products/create",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // Handle success or failure response
      if (response.data.status === "success") {
        toast.success(
          editingProduct
            ? "Product updated successfully"
            : "Product created successfully"
        );
        fetchProducts();
        setIsModalVisible(false);
        resetForm(); // Reset form after successful submission
      } else {
        toast.error(
          response.data.message || "Failed to create/update product."
        );
      }
    } catch (error) {
      console.error("Error saving the product:", error);
      toast.error("Something went wrong while saving the product.");
    }
  };

  // Handle delete of a product
  const handleDelete = async (id) => {
    try {
      const token = getToken();
      const data = await axios.delete(
        `http://localhost:1000/api/products/delete/${id._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data?.status) {
        toast.success("Product deleted successfully.");
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the product.");
    }
  };

  // Reset form data
  const resetForm = () => {
    setEditingProduct(null);
    setFileList([]);
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  // Columns for the product table
  const columns = [
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) => {
        if (images && images.length > 0) {
          const featuredImage =
            images.find((img) => img.isFeatured) || images[0];
          const imageUrl = `http://localhost:1000${featuredImage.url}`;

          return (
            <img
              src={imageUrl}
              alt={featuredImage.altText || "Product Image"}
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          );
        }
        return "No Image";
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (categories) =>
        categories && categories.length > 0
          ? categories.map((cat) => cat.name).join(", ")
          : "Uncategorized",
    },
    {
      title: "Price",
      dataIndex: "price", // This will show the price of the first variant in the table
      key: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        { text: "< $50", value: 50 },
        { text: "$50 - $200", value: 100 },
        { text: "> $200", value: 101 },
      ],
      onFilter: (value, record) => {
        if (value === 50) return record.price < 50;
        if (value === 100) return record.price >= 50 && record.price <= 100;
        if (value === 101) return record.price > 100;
        return false;
      },
    },
    {
      title: "Sale Status", // Adding Sale Status
      dataIndex: "sale",
      key: "sale",
      filters: [
        { text: "On Sale", value: "Sale" },
        { text: "New", value: "New" },
        { text: "Clearance", value: "Clearance" },
      ],
      onFilter: (value, record) => record.sale === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleEditProduct(record)}>
            <PencilSquareIcon class="h-5 w-5 text-blue-500" />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this Product?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button>
              <TrashIcon class="h-5 w-5 text-red-500" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="dark:bg-gray-900">
        <Button onClick={() => setIsModalVisible(true)}>
          + Create Product
        </Button>

        {/* Product Table */}
        <Table
          dataSource={products}
          columns={columns}
          rowKey="_id"
          loading={loading}
          className="mt-4 dark-table"
          pagination={{
            pageSize: 5,
          }}
        />

        {/* Modal for Create/Edit */}
        <Modal
          title={editingProduct ? "Edit Product" : "Create New Product"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            resetForm();
          }}
          footer={null}
          width="80vw"
        >
          <ProductForm
            handleSubmit={handleFormSubmit}
            product={editingProduct}
            categories={categories}
            fileList={fileList}
            setFileList={setFileList}
            colors={colors}
            sizes={sizes}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default CreateProduct;
