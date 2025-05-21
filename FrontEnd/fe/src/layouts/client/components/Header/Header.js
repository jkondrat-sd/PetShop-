import classNames from "classnames/bind";
import { Col, Row, Avatar, Dropdown, Space, Badge, Input } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faUser,
  faSignOutAlt,
  faUserCircle,
  faBookmark,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Search from "../Search";
import CategoryModal from "~/pages/client/Category/CategoryModal";
import styles from "./Header.module.scss";
import logo from "~/assets/images/logoPOMPOM-removebg.png";
import RegisterModal from "~/pages/client/Registercuu";
import LoginModal from "~/pages/client/Logincuuu/LoginModal";
import ForgotPasswordModal from "~/pages/client/ForgotPassword";
import config from "~/config";
import { checkLogin } from "~/store/actions/login";
import { deleteCookie } from "~/helpers/cookie";

const cx = classNames.bind(styles);

function Header() {
  const { isLoggedIn, userData } = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleOpenRegister = () => {
    setShowLoginModal(false);
    setShowForgotPasswordModal(false);
    setShowRegisterModal(true);
  };

  const handleOpenLogin = () => {
    setShowRegisterModal(false);
    setShowForgotPasswordModal(false);
    setShowLoginModal(true);
  };

  const handleOpenForgotPassword = () => {
    setShowRegisterModal(false);
    setShowLoginModal(false);
    setShowForgotPasswordModal(true);
  };

  const handleLogout = () => {
    deleteCookie("token");
    dispatch(checkLogin(false));
    navigate("/");
    window.location.reload();
  };

  const userMenuItems = [
    {
      key: "1",
      label: "Trang cá nhân",
      icon: <FontAwesomeIcon icon={faUserCircle} />,
      onClick: () => navigate("/account/profile"),
    },
    // {
    //   key: '2',
    //   label: 'Tài liệu của tôi',
    //   icon: <FontAwesomeIcon icon={faUser} />,
    //   onClick: () => navigate('/account/documents'),
    // },
    {
      key: "4",
      label: "Thư viện",
      icon: <FontAwesomeIcon icon={faBookmark} />,
      onClick: () => navigate("/library"),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: <FontAwesomeIcon icon={faSignOutAlt} />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className={cx("header-bg")}>
      <div className={cx("header-container")}>
        <div className={cx("header-logo")}>
          <Link to={config.routesClient.home}>
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <nav className={cx("header-menu")}>
          <NavLink to={config.routesClient.home} className={({isActive}) => cx("menu-item", {active: isActive})}>Home</NavLink>
          <NavLink to="/pets" className={({isActive}) => cx("menu-item", {active: isActive})}>Pets</NavLink>
          <NavLink to="/accessories" className={({isActive}) => cx("menu-item", {active: isActive})}>Accessories</NavLink>
          <NavLink to="/blog" className={({isActive}) => cx("menu-item", {active: isActive})}>Blog</NavLink>
          <NavLink to="/contact" className={({isActive}) => cx("menu-item", {active: isActive})}>Contact</NavLink>
        </nav>
        <div className={cx("header-search-user")}>
          <Input
            className={cx("header-search")}
            placeholder="Search something here!"
            prefix={<FontAwesomeIcon icon={faSearch} style={{color: ' #003459'}} />}
            allowClear
          />
          <div className={cx("header-user-section")}>
            {isLoggedIn ? (
              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <Space className={cx("user-info")}>
                  <Avatar
                    src={userData?.avatarUrl}
                    icon={!userData?.avatarUrl && <FontAwesomeIcon icon={faUser} />}
                    className={cx("user-avatar")}
                  />
                  <span className={cx("username")}>{userData?.fullName || "Người dùng"}</span>
                </Space>
              </Dropdown>
            ) : (
              <div className={cx("auth-buttons")}>
                <button onClick={ () => navigate("/login")} className={cx("login-btn")}>Login</button>
                <button className={cx("register-btn")} onClick={ () => navigate("/register")}>Register</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <CategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />
      {!isLoggedIn && (
        <>
          <LoginModal
            open={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onForgotPassword={handleOpenForgotPassword}
            onRegister={handleOpenRegister}
          />
          <RegisterModal
            open={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            onLogin={handleOpenLogin}
          />
          <ForgotPasswordModal
            open={showForgotPasswordModal}
            onClose={() => setShowForgotPasswordModal(false)}
            onLogin={handleOpenLogin}
            onRegister={handleOpenRegister}
          />
        </>
      )}
    </div>
  );
}

export default Header;

