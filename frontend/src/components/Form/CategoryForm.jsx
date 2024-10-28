import React, { useState, useEffect } from "react";
import { Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";

const CategoryForm = ({
  handleSubmit,
  value,
  setValue,
  description,
  setDescription,
  image,
  setImage,
}) => {
  const [preview, setPreview] = useState(null);
  const [selected, setSelected] = useState(null);

  // useEffect(() => {
  //   if (image) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreview(reader.result);
  //     };
  //     reader.readAsDataURL(image);
  //   } else {
  //     setPreview(null);
  //   }
  // }, [image]);

  // Handle image preview
  const handlePreview = async (file) => {
    let src = file.url;
    if (!src && file.originFileObj) {
      // Ensure originFileObj is used for the file content
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj); // Read the file as DataURL
        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Category Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Category Name
        </label>
        <Input
          placeholder="Enter category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mb-2"
        />
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Description</label>
        <Input.TextArea
          placeholder="Enter category description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mb-2"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Category Image
        </label>
        <ImgCrop rotationSlider>
          <Upload
            listType="picture-card"
            beforeUpload={() => false} // Prevent automatic upload
            onChange={({ file }) => setImage(file)}
            onRemove={({file}) => setImage(null)}
            onPreview={handlePreview}
          >
            Upload Image
          </Upload>
        </ImgCrop>
        {/* Image Preview
        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )} */}
      </div>

      {/* Submit Button */}
      <Button type="primary" htmlType="submit" className="mt-3">
        {selected ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
};

export default CategoryForm;
