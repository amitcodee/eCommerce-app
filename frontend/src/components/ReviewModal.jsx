import React, { useState } from "react";
import { Modal, Button } from "antd"; // Import Modal and Button from Ant Design
import CreateReviewForm from "../components/Form/ReviewForm"; // Import the review form component

const ReviewModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle OK (or form submission)
  const handleOk = () => {
    setIsModalVisible(false);
  };

  // Handle cancel (closing the modal)
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex justify-center items-center ">
      {/* Button to open the modal */}
      <Button className="w-56 text-lg" onClick={showModal}>
        Write a Review
      </Button>

      {/* Ant Design Modal */}
      <Modal
        title="Create a Review"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} // Remove default footer buttons, so we can control form submission
      >
        {/* Render the review form inside the modal */}
        <CreateReviewForm />
      </Modal>
    </div>
  );
};

export default ReviewModal;
