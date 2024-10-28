import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/Layout/AdminLayout";
import { useForm } from "react-hook-form";
import { Table, Button, Input, Modal, Popconfirm } from "antd";
import toast from "react-hot-toast";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const CreateSize = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [sizes, setSizes] = useState([]);
  const [editingSize, setEditingSize] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Fetch all Sizes
  const fetchSizes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:1000/api/size/get-sizes", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (data.status === "success") {
        setSizes(data.data);
      } else {
        toast.error("Failed to fetch sizes.");
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  // Handle form submit (Create or Update Size)
  const onSubmit = async (formData) => {
    try {
      const token = getToken();
      let response;

      if (editingSize) {
        // Update existing size
        response = await axios.put(
          `http://localhost:1000/api/size/update-size/${editingSize._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new size
        response = await axios.post("http://localhost:1000/api/size/create-size", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.data.status === "success") {
        if (editingSize) {
          setSizes((prevSizes) =>
            prevSizes.map((size) => (size._id === response.data.data._id ? response.data.data : size))
          );
          toast.success("Size updated successfully");
        } else {
          setSizes((prevSizes) => [...prevSizes, response.data.data]);
          toast.success("Size created successfully");
        }

        reset();
        setEditingSize(null);
        setIsModalVisible(false);
      } else {
        toast.error("Failed to create/update size.");
      }
    } catch (error) {
      console.error("Error creating/updating size:", error);
      toast.error("Something went wrong.");
    }
  };

  // Handle edit size
  const handleEdit = (size) => {
    setEditingSize(size);
    setIsModalVisible(true);
    setValue("name", size.name); // Set form field value in the modal
  };

  // Handle delete size
  const handleDelete = async (id) => {
    try {
      const token = getToken();
      const { data } = await axios.delete(`http://localhost:1000/api/size/delete-size/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.status === "success") {
        setSizes((prevSizes) => prevSizes.filter((size) => size._id !== id));
        toast.success("Size deleted successfully");
      } else {
        toast.error("Failed to delete size.");
      }
    } catch (error) {
      console.error("Error deleting size:", error);
      toast.error("Something went wrong.");
    }
  };

  // Modal cancel function
  const handleCancelModal = () => {
    setEditingSize(null);
    setIsModalVisible(false);
  };

  // Columns for the size table
  const columns = [
    {
      title: "Size Name",
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
            title="Are you sure you want to delete this size?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="dark:bg-gray-900 p-4">
        {/* Create or Update Size Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-x-4 mb-4">
          <label htmlFor="sizeName">Size Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="mb-2 px-2 py-2 border rounded-md dark:bg-gray-900"
            placeholder="Enter size name"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            {editingSize ? "Update" : "Create"} Size
          </button>
        </form>

        {/* Sizes Table */}
        <Table
          dataSource={sizes}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          className="mt-4 dark-table"
        />

        {/* Edit Size Modal */}
        <Modal
          title="Edit Size"
          open={isModalVisible}
          onCancel={handleCancelModal}
          footer={null}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="sizeName">Size Name</label>
            <Input
              type="text"
              {...register("name", { required: true })}
              defaultValue={editingSize ? editingSize.name : ""}
              onChange={(e) => setValue("name", e.target.value)}
            />
            <Button type="primary" htmlType="submit" className="mt-2">
              Update Size
            </Button>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default CreateSize;
