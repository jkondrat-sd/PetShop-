import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Form, Input, Button, Select, InputNumber, Upload, 
  Card, message, Row, Col, Typography, Space
} from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getBreeds } from '../../../services/petService';
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
      message.error('Không thể tải danh sách giống thú cưng');
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ có thể tải lên file ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
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
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const onFinish = async (values) => {
    if (!thumbnailFile) {
      message.error('Vui lòng tải lên ảnh đại diện');
      return;
    }

    try {
      // Chuẩn bị dữ liệu thú cưng theo đúng format backend
      const petData = {
        petName: values.petName,
        type: values.type,
        breedId: values.breedId,
        gender: values.gender,
        unitPrice: values.unitPrice,
        age: values.age,
        status: values.status || 'available'
      };

      // Chuẩn bị files
      const imageFiles = imageList.map(file => file.originFileObj).filter(Boolean);

      await dispatch(createNewPet(petData, thumbnailFile, imageFiles));
      message.success('Tạo thú cưng mới thành công');
      navigate('/admin/pets');
    } catch (error) {
      console.error("Error creating pet:", error);
      message.error('Lỗi khi tạo thú cưng mới: ' + error.message);
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
            Quay lại
          </Button>
          <Title level={2} className="page-title">Thêm thú cưng mới</Title>
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
                label="Tên thú cưng"
                rules={[{ required: true, message: 'Vui lòng nhập tên thú cưng' }]}
              >
                <Input placeholder="Nhập tên thú cưng" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="unitPrice"
                label="Giá bán (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Nhập giá bán"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Loại thú cưng"
                rules={[{ required: true, message: 'Vui lòng chọn loại thú cưng' }]}
              >
                <Select placeholder="Chọn loại thú cưng">
                  <Option value="DOG">Chó</Option>
                  <Option value="CAT">Mèo</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="breedId"
                label="Giống"
                rules={[{ required: true, message: 'Vui lòng chọn giống thú cưng' }]}
              >
                <Select placeholder="Chọn giống thú cưng">
                  {breeds.map(breed => (
                    <Option key={breed.id} value={breed.id}>{breed.breedName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="gender"
                label="Giới tính"
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="MALE">Đực</Option>
                  <Option value="FEMALE">Cái</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="Tuổi (tháng)"
              >
                <InputNumber 
                  min={0} 
                  max={240} 
                  style={{ width: '100%' }} 
                  placeholder="Nhập tuổi"
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
              >
                <Select>
                  <Option value="available">Có sẵn</Option>
                  <Option value="reserved">Đã đặt</Option>
                  <Option value="sold">Đã bán</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item 
                label="Ảnh đại diện"
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
              <Form.Item label="Hình ảnh chi tiết">
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
                Tạo mới
              </Button>
              <Button onClick={() => navigate('/admin/pets')}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePet;