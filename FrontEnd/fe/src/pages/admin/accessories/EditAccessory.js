import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import AccessoryForm from '~/components/forms/AccessoryForm';
import * as accessoryService from '~/services/accessoryService';

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
        setInitialValues(accessoryResponse);
      } catch (error) {
        message.error('Failed to load data');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await accessoryService.updateAccessory(id, values);
      message.success('Accessory updated successfully');
      navigate('/admin/accessories');
    } catch (error) {
      message.error(error.message || 'Failed to update accessory');
    } finally {
      setLoading(false);
    }
  };

  if (!initialValues) return null;

  return (
    <div>
      <h2>Edit Accessory</h2>
      <AccessoryForm
        initialValues={initialValues}
        categories={categories}
        onFinish={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default EditAccessory;
