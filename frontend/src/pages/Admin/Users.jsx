import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Popconfirm } from "antd"; // Import Ant Design components
import AdminLayout from "../../components/Layout/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast"; // For displaying success/error messages
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm(); // Ant Design Form

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data.data); // Fetch users from backend
        setUserCount(response.data.data.length);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users", err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle Add/Edit user submission
  const handleUserSubmit = async (values) => {
    try {
      if (isEditing) {
        // Update existing user
        await axios.put(`/api/users/update/${currentUser._id}`, values);
        toast.success("User updated successfully!");
      } else {
        // Add new user
        await axios.post("/api/users/create", values);
        toast.success("User added successfully!");
      }
      setIsModalVisible(false);
      form.resetFields();
      // Refetch users after adding/editing
      const response = await axios.get("/api/users");
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  // Function to handle delete user
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/delete/${userId}`);
      toast.success("User deleted successfully!");
      setUsers(users.filter((user) => user._id !== userId)); // Update UI after delete
    } catch (error) {
      toast.error("Failed to delete user!");
    }
  };

  // Function to open the modal for adding/editing a user
  const showModal = (user = null) => {
    setIsEditing(!!user); // If user is provided, we're editing
    setCurrentUser(user); // Set the current user being edited
    if (user) {
      form.setFieldsValue(user); // Pre-fill form with user data if editing
    }
    setIsModalVisible(true);
  };

  // Define the columns for the Ant Design table
  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="space-x-2">
          <Button
            onClick={() => showModal(record)} // Edit user
          >
            <PencilSquareIcon class="h-5 w-5 text-blue-500" />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this User?"
            onConfirm={() => handleDelete(record._id)}
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
      <div className="dark:bg-gray-900 p-2">
        <h1 className="text-xl font-medium mb-4">All Users</h1>
        <h4 className="text-lg font-medium mb-2">
          Number of Users: {userCount}
        </h4>

        <Button type="primary" className="mb-3" onClick={() => showModal()}>
          Add New User
        </Button>

        {/* Ant Design Table */}
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="_id" // Use _id as a unique identifier for each row
          pagination={{ pageSize: 5 }} // Pagination with 5 users per page
          className="dark-table"
        />

        {/* Modal for Adding/Editing Users */}
        <Modal
          title={isEditing ? "Edit User" : "Add New User"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()} // Trigger form submit on "OK"
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
                rules={[
                  { required: true, message: "Please enter the username" },
                ]}
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
                  {
                    required: !isEditing,
                    message: "Please enter the password",
                  },
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
      </div>
    </AdminLayout>
  );
};

export default Users;
