import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import AdminLayout from "../../components/Layout/AdminLayout";
import { useForm } from "react-hook-form";
import { Table, Button, Input, Modal, Popconfirm } from "antd";
import toast from "react-hot-toast";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const CreateColor = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [colors, setColors] = useState([]);
  const [editingColor, setEditingColor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Fetch all colors
  const fetchColors = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  // Handle form submit (Create or Update Color)
  const onSubmit = async (formData) => {
    try {
      const token = getToken();

      if (editingColor) {
        // Update existing color
        const { data } = await axios.put(
          `http://localhost:1000/api/update-color/${editingColor._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.status === "success") {
          toast.success("Color updated successfully");
          fetchColors();
          reset(); // Clear form
          setEditingColor(null); // Clear editing color state
          setIsModalVisible(false); // Close modal
        } else {
          toast.error("Failed to update color.");
        }
      } else {
        // Create new color
        const { data } = await axios.post(
          "http://localhost:1000/api/create-color",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.status === "success") {
          toast.success("Color created successfully");
          fetchColors();
          reset(); // Clear form
        } else {
          toast.error("Failed to create color.");
        }
      }
    } catch (error) {
      console.error("Error creating/updating color:", error);
      toast.error("Something went wrong.");
    }
  };

  // Handle edit color
  const handleEdit = (color) => {
    setEditingColor(color); // Set the color to edit
    setIsModalVisible(true); // Open modal
    setValue("name", color.name); // Set form field value in the modal
  };

  // Handle delete color
  const handleDelete = async (id) => {
    try {
      const token = getToken();
      const { data } = await axios.delete(`http://localhost:1000/api/delete-color/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.status === "success") {
        toast.success("Color deleted successfully");
        fetchColors();
      } else {
        toast.error("Failed to delete color.");
      }
    } catch (error) {
      console.error("Error deleting color:", error);
      toast.error("Something went wrong.");
    }
  };

  // Columns for the color table
  const columns = [
    {
      title: "Color Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="space-x-2">
          <Button onClick={() => handleEdit(record)}>
            <PencilSquareIcon className="h-5 w-5 text-blue-500" />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this color?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button><TrashIcon className="h-5 w-5 text-red-500" /></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="dark:bg-gray-900 p-4">
        {/* Create New Color Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-x-4 mb-4">
          <label htmlFor="colorName">Color Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="mb-2 px-2 py-2 border dark:bg-gray-900 rounded-md"
            placeholder="Enter color name"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            {editingColor ? "Update" : "Create"} Color
          </button>
        </form>

        {/* Color Table */}
        <Table
          dataSource={colors}
          columns={columns}
          rowKey="_id"
          loading={loading}
          className="mt-4 dark-table"
          pagination={{ pageSize: 5 }}
        />

        {/* Edit Color Modal */}
        <Modal
          title="Edit Color"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="colorName">Color Name</label>
            <Input
              type="text"
              {...register("name", { required: true })}
              defaultValue={editingColor ? editingColor.name : ""}
            />
            <Button type="primary" htmlType="submit" className="mt-2">
              Update Color
            </Button>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default CreateColor;
