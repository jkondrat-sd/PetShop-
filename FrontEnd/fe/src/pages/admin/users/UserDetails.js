import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Descriptions, Spin, Alert, Button, Tag, Typography, Space, Modal } from 'antd';
import { ArrowLeftOutlined, UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, IdcardOutlined, StopOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as usersService from '~/services/usersService';
import { message } from 'antd';

const { Title, Text } = Typography;

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [blockLoading, setBlockLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await usersService.getUserById(id);
        setUser(response.data || response);
      } catch (err) {
        setError('User not found or API error');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleBlockToggle = () => {
    Modal.confirm({
      title: user.enabled ? 'Block this user?' : 'Unblock this user?',
      icon: <ExclamationCircleOutlined />,
      content: user.enabled
        ? 'Are you sure you want to block this user? They will not be able to log in.'
        : 'Do you want to unblock this user and allow them to log in again?',
      okText: user.enabled ? 'Block' : 'Unblock',
      okType: user.enabled ? 'danger' : 'primary',
      cancelText: 'Cancel',
      onOk: async () => {
        setBlockLoading(true);
        try {
          if (user.enabled) {
            await usersService.blockUser(user.id);
            message.success('User has been blocked');
          } else {
            await usersService.unblockUser(user.id);
            message.success('User has been unblocked');
          }
          // Reload user info
          const response = await usersService.getUserById(user.id);
          setUser(response.data || response);
        } catch (err) {
          message.error('Failed to update user status');
        } finally {
          setBlockLoading(false);
        }
      }
    });
  };

  if (loading) return <Spin style={{ display: 'block', margin: '100px auto' }} />;
  if (error) return <Alert type="error" message={error} style={{ marginTop: 40 }} />;
  if (!user) return <Alert type="info" message="No user data" style={{ marginTop: 40 }} />;

  return (
    <div className="user-details-page" style={{ maxWidth: 700, margin: '40px auto' }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin/users/list')}
        style={{ marginBottom: 24, fontSize: 16 }}
      >
        Back to User List
      </Button>
      <Card bordered style={{ borderRadius: 16, boxShadow: '0 2px 16px #e6e6e6' }} bodyStyle={{ padding: 32 }}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <img
              src={user.avatarUrl || 'https://api.dicebear.com/7.x/miniavs/svg?seed=' + user.username}
              alt="avatar"
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 2px 8px #d9d9d9',
                marginBottom: 16,
                background: '#f5f5f5'
              }}
            />
            <div>
              <Tag color={user.enabled ? 'green' : 'red'} style={{ fontSize: 16, padding: '4px 16px' }}>
                {user.enabled ? 'Active' : 'Blocked'}
              </Tag>
            </div>
            <div style={{ marginTop: 8 }}>
              <Tag color={user.role === 'ROLE_ADMIN' ? 'red' : 'blue'} icon={<IdcardOutlined />}>
                {user.role}
              </Tag>
            </div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type={user.enabled ? 'primary' : 'default'}
                danger={user.enabled}
                icon={user.enabled ? <StopOutlined /> : <CheckCircleOutlined />}
                loading={blockLoading}
                onClick={handleBlockToggle}
                style={{ width: '100%', marginTop: 16 }}
                size="large"
              >
                {user.enabled ? 'Block User' : 'Unblock User'}
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={16}>
            <Title level={3} style={{ marginBottom: 0 }}>
              {user.firstName || ''} {user.lastName || ''}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              @{user.username}
            </Text>
            <Descriptions
              column={1}
              style={{ marginTop: 24 }}
              labelStyle={{ fontWeight: 500, width: 120 }}
              contentStyle={{ fontSize: 16 }}
            >
              <Descriptions.Item label={<span><MailOutlined /> Email</span>}>{user.email}</Descriptions.Item>
              <Descriptions.Item label={<span><PhoneOutlined /> Phone</span>}>{user.phone || <Text type="secondary">N/A</Text>}</Descriptions.Item>
              <Descriptions.Item label={<span><HomeOutlined /> Address</span>}>{user.address || <Text type="secondary">N/A</Text>}</Descriptions.Item>
              <Descriptions.Item label="User ID">{user.id}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UserDetails;