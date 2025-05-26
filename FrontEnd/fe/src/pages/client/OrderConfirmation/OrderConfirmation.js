import React from "react";
import { Button, Result, Typography } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "animate.css";
import "./OrderConfirmation.scss";

const { Title, Paragraph } = Typography;

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="order-confirmation-page animate__animated animate__fadeIn">
      <Result
        icon={<SmileOutlined style={{ color: "#52c41a" }} />}
        title={<Title level={2}>Thank you for your order!</Title>}
        subTitle={
          <Paragraph>
            Your order has been placed successfully.<br />
            We will contact you soon to confirm and deliver your order.<br />
            <span className="order-confirmation-note">
              Please check your email for order details.
            </span>
          </Paragraph>
        }
        extra={[
          <Button
            type="primary"
            key="home"
            size="large"
            onClick={() => navigate("/")}
            className="animate__animated animate__pulse animate__delay-1s"
          >
            Back to Home
          </Button>,
          <Button
            key="orders"
            size="large"
            onClick={() => navigate("/users/profile")}
            className="animate__animated animate__fadeInUp animate__delay-2s"
          >
            View My Orders
          </Button>,
        ]}
      />
    </div>
  );
};

export default OrderConfirmation;
