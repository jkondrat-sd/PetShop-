import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, Upload, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import * as accessoryService from '~/services/accessoryService';

const AccessoryForm = ({ initialValues = {}, categories = [], onFinish, loading }) => {
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialValues.thumbnail || null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    // Khi initialValues thay đổi (edit), set lại preview thumbnail và images
    if (initialValues.thumbnail) {
      setThumbnailPreview(initialValues.thumbnail);
    }
    if (Array.isArray(initialValues.images) && initialValues.images.length > 0) {
      setImageList(
        initialValues.images.map((url, idx) => ({
          uid: `img-${idx}`,
          name: `image-${idx}`,
          status: 'done',
          url: url,
          thumbUrl: url,
        }))
      );
    }
  }, [initialValues]);

  const handleThumbnailChange = (info) => {
    const { file } = info;
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = ({ fileList }) => {
    setImageList(fileList);
    // Lưu file mới để upload
    setImageFiles(fileList.filter(f => f.originFileObj).map(f => f.originFileObj));
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleSubmit = async (values) => {
    try {
      // First create/update accessory
      const accessory = await onFinish(values);
      // Upload thumbnail nếu có file mới
      if (thumbnailFile) {
        await accessoryService.uploadAccessoryThumbnail(accessory.accessoryId, thumbnailFile);
      }
      // Upload images nếu có file mới
      if (imageFiles.length > 0) {
        await accessoryService.uploadAccessoryImages(accessory.accessoryId, imageFiles);
      }
      message.success('Accessory saved successfully');
    } catch (error) {
      message.error('Failed to save accessory');
    }
  };

  return (
    <Form
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Accessory Name"
        name="accessoryName"
        rules={[{ required: true, message: 'Please enter accessory name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        label="Category"
        name="categoryId"
        rules={[{ required: true, message: 'Please select category' }]}
      >
        <Select>
          {categories.map(cat => (
            <Select.Option key={cat.id} value={String(cat.id)}>{cat.categoryName}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Unit Price"
        name="unitPrice"
        rules={[{ required: true, message: 'Please enter price' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="Stock Quantity"
        name="stockQuantity"
        rules={[{ required: true, message: 'Please enter stock quantity' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Thumbnail">
        <Upload
          name="thumbnail"
          listType="picture-card"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleThumbnailChange}
          className="thumbnail-upload"
        >
          {thumbnailPreview ? (
            <img
              src={thumbnailPreview}
              alt="thumbnail"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </Form.Item>
      <Form.Item label="Images">
        <Upload
          name="images"
          listType="picture-card"
          fileList={imageList}
          beforeUpload={() => false}
          onChange={handleImagesChange}
          multiple
          className="images-upload"
        >
          {imageList.length >= 8 ? null : uploadButton}
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AccessoryForm;
