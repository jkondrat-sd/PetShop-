import classNames from "classnames/bind";
import { Col, Row, Avatar, Dropdown, Space, Badge, Input } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faInfoCircle,
	faUser,
	faSignOutAlt,
	faUserCircle,
	faShoppingCart,
	faBookmark,
	faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkLogin } from "~/redux/actions/login";
import Search from "../Search";
import styles from "./Header.module.scss";
import logo from "~/assets/images/logoPOMPOM-removebg.png";
import config from "~/config";
import CartModal from "~/pages/client/CartModal/CartModal";
// import { checkLogin } from "~/store/actions/login";
import { deleteCookie } from "~/helpers/cookie";
import { getUserInfo } from "~/services/usersService";
import { getCart } from '~/services/cartService';

const cx = classNames.bind(styles);

function Header() {
	const { isLoggedIn, userData } = useSelector((state) => state.loginReducer);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [cartModalVisible, setCartModalVisible] = useState(false);
	const [cartItemCount, setCartItemCount] = useState(0);

	const handleLogout = () => {
		// Clear authentication token
		deleteCookie("token");

		// Clear user data from localStorage
		localStorage.removeItem("userData");

		// Clear any other user-related data
		localStorage.removeItem("userEmail");

		// Update Redux state
		dispatch(checkLogin(false, null));

		// Navigate to home page
		navigate("/");
	};

	useEffect(() => {
  const handleCartUpdate = async () => {
    try {
      console.log("Header: Handling cart update event");
      const response = await getCart();
      if (response && response.success && response.data) {
        console.log("Header: Updated cart count:", response.data.totalItems);
        setCartItemCount(response.data.totalItems || 0);
      } else {
        console.log("Header: Cart response empty or invalid");
        setCartItemCount(0);
      }
    } catch (error) {
      console.error("Error updating cart count:", error);
      setCartItemCount(0);
    }
  };
  
  // Lắng nghe sự kiện cartUpdated
  window.addEventListener("cartUpdated", handleCartUpdate);
  
  // Fetch cart ngay khi component mount
  handleCartUpdate();
  
  return () => {
    window.removeEventListener("cartUpdated", handleCartUpdate);
  };
}, []);

	// useEffect(() => {
	// 	// Kiểm tra dữ liệu từ localStorage
	// 	const localUserData = JSON.parse(localStorage.getItem("userData") || "{}");
	// 	console.log("Local Storage userData:", localUserData);
	// 	console.log("Local Storage avatarUrl:", localUserData?.avatarUrl);
	// }, [userData]);

	const showCartModal = () => {
		setCartModalVisible(true);
	};

	const hideCartModal = () => {
		setCartModalVisible(false);
	};

	const userMenuItems = [
		{
			key: "1",
			label: "My Profile",
			icon: <FontAwesomeIcon icon={faUserCircle} />,
			onClick: () => navigate("/users/profile"),
		},
		{
			type: "divider",
		},
		{
			key: "3",
			label: "Logout",
			icon: <FontAwesomeIcon icon={faSignOutAlt} />,
			danger: true,
			onClick: handleLogout,
		},
	];

	// console.log("User data:", userData);
	// console.log("Is logged in:", isLoggedIn);

	return (
		<div className={cx("header-bg")}>
			<div className={cx("header-container")}>
				<div className={cx("header-logo")}>
					<Link to={config.routesClient.home}>
						<img src={logo} alt="logo" />
					</Link>
				</div>
				<nav className={cx("header-menu")}>
					<NavLink
						to={config.routesClient.home}
						className={({ isActive }) => cx("menu-item", { active: isActive })}
					>
						Home
					</NavLink>
					<NavLink
						to="/pets"
						className={({ isActive }) => cx("menu-item", { active: isActive })}
					>
						Pets
					</NavLink>
					<NavLink
						to="/accessories"
						className={({ isActive }) => cx("menu-item", { active: isActive })}
					>
						Accessories
					</NavLink>
					<NavLink
						to="/contact"
						className={({ isActive }) => cx("menu-item", { active: isActive })}
					>
						Contact
					</NavLink>
				</nav>
				<div className={cx("header-search-user")}>
					<Input
						className={cx("header-search")}
						placeholder="Search something here!"
						prefix={
							<FontAwesomeIcon icon={faSearch} style={{ color: " #003459" }} />
						}
						allowClear
					/>
					<div className={cx("header-user-section")}>
						{isLoggedIn ? (
							<>
								{/* Thêm icon giỏ hàng */}
								<div className={cx("cart-icon")} onClick={showCartModal}>
									<Badge count={cartItemCount} size="small">
										<FontAwesomeIcon
											icon={faShoppingCart}
											style={{
												fontSize: "26px",
												color: "#003459",
												marginRight: "15px",
												cursor: "pointer",
											}}
										/>
									</Badge>
								</div>
								<Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
									<Space className={cx("user-info")}>
										<Avatar
											src={
												userData && userData.avatarUrl
													? userData.avatarUrl
													: null
											}
											icon={
												!userData?.avatarUrl && (
													<FontAwesomeIcon icon={faUser} />
												)
											}
											className={cx("user-avatar")}
										/>
										<span className={cx("username")}>
											{userData?.username || "Người dùng"}
										</span>
									</Space>
								</Dropdown>
							</>
						) : (
							<div className={cx("auth-buttons")}>
								<button
									onClick={() => navigate("/login")}
									className={cx("login-btn")}
								>
									Login
								</button>
								<button
									className={cx("register-btn")}
									onClick={() => navigate("/register")}
								>
									Register
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<CartModal visible={cartModalVisible} onClose={hideCartModal} />
		</div>
	);
}

export default Header;
