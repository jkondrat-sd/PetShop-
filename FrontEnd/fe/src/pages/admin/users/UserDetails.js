import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Spin, Alert, Button, Tag } from 'antd';
import * as usersService from '~/services/usersService';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;
  if (!user) return <Alert type="info" message="No user data" />;

  return (
    <div className="user-details-page animate__animated animate__fadeIn">
      <Button type="default" onClick={() => navigate('/admin/users/list')} style={{ marginBottom: 16 }}>
        ← Back to User List
      </Button>
      <Descriptions title="User Details" bordered>
        <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
        <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Full Name">{`${user.firstName || ''} ${user.lastName || ''}`}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
        <Descriptions.Item label="Role"><Tag>{user.role}</Tag></Descriptions.Item>
        <Descriptions.Item label="Status">{user.enabled ? <Tag color="green">Active</Tag> : <Tag color="red">Blocked</Tag>}</Descriptions.Item>
        <Descriptions.Item label="Avatar">
          {user.avatarUrl ? <img src={user.avatarUrl} alt="avatar" style={{ width: 60, borderRadius: 8 }} /> : 'No avatar'}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default UserDetails;