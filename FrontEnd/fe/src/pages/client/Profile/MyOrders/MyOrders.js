import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Table,
  Pagination,
  Empty,
  Divider,
  Space,
  Tag,
  Modal,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ShoppingOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getUserOrders, cancelOrder } from "../../../../services/orderService";
import "./MyOrders.scss";

const { Title, Text } = Typography;
const { confirm } = Modal;

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log(
        "Fetching orders with page:",
        pagination.current - 1,
        "size:",
        pagination.pageSize
      );
      const response = await getUserOrders(
        pagination.current - 1,
        pagination.pageSize
      );
      console.log("Raw orders response:", response);

      // Parse response structure correctly
      if (response && response.success) {
        if (response.data && response.data.content) {
          setOrders(response.data.content);
          setPagination({
            ...pagination,
            total: response.data.totalElements || 0,
          });
          console.log("Orders set successfully:", response.data.content);
        } else {
          console.warn("Orders API returned success but no content:", response);
          setOrders([]);
        }
      } else {
        console.error("Orders API error:", response?.message);
        message.error(response?.message || "Could not load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handleTableChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };

  // Order status mapping with colors
  const orderStatusMap = {
    pending: {
      text: "Pending",
      color: "blue",
      icon: <ClockCircleOutlined />,
    },
    paid: {
      text: "Paid",
      color: "cyan",
      icon: <FileSearchOutlined />,
    },
    processing: {
      text: "Processing",
      color: "purple",
      icon: <ShoppingOutlined />,
    },
    shipped: {
      text: "Shipped",
      color: "geekblue",
      icon: <ShoppingOutlined />,
    },
    delivered: { 
      text: "Delivered", 
      color: "green", 
      icon: <CheckCircleOutlined /> 
    },
    cancelled: { 
      text: "Cancelled", 
      color: "red", 
      icon: <CloseCircleOutlined /> 
    },
  };

  // Handle order cancellation
  const handleCancelOrder = (orderId) => {
    confirm({
      title: "Are you sure you want to cancel this order?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          const response = await cancelOrder(orderId);

          if (response && response.success) {
            message.success("Order cancelled successfully");
            fetchOrders(); // Refresh order list
          } else {
            message.error(response?.message || "Could not cancel order");
          }
        } catch (error) {
          console.error("Cancel order error:", error);
          message.error("Error cancelling order");
        }
      },
    });
  };

  // Order table columns
  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <span className="order-id">#{id}</span>,
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => moment(date).format("MM/DD/YYYY HH:mm"),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <span className="order-amount">${parseFloat(amount).toFixed(2)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = orderStatusMap[status.toLowerCase()] || {
          text: status,
          color: "default",
          icon: <ExclamationCircleOutlined />,
        };
        return (
          <Tag
            color={statusInfo.color}
            icon={statusInfo.icon}
            className="status-tag"
          >
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/order/${record.id}`)}
          >
            Details
          </Button>
          {record.status.toLowerCase() === "pending" && (
            <Button
              danger
              size="small"
              onClick={() => handleCancelOrder(record.id)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="orders-section animate__animated animate__fadeIn">
      <div className="section-header">
        <Title level={4}>My Orders</Title>
        <Button type="primary" onClick={fetchOrders}>
          Refresh
        </Button>
      </div>

      <div className="orders-table">
        <Table
          columns={orderColumns}
          dataSource={orders}
          rowKey="id"
          pagination={false}
          loading={loading}
          locale={{
            emptyText: (
              <Empty
                description="No orders found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="order-details-expand">
                <p>
                  <strong>Shipping Address:</strong> {record.shipAddress}
                </p>
                <Divider orientation="left">Order Items</Divider>
                <div className="order-items">
                  {/* Use orderDetails array instead of items */}
                  {(record.orderDetails || []).map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        {item.thumbnail && <img src={item.thumbnail} alt={item.name} />}
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-type">{item.itemType}</div>
                        <div className="item-price">
                          ${item.unitPrice} x {item.quantity}
                        </div>
                      </div>
                      <div className="item-total">
                        ${(item.subtotal || (item.unitPrice * item.quantity)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <Divider />
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${parseFloat(record.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>${parseFloat(record.freight || 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${parseFloat((record.totalAmount || 0) + (record.freight || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ),
          }}
        />

        {pagination.total > 0 && (
          <div className="pagination-container">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handleTableChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} orders`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;