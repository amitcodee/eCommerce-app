// React Component: Updated Product Form
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Tabs } from "antd";
import Select from "react-select";
// import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import ImgCrop from "antd-img-crop";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS
const { TabPane } = Tabs;

const ProductForm = ({
  handleSubmit,
  product,
  categories,
  fileList,
  setFileList,
  colors,
  sizes,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState(""); // State for Quill editor
  // Update form fields when the product prop changes
  useEffect(() => {
    if (product) {
      // Set form fields with the new product values
      form.setFieldsValue({
        name: product?.name || "",
        shortDescription: product?.shortDescription || "",
        category: (product?.category || []).map((cat) => ({
          value: cat._id,
          label: cat.name,
        })),
        variants: product?.variants?.map((variant) => ({
          size: { value: variant.size._id, label: variant.size.name },
          color: { value: variant.color._id, label: variant.color.name },
          price: variant.price,
          sellingPrice: variant.sellingPrice,
          costPrice: variant.costPrice,
          quantity: variant.quantity || 1,
        })) || [{}],
        status: product?.status || "active",
        sale: product?.sale || "",
        visibility: product?.visibility || "public",
        minQuantity: product?.minQuantity || 0,
        maxQuantity: product?.maxQuantity || 0,
        shippingClass: product?.shippingClass || "fast",
        dateAvailable: product?.dateAvailable || "",
      });
      setDescription(product?.description || ""); // Set description state with the product description
      // Update fileList for product images
      if (product.images) {
        const formattedFileList = product.images.map((image, index) => ({
          uid: index,
          name: `image-${index}`,
          status: "done",
          url: image.url,
        }));
        setFileList(formattedFileList);
      } else {
        setFileList([]);
      }
    } else {
      // Reset form if there's no product (e.g., for creating a new product)
      form.resetFields();
      setFileList([]);
    }
  }, [product, form, setFileList]);

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const onFinish = (values) => {
    setLoading(true);

    /// Ensure that size and color are mapped properly to ObjectIds
    const updatedValues = {
      ...values,
      variants: (values.variants || []).map((variant) => ({
        ...variant,
        size: variant.size ? variant.size.value : null, // Map ObjectId for size
        color: variant.color ? variant.color.value : null, // Map ObjectId for color
        price: variant.price || 0,
        quantity: variant.quantity || 0,
      })),
      category: (values.category || []).map((c) => c.value), // Map category to ObjectId
    };

    console.log("Updated Values: ", updatedValues);

    // Validate that none of the required fields are empty for variants
    const invalidVariants = updatedValues.variants.some(
      (variant) =>
        !variant.size ||
        !variant.color ||
        !variant.costPrice ||
        !variant.sellingPrice
    );

    if (invalidVariants) {
      toast.error(
        "Please fill in all the variant details including size and color."
      );
      setLoading(false);
      return;
    }

    // Now submit the form data
    handleSubmit(updatedValues)
      .then(() => {
        setLoading(false); // Only set loading false after submission completes
        // toast.success(
        //   product
        //     ? "Product updated successfully!"
        //     : "Product created successfully!"
        // );
      })
      .catch(() => {
        setLoading(false); // Ensure to stop loading on failure
        toast.error("Error occurred while updating the product.");
      });
  };

  const handlePreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <div className="max-w-6xl mx-auto p-4">
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        // initialValues={{
        //   name: product?.name || "",
        //   description: product?.description || "",
        //   shortDescription: product?.shortDescription || "",
        //   category: (product?.category || []).map((cat) => ({
        //     value: cat._id,
        //     label: cat.name,
        //   })),
        //   variants: product?.variants?.map((variant) => ({
        //     size: { value: variant.size._id, label: variant.size.name },
        //     color: { value: variant.color._id, label: variant.color.name },
        //     price: variant.price,
        //     costPrice: variant.costPrice ,
        //     quantity: variant.quantity || 1,
        //   })) || [{}],
        //   status: product?.status || "active",
        //   visibility: product?.visibility || "public",
        //   minQuantity: product?.minQuantity || 0,
        //   maxQuantity: product?.maxQuantity || 0,
        //   shippingClass: product?.shippingClass || "fast",
        //   dateAvailable: product?.dateAvailable || "",
        // }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Basic Info" key="1">
            <div className="grid gap-4 grid-cols-2">
              <Form.Item
                label="Product Name"
                name="name"
                rules={[
                  { required: true, message: "Please input the product name!" },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Select
                  placeholder="Select Categories"
                  isMulti
                  options={categories.map((category) => ({
                    label: category.name,
                    value: category._id,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Short Description" name="shortDescription">
                <Input.TextArea
                  rows={1}
                  placeholder="Enter a short description"
                />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  placeholder="Enter product description"
                />
              </Form.Item>
            </div>
          </TabPane>

          <TabPane tab="Variants" key="2">
            <div className="grid gap-4 grid-cols-2">
              <Form.List name="variants">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key} className="variant-fields">
                        <h4>Variant {index + 1}</h4>

                        <Form.Item
                          label="Size"
                          name={[field.name, "size"]}
                          rules={[
                            {
                              required: true,
                              message: "Please select a size!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select Size"
                            options={sizes.map((size) => ({
                              label: size.name,
                              value: size._id,
                            }))}
                          />
                        </Form.Item>

                        <Form.Item
                          label="Color"
                          name={[field.name, "color"]}
                          rules={[
                            {
                              required: true,
                              message: "Please select a color!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select Color"
                            options={colors.map((color) => ({
                              label: color.name,
                              value: color._id,
                            }))}
                          />
                        </Form.Item>

                        <Form.Item label="Buying Price" name={[field.name, "price"]}>
                          <Input
                            type="number"
                            placeholder="Enter price"
                            disabled
                            value={0}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Selling Price"
                          name={[field.name, "sellingPrice"]}
                        >
                          <Input
                            type="number"
                            placeholder="Enter selling price"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Cost Price"
                          name={[field.name, "costPrice"]}
                          rules={[
                            {
                              required: true,
                              message: "Please input cost price!",
                            },
                          ]}
                        >
                          <Input type="number" placeholder="Enter price" />
                        </Form.Item>

                        <Form.Item
                          label="Quantity"
                          name={[field.name, "quantity"]}
                        >
                          <Input
                            type="number"
                            placeholder="Enter quantity"
                            disabled
                            value={0}
                          />
                        </Form.Item>

                        <Button
                          type="danger"
                          onClick={() => remove(field.name)}
                        >
                          Remove Variant
                        </Button>
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => add()}>
                      Add Variant
                    </Button>
                  </>
                )}
              </Form.List>
            </div>
          </TabPane>

          <TabPane tab="Additional" key="3">
            <Form.Item label="Sale Status" name="sale">
              <Input placeholder="Sale Status (e.g Sale, New, Clearence etc)" />
            </Form.Item>
          </TabPane>

          <TabPane tab="Images" key="4">
            <Form.Item label="Upload Images">
              <ImgCrop rotationSlider>
                <Upload
                  multiple
                  fileList={fileList}
                  onChange={handleImageChange}
                  onPreview={handlePreview}
                  beforeUpload={() => false} // Prevent automatic upload
                  listType="picture-card"
                >
                  {fileList.length < 5 && "+ Upload"}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </TabPane>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button type="primary" htmlType="submit" loading={loading}>
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;
