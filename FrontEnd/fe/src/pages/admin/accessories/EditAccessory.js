import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { message, Card, Typography, Button } from 'antd';
import AccessoryForm from '~/components/forms/AccessoryForm';
import * as accessoryService from '~/services/accessoryService';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const EditAccessory = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await accessoryService.getAccessoryCategories();
        setCategories(categoriesResponse.content || []);

        // Fetch accessory details
        const accessoryResponse = await accessoryService.getAccessoryById(id);
        // Đảm bảo initialValues có categoryId là id
        let initial = { ...accessoryResponse };
        if (accessoryResponse.category && accessoryResponse.category.id) {
          initial.categoryId = String(accessoryResponse.category.id);
        } else if (accessoryResponse.categoryId) {
          initial.categoryId = String(accessoryResponse.categoryId);
        }
        setInitialValues(initial);
      } catch (error) {
        message.error('Failed to load data');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const accessory = await accessoryService.updateAccessory(id, values);
      message.success('Accessory updated successfully');
      navigate('/admin/accessories');
      return accessory;
    } catch (error) {
      message.error(error.message || 'Failed to update accessory');
    } finally {
      setLoading(false);
    }
  };

  if (!initialValues) return null;

  return (
    <div className="edit-accessory-page animate__animated animate__fadeIn">
      <div className="page-header">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/accessories')} className="back-button">
          Back
        </Button>
        <Title level={2} className="page-title">Edit Accessory</Title>
      </div>
      <Card className="form-card">
        <AccessoryForm
          initialValues={initialValues}
          categories={categories}
          onFinish={handleSubmit}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default EditAccessory;
