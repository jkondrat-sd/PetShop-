import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPetById } from '../../../redux/actions/petActions';
import { Descriptions, Image, Spin, Card, Typography, Tag, Button, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPet, loading } = useSelector(state => state.pet);

  useEffect(() => {
    dispatch(fetchPetById(id));
  }, [dispatch, id]);

  const getTypeDisplay = (type) => {
    const typeMap = {
      'DOG': 'Chó',
      'CAT': 'Mèo'
    };
    return typeMap[type] || type;
  };

  const getGenderDisplay = (gender) => {
    const genderMap = {
      'MALE': 'Đực',
      'FEMALE': 'Cái'
    };
    return genderMap[gender] || gender;
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'available': 'Còn hàng',
      'out_of_stock': 'Hết hàng',
      'LOW_STOCK': 'Sắp hết hàng'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'available': 'green',
      'out_of_stock': 'red',
      'LOW_STOCK': 'orange'
    };
    return colorMap[status] || 'default';
  };

  if (loading || !currentPet) return <Spin size="large" className="page-loading" />;

  return (
    <div className="pet-details-page animate__animated animate__fadeIn">
      <Card 
        bordered={false} 
        className="details-card"
        title={
          <div className="page-header">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/admin/pets')}
              className="back-button"
            >
              Quay lại
            </Button>
            <Title level={2} className="page-title">
              Chi tiết thú cưng
            </Title>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/pets/edit/${id}`)}
              className="edit-button"
            >
              Chỉnh sửa
            </Button>
          </div>
        }
      >
        <div className="pet-images-section">
          <div className="thumbnail">
            <Image 
              src={currentPet.thumbnail || '/images/no-image.png'} 
              alt={currentPet.petName}
              className="thumbnail-image"
            />
          </div>
          <div className="image-gallery">
            {currentPet.images && currentPet.images.map((img, idx) => (
              <Image 
                key={idx} 
                src={img} 
                className="gallery-image"
              />
            ))}
          </div>
        </div>

        <Descriptions bordered className="pet-descriptions">
          <Descriptions.Item label="ID" span={1}>{currentPet.petId}</Descriptions.Item>
          <Descriptions.Item label="Tên thú cưng" span={2}>{currentPet.petName}</Descriptions.Item>
          
          <Descriptions.Item label="Loại" span={1}>
            <Tag color={currentPet.type === 'DOG' ? 'blue' : 'purple'}>
              {getTypeDisplay(currentPet.type)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Giống" span={2}>{currentPet.breed}</Descriptions.Item>
          
          <Descriptions.Item label="Giới tính" span={1}>{getGenderDisplay(currentPet.gender)}</Descriptions.Item>
          <Descriptions.Item label="Tuổi" span={2}>{currentPet.age} tuổi</Descriptions.Item>
          
          <Descriptions.Item label="Giá" span={1}>
            {currentPet.unitPrice?.toLocaleString('vi-VN')}₫
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái" span={2}>
            <Tag color={getStatusColor(currentPet.status)}>
              {getStatusDisplay(currentPet.status)}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày tạo" span={1}>
            {new Date(currentPet.createdAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối" span={2}>
            {new Date(currentPet.updatedAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default PetDetails;