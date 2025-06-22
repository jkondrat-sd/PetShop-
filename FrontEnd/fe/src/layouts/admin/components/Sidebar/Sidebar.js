import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
	DashboardOutlined,
	ShopOutlined,
	ShoppingCartOutlined,
	UserOutlined,
	AppstoreOutlined,
	PieChartOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import styles from "./SideBar.module.scss";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedKeys, setSelectedKeys] = useState([]);

	useEffect(() => {
		const pathName = location.pathname;
		const key = pathName.split("/").slice(0, 3).join("/");
		setSelectedKeys([key]);
	}, [location.pathname]);

	const menuItems = [
		{
			key: "/admin/dashboard",
			icon: <DashboardOutlined />,
			label: "Dashboard",
		},
		{
			key: "/admin/pets",
			icon: <ShopOutlined />,
			label: "Pets",
			children: [
				{
					key: "/admin/pets",
					label: "Pet List",
				},
				{
					key: "/admin/pets/create",
					label: "Add New Pet",
				},
				// {
				// 	key: "/admin/breeds",
				// 	label: "Breed Management",
				// },
			],
		},
		// Update other menu items similarly
		{
			key: "/admin/accessories",
			icon: <AppstoreOutlined />,
			label: "Accessories",
			children: [
				{
					key: "/admin/accessories/list",
					label: "Accessories List",
				},
				{
					key: "/admin/accessories/create",
					label: "Add New Accessory",
				},
			],
		},
		// {
		// 	key: "/admin/categories",
		// 	icon: <TagsOutlined />,
		// 	label: "Categories",
		// },
		{
			key: "/admin/orders",
			icon: <ShoppingCartOutlined />,
			label: "Orders",
		},
		{
			key: "/admin/users",
			icon: <UserOutlined />,
			label: "Users",
		},
		// {
		// 	key: "/admin/roles",
		// 	icon: <LockOutlined />,
		// 	label: "Roles",
		// },
		// {
		// 	key: "/admin/reviews",
		// 	icon: <CommentOutlined />,
		// 	label: "Reviews",
		// },
		{
			key: "/admin/reports",
			icon: <PieChartOutlined />,
			label: "Reports",
			children: [
				{
					key: "/admin/reports/sales",
					label: "Sales Report",
				},
				{
					key: "/admin/reports/inventory",
					label: "Inventory Report",
				},
			],
		},
	];

	return (
		<Sider
			width={256}
			collapsible
			collapsed={collapsed}
			trigger={null}
			theme="light"
			className={styles.sidebar}
			breakpoint="lg"
			collapsedWidth="80"
		>
			<div className={styles.logoContainer}>
				<Logo collapsed={collapsed} />
			</div>

			<Menu
				mode="inline"
				selectedKeys={selectedKeys}
				className={styles.menu}
				onClick={({ key }) => navigate(key)}
				items={menuItems}
			/>
		</Sider>
	);
};

export default Sidebar;
