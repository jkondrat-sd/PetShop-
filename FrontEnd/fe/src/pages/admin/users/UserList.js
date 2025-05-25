import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spin, Tag, Space, Modal, message } from 'antd';
import { EyeOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { fetchUsers } from '~/redux/actions/userActions';
import * as usersService from '~/services/usersService';
import { useNavigate } from 'react-router-dom';
import './UserList.scss';

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, pagination } = useSelector(state => state.user);
  const [blockLoading, setBlockLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleBlock = async (user) => {
    Modal.confirm({
      title: user.enabled ? 'Block this user?' : 'Unblock this user?',
      onOk: async () => {
        setBlockLoading(true);
        try {
          await usersService.toggleUserStatus(user.id, user.enabled ? 'block' : 'unblock');
          message.success(user.enabled ? 'User blocked' : 'User unblocked');
          dispatch(fetchUsers({ page: pagination.page, size: pagination.size }));
        } catch (err) {
          message.error('Failed to update user status');
        } finally {
          setBlockLoading(false);
        }
      }
    });
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_, __, index) => (pagination.page || 0) * (pagination.size || 10) + index + 1
    },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Full Name', key: 'fullName', render: (_, record) => `${record.firstName || ''} ${record.lastName || ''}` },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: v => <Tag color={v === 'ROLE_ADMIN' ? 'red' : 'blue'}>{v}</Tag> },
    { title: 'Status', dataIndex: 'enabled', key: 'enabled', render: v => v ? <Tag color="green">Active</Tag> : <Tag color="red">Blocked</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/admin/users/${record.id}`)}>Details</Button>
          <Button
            icon={record.enabled ? <StopOutlined /> : <CheckCircleOutlined />}
            danger={record.enabled}
            loading={blockLoading}
            onClick={() => handleBlock(record)}
          >
            {record.enabled ? 'Block' : 'Unblock'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-list-page animate__animated animate__fadeIn">
      <h2 className="user-list-title">User Management</h2>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={list}
          rowKey="id"
          pagination={{
            current: (pagination.page || 0) + 1,
            pageSize: pagination.size || 10,
            total: pagination.totalElements || 0,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          onChange={(paginationConfig) => {
            dispatch(fetchUsers({
              page: paginationConfig.current - 1,
              size: paginationConfig.pageSize,
            }));
          }}
        />
      </Spin>
    </div>
  );
};

export default UserList;