import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as accessoryService from '~/services/accessoryService';

const AccessoryForm = ({ initialValues = {}, categories = [], onFinish, loading }) => {
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  const handleSubmit = async (values) => {
    try {
      // First create/update accessory
      const accessory = await onFinish(values);
      
      // Then upload images if any
      if (thumbnailFile) {
        await accessoryService.uploadAccessoryThumbnail(accessory.accessoryId, thumbnailFile);
      }
      
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
        name="id"
        rules={[{ required: true, message: 'Please select category' }]}
      >
        <Select>
          {categories.map(cat => (
            <Select.Option key={cat.id} value={cat.id}>{cat.categoryName}</Select.Option>
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
          beforeUpload={(file) => {
            setThumbnailFile(file);
            return false;
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Images">
        <Upload
          beforeUpload={(file) => {
            setImageFiles([...imageFiles, file]);
            return false;
          }}
          multiple
        >
          <Button icon={<UploadOutlined />}>Upload Images</Button>
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
