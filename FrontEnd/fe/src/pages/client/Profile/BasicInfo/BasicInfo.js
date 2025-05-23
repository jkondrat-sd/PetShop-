import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Card, Upload, message, Typography, 
  Row, Col, Space, Divider, Avatar
} from 'antd';
import { 
  UserOutlined, UploadOutlined, SaveOutlined, 
  MailOutlined, PhoneOutlined, HomeOutlined, EditOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo, uploadAvatar } from '../../../../services/authService';
import { updateUserData } from '../../../../redux/actions/login';
import './BasicInfo.scss';

const { Title, Text } = Typography;

const BasicInfo = ({ avatar, setAvatar }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.loginReducer);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    // Reset form với thông tin người dùng hiện tại khi component mount
    if (userData) {
      form.setFieldsValue({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    }
  }, [userData, form]);
  
  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditing(false);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      const updateData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        address: values.address
      };
      
      const response = await updateUserInfo(updateData);
      
      if (response && response.success) {
        message.success('Thông tin cá nhân đã được cập nhật');
        
        // Cập nhật thông tin người dùng trong Redux
        dispatch(updateUserData({
          ...userData,
          ...updateData
        }));
        
        setEditing(false);
      } else {
        message.error(response?.message || 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error('Update user info error:', error);
      message.error('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      try {
        const formData = new FormData();
        formData.append('file', info.file.originFileObj);
        
        const response = await uploadAvatar(formData);
        
        if (response && response.success) {
          setAvatar(response.data.avatarUrl);
          
          // Cập nhật thông tin người dùng trong Redux
          dispatch(updateUserData({
            ...userData,
            avatarUrl: response.data.avatarUrl
          }));
          
          message.success('Ảnh đại diện đã được cập nhật');
        } else {
          message.error(response?.message || 'Không thể tải lên ảnh đại diện');
        }
      } catch (error) {
        console.error('Upload avatar error:', error);
        message.error('Có lỗi xảy ra khi tải lên ảnh đại diện');
      } finally {
        setUploadLoading(false);
      }
    }
    
    if (info.file.status === 'error') {
      setUploadLoading(false);
      message.error('Tải lên ảnh đại diện thất bại');
    }
  };

  // Kiểm tra xem tệp là ảnh và kích thước phù hợp
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên file ảnh!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
      return Upload.LIST_IGNORE;
    }
    
    return true;
  };

  return (
    <div className="basic-info-container animate__animated animate__fadeIn">
      <Card className="info-card">
        <div className="info-header">
          <Title level={4}>Thông tin cá nhân</Title>
          {!editing ? (
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={form.submit}
                loading={loading}
              >
                Lưu thay đổi
              </Button>
            </Space>
          )}
        </div>
        
        <Divider />
        
        <div className="user-info-section">
          <div className="avatar-section">
            <Avatar
              src={avatar || userData?.avatarUrl}
              icon={!avatar && !userData?.avatarUrl && <UserOutlined />}
              size={120}
              className="user-avatar-large"
            />
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
              onChange={handleAvatarUpload}
            >
              <Button 
                icon={<UploadOutlined />} 
                loading={uploadLoading}
                className="upload-button"
              >
                Thay đổi ảnh
              </Button>
            </Upload>
            <Text type="secondary" className="upload-hint">
              Hỗ trợ JPG, PNG. Tối đa 2MB
            </Text>
          </div>
          
          <div className="user-details">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={!editing}
              className="info-form"
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="firstName"
                    label="Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                  >
                    <Input 
                      prefix={<UserOutlined className="site-form-item-icon" />} 
                      placeholder="Tên" 
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Họ"
                    rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                  >
                    <Input 
                      prefix={<UserOutlined className="site-form-item-icon" />} 
                      placeholder="Họ" 
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="email"
                label="Email"
              >
                <Input 
                  prefix={<MailOutlined className="site-form-item-icon" />} 
                  disabled 
                />
              </Form.Item>
              
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { 
                    pattern: /^[0-9]{10,11}$/, 
                    message: 'Số điện thoại không hợp lệ!' 
                  }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined className="site-form-item-icon" />} 
                  placeholder="Số điện thoại" 
                />
              </Form.Item>
              
              <Form.Item
                name="address"
                label="Địa chỉ"
              >
                <Input.TextArea 
                  prefix={<HomeOutlined className="site-form-item-icon" />} 
                  placeholder="Địa chỉ" 
                  rows={3}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BasicInfo;