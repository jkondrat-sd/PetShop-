import React, { useEffect } from "react";
import { Row, Col, Card, Statistic, Avatar, Table, Tag, List, Select, Spin } from "antd";
import { UserOutlined, ShoppingCartOutlined, AppstoreOutlined, SolutionOutlined } from "@ant-design/icons";
import { Pie } from '@ant-design/charts';
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "~/redux/actions/userActions";
import { fetchPets } from "~/redux/actions/petActions";
import { fetchAccessories } from "~/redux/actions/accessoryActions";
import { fetchOrders } from "~/redux/actions/orderActions";
import "animate.css";
import "./Dashboard.scss";

const { Option } = Select;

const Dashboard = () => {
  const dispatch = useDispatch();

  // Lấy dữ liệu từ redux
  const { list: users = [], loading: loadingUsers, pagination: userPagination = {} } = useSelector(state => state.user);
  const { pets = [], loading: loadingPets, pagination: petPagination = {} } = useSelector(state => state.pet);
  const { list: accessories = [], loading: loadingAccessories, pagination: accessoryPagination = {} } = useSelector(state => state.accessory);
  const { list: orders = [], loading: loadingOrders, pagination: orderPagination = {} } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchUsers({ page: 0, size: 5 }));
    dispatch(fetchPets({ page: 0, size: 5 }));
    dispatch(fetchAccessories({ page: 0, size: 5 }));
    dispatch(fetchOrders({ page: 0, size: 1000 }));
  }, [dispatch]);

  // Lấy tổng số thực tế
  const totalUsers = userPagination.totalElements || users.length;
  const totalPets = petPagination.totalElements || pets.length;
  const totalAccessories = accessoryPagination.totalElements || accessories.length;
  const totalOrders = orderPagination.totalElements || orders.length;

  // Lấy 5 user mới nhất
  const newUsers = users.slice(0, 5);

  // Lấy 5 đơn hàng gần nhất
  const recentOrders = orders.slice(0, 5);

  // Gom nhóm tất cả status thực tế trong orders
  const statusMap = {};
  orders.forEach(o => {
    if (o.status && typeof o.status === 'string' && o.status.trim() !== '') {
      statusMap[o.status] = (statusMap[o.status] || 0) + 1;
    }
  });
  const orderStatusData = Object.entries(statusMap).map(([type, value]) => ({ type, value }));

  const pieConfig = {
    data: orderStatusData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      content: (data) => `${data.type}: ${(data.percent * 100).toFixed(0)}%`
    },
    legend: { position: 'bottom' },
    height: 260,
  };

  // Cột cho bảng đơn hàng
  const orderColumns = [
    { title: "Order ID", dataIndex: "id", key: "id" },
    { title: "Customer", dataIndex: "userName", key: "userName" },
    { title: "Total", dataIndex: "totalAmount", key: "totalAmount", render: v => `$${v}` },
    { title: "Status", dataIndex: "status", key: "status", render: status => <Tag color={status === "pending" ? "blue" : status === "cancelled" ? "red" : status === "shipped" ? "green" : status === "paid" ? "lime" : "orange"}>{status}</Tag> },
  ];

  return (
    <div className="admin-dashboard">
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h2 className="page-title animate__animated animate__fadeInLeft">Dashboard</h2>
        </Col>
        <Col>
          <Select defaultValue="This Month" style={{ width: 120 }}>
            <Option value="This Month">This Month</Option>
            <Option value="Last Month">Last Month</Option>
          </Select>
        </Col>
      </Row>

      {/* Thống kê tổng quan */}
      <Row gutter={16} className="stats-cards">
        <Col span={6}>
          <Card className="stat-card animate__animated animate__fadeInUp delay-1">
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card animate__animated animate__fadeInUp delay-2">
            <Statistic
              title="Total Pets"
              value={totalPets}
              prefix={<SolutionOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card animate__animated animate__fadeInUp delay-3">
            <Statistic
              title="Total Accessories"
              value={totalAccessories}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card animate__animated animate__fadeInUp delay-4">
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* New Users */}
        <Col span={12}>
          <Card title="New Users" className="animate__animated animate__fadeInUp chart-card">
            <Spin spinning={loadingUsers}>
              <List
                itemLayout="horizontal"
                dataSource={newUsers}
                renderItem={user => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        user.avatarUrl
                          ? <Avatar src={user.avatarUrl} />
                          : <Avatar style={{ background: "#ff4d94" }}>{user.username ? user.username[0].toUpperCase() : <UserOutlined />}</Avatar>
                      }
                      title={user.username}
                      description={user.email}
                    />
                    <Tag color={user.enabled ? "green" : "red"}>{user.enabled ? "Active" : "Blocked"}</Tag>
                  </List.Item>
                )}
              />
            </Spin>
          </Card>
        </Col>
        {/* Recent Orders */}
        <Col span={12}>
          <Card title="Recent Orders" className="animate__animated animate__fadeInUp chart-card">
            <Spin spinning={loadingOrders}>
              <Table
                dataSource={recentOrders}
                columns={orderColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Spin>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Order Status Analytics" className="animate__animated animate__fadeInUp chart-card">
            <Pie
              data={orderStatusData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                content: (data) => `${data.type}: ${(data.percent * 100).toFixed(0)}%`
              }}
              legend={{ position: 'bottom' }}
              height={260}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
