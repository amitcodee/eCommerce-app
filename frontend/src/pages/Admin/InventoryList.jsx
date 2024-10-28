import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Spin, Popconfirm } from "antd";
import AdminLayout from "../../components/Layout/AdminLayout";
import InventoryForm from "../../components/Form/InventoryForm";
import { toast } from "react-hot-toast";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const InventoryList = () => {
  const [inventoryRecords, setInventoryRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null); // For editing

  // Fetch inventory records from API
  const fetchInventoryRecords = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:1000/api/inventory/all"
      );
      if (data.success) {
        setInventoryRecords(data.inventoryRecords);
      } else {
        toast.error("Failed to fetch inventory records");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Error fetching inventory records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryRecords();
  }, []);

  // Handle Edit - set the current record to edit
  const handleEdit = (record) => {
    if (record) {
      setCurrentRecord(record); // Pass the selected record to the form for editing
      setIsModalVisible(true);
    }
  };

  // Handle Delete - confirm and delete the inventory record
  const handleDelete = async (recordId) => {
    try {
      await axios.delete(`http://localhost:1000/api/inventory/${recordId}`);
      toast.success("Inventory record deleted successfully");
      fetchInventoryRecords(); // Refresh inventory records after deletion
    } catch (error) {
      console.error("Error deleting inventory record:", error);
      toast.error("Failed to delete inventory record");
    }
  };

  // Columns for the inventory table with sorting and filtering
  const columns = [
    {
      title: "Product",
      key: "product",
      render: (record) => (
        <div className="flex items-center">
          {record.product &&
          record.product.images &&
          record.product.images.length > 0 ? (
            <img
              src={record.product.images[0].url}
              alt={record.product.images[0].altText || "Product Image"}
              className="w-10 h-10 object-cover mr-4"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 mr-4 flex items-center justify-center">
              N/A
            </div>
          )}
          <span>{record.product?.name || "Unnamed Product"}</span>
        </div>
      ),
    },
    {
      title: "Variants",
      key: "variants",
      render: (record) => {
        const variant = record.product.variants?.[0] || {}; // Get the first variant
        const size = variant.size?.name || "N/A"; // Fetch populated size name
        const color = variant.color?.name || "N/A"; // Fetch populated color name

        return (
          <span>
            {`Size: ${size}`}
            <br />
            {`Color: ${color}`}
          </span>
        );
      },
    },
    {
      title: "Movement Type",
      dataIndex: "movementType",
      key: "movementType",
      filters: [
        { text: "in", value: "in" },
        { text: "out", value: "out" },
      ],
      onFilter: (value, record) => record.movementType.includes(value),
      sorter: (a, b) => a.movementType.localeCompare(b.movementType),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Previous Quantity",
      dataIndex: "previousQuantity",
      key: "previousQuantity",
      sorter: (a, b) => a.previousQuantity - b.previousQuantity,
    },
    {
      title: "Warehouse",
      dataIndex: ["warehouse", "name"],
      key: "warehouse",
      filters: inventoryRecords.map((record) => ({
        text: record.warehouse?.name || "N/A",
        value: record.warehouse?.name || "N/A",
      })),
      onFilter: (value, record) => (record.warehouse?.name || "N/A") === value,
      sorter: (a, b) =>
        (a.warehouse?.name || "N/A").localeCompare(b.warehouse?.name || "N/A"),
      render: (text) => text || "N/A",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleEdit(record)} // Open modal with selected record for editing
          >
            <PencilSquareIcon class="h-5 w-5 text-blue-500" />
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this inventory record?"
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
      <div className="dark:bg-gray-900">
        {/* Inventory Management Modal */}
        <Button
          className="bg-blue-500 text-white mb-5"
          onClick={() => {
            setIsModalVisible(true);
            setCurrentRecord(null); // Reset currentRecord for new addition
          }}
        >
          Add Inventory
        </Button>

        <Modal
          title={currentRecord ? "Edit Inventory" : "Add Inventory"}
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setCurrentRecord(null); // Reset currentRecord after modal close
          }}
          footer={null}
        >
          <InventoryForm
            fetchInventoryRecords={fetchInventoryRecords}
            setIsModalVisible={setIsModalVisible}
            currentRecord={currentRecord} // Pass currentRecord to form for editing
            setCurrentRecord={setCurrentRecord} // Allow resetting after form submission
          />
        </Modal>

        {/* Inventory Table */}
        <Table
          columns={columns}
          dataSource={inventoryRecords}
          rowKey="_id"
          loading={loading}
          className="mt-4 dark-table"
          pagination={{
            pageSize: 5,
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default InventoryList;
