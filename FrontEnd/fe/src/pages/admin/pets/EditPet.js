import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Form, Input, Button, Select, InputNumber, Upload, 
  Card, message, Spin, Row, Col, Typography, Space
} from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getBreeds } from '../../../services/petService';
import { fetchPetById, updateExistingPet } from '../../../redux/actions/petActions';
import './EditPet.scss';
import 'animate.css';

const { Option } = Select;
const { Title } = Typography;

const EditPet = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { currentPet, loading, operationLoading } = useSelector(state => state.pet);
  
  const [breeds, setBreeds] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchPetById(id));
    }
    fetchBreeds();
  }, [id, dispatch]);

  useEffect(() => {
    if (currentPet) {
      // Set form values
      form.setFieldsValue({
        petName: currentPet.petName,
        type: currentPet.type,
        breedId: currentPet.breedId,
        gender: currentPet.gender,
        unitPrice: currentPet.unitPrice,
        age: currentPet.age,
        status: currentPet.status
      });

      // Set thumbnail preview
      if (currentPet.thumbnail) {
        setThumbnailPreview(currentPet.thumbnail);
      }

      // Set images
      if (currentPet.images && currentPet.images.length > 0) {
        const imageFileList = currentPet.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: url,
          thumbUrl: url,
        }));
        setImageList(imageFileList);
      }
    }
  }, [currentPet, form]);

  const fetchBreeds = async () => {
    try {
      const response = await getBreeds();
      if (response && response.success && response.data) {
        if (response.data.content) {
          setBreeds(response.data.content);
        } else if (Array.isArray(response.data)) {
          setBreeds(response.data);
        }
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
    try {
      // Chuẩn bị dữ liệu thú cưng
      const petData = {
        petName: values.petName,
        type: values.type,
        breedId: values.breedId,
        gender: values.gender,
        unitPrice: values.unitPrice,
        age: values.age,
        status: values.status
      };

      // Chuẩn bị files (chỉ khi có file mới)
      const imageFiles = imageList
        .filter(file => file.originFileObj)
        .map(file => file.originFileObj);

      await dispatch(updateExistingPet(id, petData, thumbnailFile, imageFiles));
      message.success('Cập nhật thú cưng thành công');
      navigate('/admin/pets');
    } catch (error) {
      console.error("Error updating pet:", error);
      message.error('Lỗi khi cập nhật thú cưng: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!currentPet) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="edit-pet-page animate__animated animate__fadeIn">
      <div className="page-header">
        <div className="header-left">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/pets')}
            className="back-button"
          >
            Quay lại
          </Button>
          <Title level={2} className="page-title">Chỉnh sửa thú cưng</Title>
        </div>
      </div>

      <Card className="form-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Tên thú cưng" name="petName">
                <Input disabled />
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
              <Form.Item label="Loại thú cưng" name="type">
                <Select disabled>
                  <Option value="DOG">Chó</Option>
                  <Option value="CAT">Mèo</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giống" name="breedId">
                <Select disabled>
                  {breeds.map(breed => (
                    <Option key={breed.id} value={breed.id}>{breed.breedName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giới tính" name="gender">
                <Select disabled>
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
              <Form.Item label="Trạng thái" name="status">
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
              <Form.Item label="Ảnh đại diện">
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
                Cập nhật
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

export default EditPet;