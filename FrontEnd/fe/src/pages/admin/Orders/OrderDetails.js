import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Spin, Table, Tag, Alert, Button, Modal, Select, message } from 'antd';
import * as orderService from '~/services/orderService';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  console.log('OrderDetails component mounted');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await orderService.getOrderById(id);
        console.log('Raw response:', response);
        const orderData = response?.data || response;
        console.log('Order detail response:', orderData);
        setOrder(orderData);
      } catch (err) {
        setError('Order not found or API error');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      await orderService.updateOrderStatus(id, newStatus);
      message.success('Order status updated!');
      setStatusModal(false);
      // Reload order
      const response = await orderService.getOrderById(id);
      const orderData = response?.data || response;
      setOrder(orderData);
    } catch (err) {
      message.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;
  if (!order) {
    console.log('Order is null');
    return <Alert type="info" message="No order data" />;
  }

  return (
    <div className="order-details-page animate__animated animate__fadeIn">
      <Button
        type="default"
        onClick={() => navigate('/admin/orders/list')}
        style={{ marginBottom: 16 }}
      >
        ← Back to Order List
      </Button>
      <Descriptions title="Order Details" bordered>
        <Descriptions.Item label="Order ID">{order.id ?? ''}</Descriptions.Item>
        <Descriptions.Item label="Customer">{order.userName || ''}</Descriptions.Item>
        <Descriptions.Item label="Order Date">{order.orderDate || ''}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag>{order.status || ''}</Tag>
          <Button size="small" style={{ marginLeft: 8 }} onClick={() => {
            setNewStatus(order.status);
            setStatusModal(true);
          }}>
            Update Status
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="Total">${order.totalAmount ?? 0}</Descriptions.Item>
        <Descriptions.Item label="Shipping">{order.shipAddress || ''}</Descriptions.Item>
      </Descriptions>
      <h3>Order Items</h3>
      <Table
        dataSource={Array.isArray(order.orderDetails) ? order.orderDetails : []}
        rowKey="id"
        columns={[
          { title: 'Name', dataIndex: 'name', key: 'name', render: v => v || '' },
          { title: 'Type', dataIndex: 'itemType', key: 'itemType', render: v => v || '' },
          { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', render: v => v ?? 0 },
          { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', render: v => `$${v ?? 0}` },
          { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal', render: v => `$${v ?? 0}` },
          {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (v, record) => v ? <img src={v} alt={record.name || ''} style={{ width: 40 }} /> : <span>No image</span>
          }
        ]}
        pagination={false}
      />

      <Modal
        title="Update Order Status"
        open={statusModal}
        onOk={handleUpdateStatus}
        onCancel={() => setStatusModal(false)}
        okText="Update"
        okButtonProps={{ disabled: !newStatus || newStatus === order.status }}
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

export default OrderDetails;
