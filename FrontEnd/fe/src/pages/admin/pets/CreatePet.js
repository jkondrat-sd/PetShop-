import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Form, Input, Button, Select, InputNumber, Upload, 
  Card, message, Row, Col, Typography, Space
} from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getBreeds } from '../../../services/breedService';
import { createNewPet } from '../../../redux/actions/petActions';
import './CreatePet.scss';
import 'animate.css';

const { Option } = Select;
const { Title } = Typography;

const CreatePet = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const petState = useSelector(state => state.pet) || {};
  const { operationLoading = false } = petState;
  
  const [breeds, setBreeds] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await getBreeds();
      if (response?.content) {
        setBreeds(response.content);
      } else if (Array.isArray(response)) {
        setBreeds(response);
      }
    } catch (error) {
      console.error("Failed to fetch breeds:", error);
      message.error('Unable to load breed list');
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image size must be smaller than 5MB!');
      return false;
    }
    return false; // Prevent auto upload
  };

  const handleThumbnailChange = (info) => {
    const { file } = info;
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = ({ fileList }) => {
    setImageList(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFinish = async (values) => {
    if (!thumbnailFile) {
      message.error('Please upload a thumbnail image');
      return;
    }

    try {
      // Prepare pet data according to backend format
      const petData = {
        petName: values.petName,
        type: values.type,
        breedId: values.breedId,
        gender: values.gender,
        unitPrice: values.unitPrice,
        age: values.age,
        status: values.status || 'available'
      };

      // Prepare files
      const imageFiles = imageList.map(file => file.originFileObj).filter(Boolean);

      await dispatch(createNewPet(petData, thumbnailFile, imageFiles));
      message.success('Pet created successfully');
      navigate('/admin/pets');
    } catch (error) {
      console.error("Error creating pet:", error);
      message.error('Error creating new pet: ' + error.message);
    }
  };

  return (
    <div className="create-pet-page animate__animated animate__fadeIn">
      <div className="page-header">
        <div className="header-left">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/pets')}
            className="back-button"
          >
            Back
          </Button>
          <Title level={2} className="page-title">Add New Pet</Title>
        </div>
      </div>

      <Card className="form-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'available',
            age: 1
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="petName"
                label="Pet Name"
                rules={[{ required: true, message: 'Please enter pet name' }]}
              >
                <Input placeholder="Enter pet name" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="unitPrice"
                label="Price (VND)"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Enter price"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Pet Type"
                rules={[{ required: true, message: 'Please select pet type' }]}
              >
                <Select placeholder="Select pet type">
                  <Option value="DOG">Dog</Option>
                  <Option value="CAT">Cat</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="breedId"
                label="Breed"
                rules={[{ required: true, message: 'Please select breed' }]}
              >
                <Select placeholder="Select breed">
                  {breeds.map(breed => (
                    <Option key={breed.id} value={breed.id}>{breed.breedName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="gender"
                label="Gender"
              >
                <Select placeholder="Select gender">
                  <Option value="MALE">Male</Option>
                  <Option value="FEMALE">Female</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="Age (months)"
              >
                <InputNumber 
                  min={0} 
                  max={240} 
                  style={{ width: '100%' }} 
                  placeholder="Enter age"
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
              >
                <Select>
                  <Option value="available">Available</Option>
                  <Option value="reserved">Reserved</Option>
                  <Option value="sold">Sold</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item 
                label="Thumbnail Image"
                required
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
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
            </Col>
            
            <Col span={12}>
              <Form.Item label="Detail Images">
                <Upload
                  name="images"
                  listType="picture-card"
                  fileList={imageList}
                  beforeUpload={beforeUpload}
                  onChange={handleImagesChange}
                  multiple
                  className="images-upload"
                >
                  {imageList.length >= 8 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="form-actions">
            <Space>
              <Button type="primary" htmlType="submit" loading={operationLoading}>
                Create
              </Button>
              <Button onClick={() => navigate('/admin/pets')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePet;