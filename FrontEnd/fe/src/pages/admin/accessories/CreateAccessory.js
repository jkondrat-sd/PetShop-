import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import AccessoryForm from '~/components/forms/AccessoryForm';
import * as accessoryService from '~/services/accessoryService';

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
    <div>
      <h2>Create New Accessory</h2>
      <AccessoryForm
        categories={categories}
        onFinish={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default CreateAccessory;
