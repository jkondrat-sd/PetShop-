import React from 'react';
import { Tag } from 'antd';

const statusMappings = {
  // Trạng thái đơn hàng
  PENDING: { color: 'blue', text: 'Đang xử lý' },
  CONFIRMED: { color: 'cyan', text: 'Đã xác nhận' },
  SHIPPING: { color: 'purple', text: 'Đang giao hàng' },
  COMPLETED: { color: 'green', text: 'Hoàn thành' },
  CANCELLED: { color: 'red', text: 'Đã hủy' },
  
  // Trạng thái sản phẩm
  IN_STOCK: { color: 'green', text: 'Còn hàng' },
  OUT_OF_STOCK: { color: 'red', text: 'Hết hàng' },
  LOW_STOCK: { color: 'orange', text: 'Sắp hết hàng' },
  
  // Trạng thái người dùng
  ACTIVE: { color: 'green', text: 'Hoạt động' },
  INACTIVE: { color: 'red', text: 'Đã khóa' },
  
  // Trạng thái khác
  PUBLISHED: { color: 'green', text: 'Đã xuất bản' },
  DRAFT: { color: 'orange', text: 'Nháp' }
};

const StatusTag = ({ status, customMapping }) => {
  const mapping = customMapping || statusMappings;
  const statusInfo = mapping[status] || { color: 'default', text: status };
  
  return (
    <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
  );
};

export default StatusTag;