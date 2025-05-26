import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Descriptions, Button, Tag, Spin, message, Modal, Divider } from "antd";
import { ArrowLeftOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import * as orderService from "../../../services/orderService";
import "animate.css";
import "./OrderDetail.scss";

const statusColor = {
  Pending: "processing",
  Confirmed: "success",
  Cancelled: "error",
  Delivered: "blue",
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const res = await orderService.getOrderById(id);
        setOrder(res);
      } catch (error) {
        message.error("Failed to load order details!");
        navigate("/users/profile");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, navigate]);

  const handleCancelOrder = () => {
    Modal.confirm({
      title: "Cancel Order",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel this order?",
      okText: "Yes, Cancel",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setCanceling(true);
        try {
          await orderService.cancelOrder(id);
          message.success("Order cancelled successfully!");
          setOrder({ ...order, status: "Cancelled" });
        } catch (error) {
          message.error("Failed to cancel order!");
        } finally {
          setCanceling(false);
        }
      },
    });
  };

  if (loading || !order) {
    return (
      <div className="order-detail-page">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="order-detail-page animate__animated animate__fadeIn">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/users/profile")}
        style={{ marginBottom: 24 }}
      >
        Back to Orders
      </Button>
      <Descriptions
        title={`Order #${order.id || order.orderId}`}
        bordered
        column={1}
        size="middle"
        extra={
          order.status === "Pending" && (
            <Button
              danger
              loading={canceling}
              onClick={handleCancelOrder}
              disabled={order.status === "Cancelled"}
            >
              Cancel Order
            </Button>
          )
        }
      >
        <Descriptions.Item label="Date">
          {order.createdAt || order.date}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={statusColor[order.status] || "default"}>
            {order.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Total">
          <b>${order.total?.toLocaleString() || order.totalAmount}</b>
        </Descriptions.Item>
        <Descriptions.Item label="Shipping Address">
          {order.shipAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Method">
          {order.paymentMethod}
        </Descriptions.Item>
        <Descriptions.Item label="Order Items">
          <div>
            {order.items?.map((item) => (
              <div key={item.itemId} className="order-item-row">
                <span>
                  <b>{item.name || item.itemType}</b> x{item.quantity}
                </span>
                <span>
                  ${item.price?.toLocaleString() || "-"}
                </span>
              </div>
            ))}
          </div>
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Button type="primary" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </div>
  );
};

export default OrderDetail;
