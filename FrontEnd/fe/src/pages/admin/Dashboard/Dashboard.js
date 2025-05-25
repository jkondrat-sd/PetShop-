import React, { useState, useEffect } from "react";
import {
	Card,
	Row,
	Col,
	Table,
	Button,
	Progress,
	Typography,
	Space,
	List,
	Avatar,
} from "antd";
import {
	ShoppingCartOutlined,
	UserOutlined,
	DollarOutlined,
	TagOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined,
} from "@ant-design/icons";
import { Line, Pie } from "@ant-design/plots";
import "./Dashboard.scss";
import "animate.css";

const { Title, Text } = Typography;

const Dashboard = () => {
	// const [stats, setStats] = useState({
	// 	totalSales: 0,
	// 	totalOrders: 0,
	// 	totalUsers: 0,
	// 	totalProducts: 0,
	// 	recentOrders: [],
	// 	salesData: [],
	// 	productDistribution: [],
	// });
	// const [loading, setLoading] = useState(true);

	// useEffect(() => {
	// 	// TODO: Replace with real API call
	// 	// fetch('/api/dashboard')
	// 	//   .then(res => res.json())
	// 	//   .then(data => {
	// 	//     setStats(data);
	// 	//     setLoading(false);
	// 	//   })
	// 	//   .catch(() => setLoading(false));
	// 	setTimeout(() => {
	// 		setStats({
	// 			totalSales: 152500000,
	// 			totalOrders: 182,
	// 			totalUsers: 95,
	// 			totalProducts: 48,
	// 			recentOrders: [
	// 				{
	// 					id: "ORD-001",
	// 					customer: "John Doe",
	// 					date: "2023-05-22",
	// 					total: 850000,
	// 					status: "completed",
	// 				},
	// 				{
	// 					id: "ORD-002",
	// 					customer: "Jane Smith",
	// 					date: "2023-05-22",
	// 					total: 1250000,
	// 					status: "processing",
	// 				},
	// 				{
	// 					id: "ORD-003",
	// 					customer: "Alice Brown",
	// 					date: "2023-05-21",
	// 					total: 950000,
	// 					status: "completed",
	// 				},
	// 				{
	// 					id: "ORD-004",
	// 					customer: "Bob Lee",
	// 					date: "2023-05-21",
	// 					total: 2150000,
	// 					status: "completed",
	// 				},
	// 			],
	// 			salesData: [
	// 				{ month: "Jan", sales: 10500000 },
	// 				{ month: "Feb", sales: 12000000 },
	// 				{ month: "Mar", sales: 15800000 },
	// 				{ month: "Apr", sales: 20200000 },
	// 				{ month: "May", sales: 25000000 },
	// 			],
	// 			productDistribution: [
	// 				{ type: "Dog", value: 35 },
	// 				{ type: "Cat", value: 30 },
	// 				{ type: "Food", value: 20 },
	// 				{ type: "Accessory", value: 15 },
	// 			],
	// 		});
	// 		setLoading(false);
	// 	}, 1500);
	// }, []);

	// const orderColumns = [
	// 	{ title: "ID", dataIndex: "id", key: "id" },
	// 	{ title: "Customer", dataIndex: "customer", key: "customer" },
	// 	{ title: "Date", dataIndex: "date", key: "date" },
	// 	{
	// 		title: "Total",
	// 		dataIndex: "total",
	// 		key: "total",
	// 		render: (total) => `${total.toLocaleString("en-US")}₫`,
	// 	},
	// 	{
	// 		title: "Status",
	// 		dataIndex: "status",
	// 		key: "status",
	// 		render: (status) => {
	// 			const statusMap = {
	// 				completed: { text: "Completed", className: "status-completed" },
	// 				processing: { text: "Processing", className: "status-processing" },
	// 				cancelled: { text: "Cancelled", className: "status-cancelled" },
	// 			};
	// 			const { text, className } = statusMap[status] || {};
	// 			return <span className={`status-badge ${className}`}>{text}</span>;
	// 		},
	// 	},
	// ];

	// const formatCurrency = (value) => {
	// 	return value.toLocaleString("en-US");
	// };

	return (
    <></>
		// <div className="admin-dashboard animate__animated animate__fadeIn">
		// 	<Title level={2} className="page-title">
		// 		Overview
		// 	</Title>

		// 	<Row gutter={[24, 24]} className="stats-cards">
		// 		<Col xs={24} sm={12} lg={6}>
		// 			<Card
		// 				className="stat-card animate__animated animate__zoomIn"
		// 				loading={loading}
		// 			>
		// 				<div className="stat-value-row">
		// 					<span className="stat-icon"><DollarOutlined /></span>
		// 					<span className="stat-title">Revenue</span>
		// 				</div>
		// 				<div className="stat-value" style={{ color: "#3f8600", fontSize: 28, fontWeight: 600 }}>
		// 					{formatCurrency(stats.totalSales)} ₫
		// 				</div>
		// 				<div className="growth-indicator positive">
		// 					<ArrowUpOutlined /> 15% compared to last month
		// 				</div>
		// 			</Card>
		// 		</Col>
		// 		<Col xs={24} sm={12} lg={6}>
		// 			<Card
		// 				className="stat-card animate__animated animate__zoomIn animate__delay-1s"
		// 				loading={loading}
		// 			>
		// 				<div className="stat-value-row">
		// 					<span className="stat-icon"><ShoppingCartOutlined /></span>
		// 					<span className="stat-title">Orders</span>
		// 				</div>
		// 				<div className="stat-value" style={{ color: "#1890ff", fontSize: 28, fontWeight: 600 }}>
		// 					{formatCurrency(stats.totalOrders)}
		// 				</div>
		// 				<div className="growth-indicator positive">
		// 					<ArrowUpOutlined /> 8% compared to last month
		// 				</div>
		// 			</Card>
		// 		</Col>
		// 		<Col xs={24} sm={12} lg={6}>
		// 			<Card
		// 				className="stat-card animate__animated animate__zoomIn animate__delay-2s"
		// 				loading={loading}
		// 			>
		// 				<div className="stat-value-row">
		// 					<span className="stat-icon"><UserOutlined /></span>
		// 					<span className="stat-title">Users</span>
		// 				</div>
		// 				<div className="stat-value" style={{ color: "#722ed1", fontSize: 28, fontWeight: 600 }}>
		// 					{formatCurrency(stats.totalUsers)}
		// 				</div>
		// 				<div className="growth-indicator positive">
		// 					<ArrowUpOutlined /> 12% compared to last month
		// 				</div>
		// 			</Card>
		// 		</Col>
		// 		<Col xs={24} sm={12} lg={6}>
		// 			<Card
		// 				className="stat-card animate__animated animate__zoomIn animate__delay-3s"
		// 				loading={loading}
		// 			>
		// 				<div className="stat-value-row">
		// 					<span className="stat-icon"><TagOutlined /></span>
		// 					<span className="stat-title">Products</span>
		// 				</div>
		// 				<div className="stat-value" style={{ color: "#fa8c16", fontSize: 28, fontWeight: 600 }}>
		// 					{formatCurrency(stats.totalProducts)}
		// 				</div>
		// 				<div className="growth-indicator negative">
		// 					<ArrowDownOutlined /> 2% compared to last month
		// 				</div>
		// 			</Card>
		// 		</Col>
		// 	</Row>

		// 	<Row gutter={[24, 24]} className="chart-section">
		// 		<Col xs={24} lg={16}>
		// 			<Card
		// 				title="Monthly Revenue"
		// 				className="chart-card animate__animated animate__fadeInUp"
		// 			>
		// 				{!loading && stats.salesData && stats.salesData.length > 0 && (
		// 					<Line
		// 						data={stats.salesData}
		// 						padding="auto"
		// 						xField="month"
		// 						yField="sales"
		// 						smooth={true}
		// 						meta={{
		// 							sales: {
		// 								formatter: (v) => `${(v / 1000000).toFixed(1)}M`,
		// 							},
		// 						}}
		// 					/>
		// 				)}
		// 			</Card>
		// 		</Col>
		// 		<Col xs={24} lg={8}>
		// 			<Card
		// 				title="Product Distribution"
		// 				className="chart-card animate__animated animate__fadeInUp animate__delay-1s"
		// 			>
		// 				{!loading &&
		// 					stats.productDistribution &&
		// 					stats.productDistribution.length > 0 && (
		// 						<Pie
		// 							data={stats.productDistribution}
		// 							angleField="value"
		// 							colorField="type"
		// 							radius={0.8}
		// 							label={{
		// 								type: "outer",
		// 								content: "{name} {percentage}",
		// 							}}
		// 							interactions={[
		// 								{ type: "pie-legend-active" },
		// 								{ type: "element-active" },
		// 							]}
		// 						/>
		// 					)}
		// 			</Card>
		// 		</Col>
		// 	</Row>

		// 	<Card
		// 		title="Recent Orders"
		// 		className="recent-orders-card animate__animated animate__fadeInUp animate__delay-2s"
		// 		extra={<Button type="link">View All</Button>}
		// 	>
		// 		<Table
		// 			columns={orderColumns}
		// 			dataSource={stats.recentOrders}
		// 			loading={loading}
		// 			pagination={false}
		// 			rowKey="id"
		// 		/>
		// 	</Card>
		// </div>
	);
};

export default Dashboard;
