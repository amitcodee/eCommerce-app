import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import axios from "axios";
import {
  InputNumber,
  Button,
  Input,
  Select,
  Table,
  Pagination,
  Form,
  Modal,
} from "antd";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CategoryButtons from "../../components/CategoryButtons";
import QuickViewModal from "../../components/QuickViewModal";

const { Option } = Select;

const Product = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [discountType, setDiscountType] = useState("Percentage"); // State for discount type
  const [discountValue, setDiscountValue] = useState(0); // State for discount value
  const [discountAmount, setDiscountAmount] = useState(0);

  const getToken = () => localStorage.getItem("token");

  // Handle applying the discount
  const handleApplyDiscount = () => {
    let discount = 0;
    if (discountType === "Percentage") {
      discount = (totalAmount * discountValue) / 100;
    } else if (discountType === "Fixed") {
      discount = discountValue;
    }
    setDiscountAmount(discount); // Set the discount amount in state
  };

  // Calculate total after applying the discount
  const finalTotal = totalAmount - discountAmount + 19.05;
  // // Define a mapping between color names and Tailwind CSS color classes
  // const colorClassMap = {
  //   Red: "bg-red-500",
  //   Blue: "bg-blue-500",
  //   Green: "bg-green-500",
  //   Yellow: "bg-yellow-500",
  //   Pink: "bg-pink-500",
  //   Black: "bg-black",
  //   White: "bg-white border",
  //   Gray: "bg-gray-500",
  // };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:1000/api/products/get-products",
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (data.status === "success") {
        setProducts(data.data);
      } else {
        toast.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Something went wrong.");
    }
  };

  // Fetch categories
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

  // Fetch users for placing an order
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:1000/api/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(data?.users || data?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchUsers();
  }, []);

  const openQuickView = (product) => {
    setCurrentProduct(product);
    setIsQuickViewOpen(true);
  };

  // Filter products by search term and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      product.category.some((cat) => cat._id === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the current products to display based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handle category selection
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  // Handle adding items to cart
  // const handleAddToCart = (product) => {
  //   const { selectedColor, selectedSize } = selectedVariants[product._id] || {};

  //   if (!selectedColor || !selectedSize) {
  //     toast.error("Please select a color and size.");
  //     return;
  //   }

  //   const existingItem = selectedItems.find(
  //     (item) =>
  //       item.productId === product._id &&
  //       item.colorId === selectedColor &&
  //       item.sizeId === selectedSize
  //   );

  //   if (existingItem) {
  //     toast.error(`${product.name} in this variant is already in the cart.`);
  //     return;
  //   }

  //   const variant = product.variants.find(
  //     (v) => v.color._id === selectedColor && v.size._id === selectedSize
  //   );

  //   const updatedItems = [
  //     ...selectedItems,
  //     {
  //       productId: product._id,
  //       name: product.name,
  //       quantity: 1,
  //       price: variant.price,
  //       colorId: selectedColor,
  //       sizeId: selectedSize,
  //       colorName: variant.color.name,
  //       sizeName: variant.size.name,
  //     },
  //   ];

  //   setSelectedItems(updatedItems);
  //   setTotalAmount(totalAmount + variant.price);
  //   toast.success(`${product.name} added to cart.`);
  // };

  const addToCart = (product, quantity, selectedColor, selectedSize, price) => {
    const newItem = {
      productId: product._id,
      name: product.name,
      quantity,
      price,
      colorId: selectedColor,
      sizeId: selectedSize,
    };
    setSelectedItems([...selectedItems, newItem]);
    setTotalAmount(totalAmount + price * quantity);
  };

  // Handle removing items from cart
  const handleRemoveFromCart = (productId) => {
    const updatedItems = selectedItems.filter(
      (item) => item.productId !== productId
    );
    const removedItem = selectedItems.find(
      (item) => item.productId === productId
    );

    setSelectedItems(updatedItems);
    setTotalAmount(totalAmount - removedItem.price * removedItem.quantity);
    toast.success(`${removedItem.name} removed from cart.`);
  };

  // Update quantity in cart
  const handleUpdateQuantity = (productId, quantity) => {
    const updatedItems = selectedItems.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    const updatedTotal = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setSelectedItems(updatedItems);
    setTotalAmount(updatedTotal);
  };

  // Handle selecting color and size
  // const handleSelectVariant = (productId, type, value) => {
  //   setSelectedVariants((prevState) => ({
  //     ...prevState,
  //     [productId]: {
  //       ...prevState[productId],
  //       [type]: value,
  //     },
  //   }));
  // };

  const handlePlaceOrder = async () => {
    if (!selectedUser || selectedItems.length === 0 || totalAmount <= 0) {
      toast.error("Please fill all required fields.");
      return;
    }

    const orderData = {
      userId: selectedUser,
      items: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        color: item.colorId,
        size: item.sizeId,
      })),
      totalAmount,
    };

    try {
      const response = await axios.post(
        "http://localhost:1000/api/order/admin/place-order",
        orderData,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.data.success) {
        toast.success("Order placed successfully by admin!");
        setSelectedItems([]);
        setTotalAmount(0);
      } else {
        toast.error(response.data.message || "Failed to place the order.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Function to handle Add/Edit user submission
  const handleUserSubmit = async (values) => {
    try {
      if (isEditing) {
        await axios.put(`/api/users/update/${currentUser._id}`, values);
        toast.success("User updated successfully!");
      } else {
        await axios.post("/api/users/create", values);
        toast.success("User added successfully!");
      }
      setIsModalVisible(false);
      form.resetFields();
      const response = await axios.get("/api/users");
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  // // Function to handle delete user
  // const handleDelete = async (userId) => {
  //   try {
  //     await axios.delete(`/api/users/delete/${userId}`);
  //     toast.success("User deleted successfully!");
  //     setUsers(users.filter((user) => user._id !== userId));
  //   } catch (error) {
  //     toast.error("Failed to delete user!");
  //   }
  // };

  // Function to open the modal for adding/editing a user
  const showModal = (user = null) => {
    setIsEditing(!!user);
    setCurrentUser(user);
    if (user) {
      form.setFieldsValue(user);
    }
    setIsModalVisible(true);
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 border-2 border-gray-200 px-4 py-2 rounded-2xl">
          {/* Category Filter */}
          <div className="flex gap-4">
            <Select
              placeholder="Select a category"
              className="mb-4"
              style={{ width: "100%" }}
              onChange={handleCategoryChange}
            >
              <Option value={null}>All Categories</Option>
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
            <Input
              placeholder="Search products..."
              className="mb-4"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProducts.map((product) => (
              <div
                key={product._id} // Ensure correct key
                onClick={() => openQuickView(product)}
                className="relative "
              >
                 {product.variants?.[0]?.costPrice >
                      product.variants?.[0]?.sellingPrice && (
                      <span className="text-sm price absolute top-2 left-2 bg-[#D2EF9A] px-2 py-1 rounded-md">
                        - {(
                          ((product.variants[0]?.costPrice -
                            product.variants[0]?.sellingPrice) /
                            product.variants[0]?.costPrice) *
                          100
                        ).toFixed(0)}%
                      </span>
                    )}
                <span className="absolute price top-10 left-2 bg-[#D2EF9A] text-sm px-2 py-1 rounded-md">
                  {product.sale || "N/A"}
                </span>
                <img
                  src={`http://localhost:1000${product.images[0]?.url || ""}`}
                  alt={product.name}
                  className="w-full h-48 duration-300 object-cover bg-gray-50"
                />
                <div className="px-2 py-2">
                  <span className="text-xl instrument-sans text-gray-800">
                    {product.name}
                  </span>
                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg instrument text-gray-700">
                      $
                      {product.variants?.[0]?.sellingPrice ||
                        product.sellingPrice}
                    </span>
                    <span className="text-lg instrument text-gray-400 line-through">
                      ${product.variants?.[0]?.costPrice || product.costPrice}
                    </span>
                   
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick View Modal */}
          {currentProduct && (
            <QuickViewModal
              product={currentProduct}
              open={isQuickViewOpen}
              setOpen={setIsQuickViewOpen}
              addToCart={addToCart}
            />
          )}

          {/* Pagination Component */}
          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={productsPerPage}
              total={filteredProducts.length}
              onChange={handlePageChange}
            />
          </div>
        </div>

        {/* Right Sidebar: User, Cart, etc. */}
        <div className="col-span-1 border-2 border-gray-200 px-4 py-2 rounded-2xl">
          <div className="">
            {/* User Selection */}
            <div className="mb-4 gap-3 flex">
              <Select
                placeholder="Select a user"
                style={{ width: "100%" }}
                onChange={(value) => setSelectedUser(value)}
              >
                {users.map((user) => (
                  <Option key={user._id} value={user._id}>
                    {user.fullName}
                  </Option>
                ))}
              </Select>
              <Button
                type="primary"
                className="mb-3 bg-[#1f1f1f]"
                onClick={() => setIsModalVisible(true)}
              >
                Add New User
              </Button>
            </div>

            {/* Cart Items */}
            <div className="">
              {selectedItems.length > 0 ? (
                <>
                  <div>
                    <Table
                      dataSource={selectedItems}
                      columns={[
                        { title: "Product", dataIndex: "name", key: "name" },
                        {
                          title: "Price",
                          dataIndex: "price",
                          key: "price",
                          render: (text) => `₹${text}`,
                        },
                        {
                          title: "Quantity",
                          dataIndex: "quantity",
                          key: "quantity",
                          render: (text, record) => (
                            <InputNumber
                              min={1}
                              value={text}
                              onChange={(value) =>
                                handleUpdateQuantity(record.productId, value)
                              }
                            />
                          ),
                        },
                        // {
                        //   title: "Total",
                        //   key: "total",
                        //   render: (_, record) =>
                        //     `₹${record.price * record.quantity}`,
                        // },
                        {
                          title: "Action",
                          key: "action",
                          render: (_, record) => (
                            <Button
                              type="link"
                              onClick={() =>
                                handleRemoveFromCart(record.productId)
                              }
                            >
                              <XMarkIcon className="h-5 w-5 text-black" />
                            </Button>
                          ),
                        },
                      ]}
                      rowKey="productId"
                      pagination={false}
                    />
                  </div>
                  {/* Discount Section */}
                  <div className="mt-6">
                    <Input.Group compact style={{ display: "flex" }}>
                      <Select
                        defaultValue="Percentage"
                        onChange={(value) => setDiscountType(value)}
                        style={{ width: "30%" }} // Adjust the width as per your need
                      >
                        <Option value="Percentage">%</Option>
                        <Option value="Fixed">₹</Option>{" "}
                        {/* Or use "$" for dollar sign */}
                      </Select>
                      <Input
                        placeholder="Discount Value"
                        className="w-full"
                        value={discountValue}
                        onChange={(e) =>
                          setDiscountValue(Number(e.target.value))
                        }
                        style={{ flex: 1 }}
                      />
                      <Button
                        className="bg-blue-600 text-white"
                        onClick={handleApplyDiscount}
                        // Add margin to separate button if needed
                      >
                        Apply
                      </Button>
                    </Input.Group>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center ">
                  <img
                    src="https://demo.shopperz.codezenbd.com/images/required/empty-cart.gif"
                    className="h-48 w-48"
                  />
                </div>
              )}

              {/* Summary */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between instrument-sans">
                  <span>SubTotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 intrument-sans">
                  <span>Tax</span>
                  <span>$19.05</span>
                </div>
                <div className="flex justify-between text-gray-600 intrument-sans">
                  <span>Discount</span>
                  <span>${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg instrument-sans">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 text-center">
                <Button
                  className="bg-[#1f1f1f] w-full text-white"
                  onClick={handlePlaceOrder}
                >
                  Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Adding/Editing Users */}
      <Modal
        title={isEditing ? "Edit User" : "Add New User"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width="50vw"
      >
        <Form form={form} onFinish={handleUserSubmit} layout="vertical">
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please enter the first name" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter the last name" },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter the username" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: !isEditing, message: "Please enter the password" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select>
              <Option value="customer">Customer</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default Product;
