import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spin, Space, Tag, Modal, message, Select } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './OrderList.scss';
import { fetchOrders } from '~/redux/actions/orderActions';
import * as orderService from '~/services/orderService';
import dayjs from 'dayjs';

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, pagination } = useSelector(state => state.order);

  // Thêm state cho modal update status
  const [statusModal, setStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this order?',
      onOk: async () => {
        // await orderService.deleteOrder(id);
        message.success('Order deleted successfully');
        // dispatch(fetchOrders());
      },
    });
  };

  // Sửa lại hàm này để mở modal
  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusModal(true);
  };

  const handleConfirmUpdateStatus = async () => {
    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      message.success('Order status updated!');
      setStatusModal(false);
      setSelectedOrder(null);
      dispatch(fetchOrders());
    } catch (err) {
      message.error('Failed to update status');
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_, __, index) => (pagination.page || 0) * (pagination.size || 10) + index + 1
    },
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'userName', key: 'userName' },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm:ss') : '',
    },
    { title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount', render: (v) => `$${v}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'pending' ? 'blue' : status === 'cancelled' ? 'red' : 'green'}>{status}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/admin/orders/${record.id}`)}>Details</Button>
          <Button icon={<EditOutlined />} onClick={() => handleUpdateStatus(record)}>Update Status</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="order-list-page animate__animated animate__fadeIn">
      <h2 className="order-list-title">Order Management</h2>
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
            dispatch(fetchOrders({
              page: paginationConfig.current - 1,
              size: paginationConfig.pageSize,
            }));
          }}
        />
      </Spin>
      <Modal
        title="Update Order Status"
        open={statusModal}
        onOk={handleConfirmUpdateStatus}
        onCancel={() => setStatusModal(false)}
        okText="Update"
        okButtonProps={{ disabled: !newStatus || (selectedOrder && newStatus === selectedOrder.status) }}
      >
        <Select
          style={{ width: '100%' }}
          value={newStatus}
          onChange={setNewStatus}
          placeholder="Select new status"
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="paid">Paid</Select.Option>
          <Select.Option value="processing">Processing</Select.Option>
          <Select.Option value="shipped">Shipped</Select.Option>
          <Select.Option value="delivered">Delivered</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
        </Select>
      </Modal>
    </div>
  );
};

export default OrderList;
