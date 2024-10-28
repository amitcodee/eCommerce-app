import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import AdminLayout from "../../components/Layout/AdminLayout";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal, Button, Table, Popconfirm } from "antd"; // Using Ant Design components
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // State for creating a category
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // State for updating a category
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedImage, setUpdatedImage] = useState(null);

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Handle form submission to create a category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        "http://localhost:1000/api/category/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success(`${name} created successfully.`);
        setName("");
        setDescription("");
        setImage(null);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating the category.");
    }
  };

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("http://localhost:1000/api/category", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (data?.success) {
        setCategories(data?.categories);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle update of a category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();

      const formData = new FormData();
      formData.append("name", updatedName);
      formData.append("description", updatedDescription);
      if (updatedImage) {
        formData.append("image", updatedImage);
      }

      const { data } = await axios.put(
        `http://localhost:1000/api/category/update/${selected._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success(`${updatedName} updated successfully.`);
        setSelected(null);
        setUpdatedName("");
        setUpdatedDescription("");
        setUpdatedImage(null);
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating the category.");
    }
  };

  // Handle delete of a category
  const handleDelete = async (id) => {
    try {
      const token = getToken();
      const { data } = await axios.delete(
        `http://localhost:1000/api/category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data?.success) {
        toast.success("Category deleted successfully.");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting the category.");
    }
  };

  // Table columns for displaying categories
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={`http://localhost:1000/${image}`}
            alt="Category"
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="space-x-2">
          <Button
          
            onClick={() => {
              setVisible(true);
              setSelected(record);
              setUpdatedName(record.name);
              setUpdatedDescription(record.description);
            }}
          >
           <PencilSquareIcon class="h-5 w-5 text-blue-500" />
          </Button>
           <Popconfirm
            title="Are you sure you want to delete this Category?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button><TrashIcon class="h-5 w-5 text-red-500" /></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="dark:bg-gray-900">
        <Button onClick={() => setVisible(true)} className="mb-4">
          + Create Category
        </Button>

        {/* Table for displaying categories */}
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          loading={loading}
          className="dark-table"
          pagination={{
            pageSize: 5,
          }}
        />

        {/* Modal for creating/updating a category */}
        <Modal
          title={selected ? "Update Category" : "Create Category"}
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <CategoryForm
            handleSubmit={selected ? handleUpdate : handleSubmit}
            value={selected ? updatedName : name}
            setValue={selected ? setUpdatedName : setName}
            description={selected ? updatedDescription : description}
            setDescription={selected ? setUpdatedDescription : setDescription}
            image={selected ? updatedImage : image}
            setImage={selected ? setUpdatedImage : setImage}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default CreateCategory;
