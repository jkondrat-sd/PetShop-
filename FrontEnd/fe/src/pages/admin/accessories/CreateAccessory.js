import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message, Card, Typography, Button } from 'antd';
import AccessoryForm from '~/components/forms/AccessoryForm';
import * as accessoryService from '~/services/accessoryService';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CreateAccessory = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories for the form
    const fetchCategories = async () => {
      try {
        const response = await accessoryService.getAccessoryCategories();
        setCategories(response.content || []);
      } catch (error) {
        message.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await accessoryService.createAccessory(values);
      message.success('Accessory created successfully');
      navigate('/admin/accessories');
    } catch (error) {
      message.error(error.message || 'Failed to create accessory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-accessory-page animate__animated animate__fadeIn">
      <div className="page-header">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/accessories')} className="back-button">
          Back
        </Button>
        <Title level={2} className="page-title">Add New Accessory</Title>
      </div>
      <Card className="form-card">
        <AccessoryForm
          categories={categories}
          onFinish={handleSubmit}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default CreateAccessory;
