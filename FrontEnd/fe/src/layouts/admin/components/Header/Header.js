import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import { LogoutOutlined, UserOutlined, BellOutlined } from "@ant-design/icons";
import { Button, Badge, Dropdown, Space, Avatar } from "antd";

import styles from "./Header.module.scss";
import config from "~/config";
import logo from "~/assets/images/logo.png";

const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();
  const userMenuItems = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate(config.routesAdmin.users.myAccount),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => navigate(config.routesAdmin.auth.logout),
    },
  ];

  return (
    <header className={cx("wrapper")}>
      <div className={cx("left")}>
        <Link to={config.routesAdmin.dashboard} className={cx("logo")}>
          <img src={logo} alt="Logo" />
          <span>Tổng quan</span>
        </Link>
      </div>

      <div className={cx("right")}>
        <div className={cx("actions")}>
          <Badge count={5} className={cx("notification")}>
            <Button
              type="text"
              icon={<BellOutlined />}
              className={cx("action-btn")}
            />
          </Badge>
        </div>

        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Space className={cx("user")}>
            <Avatar
              size={40}
              icon={<UserOutlined />}
              className={cx("avatar")}
            />
            <span className={cx("username")}>Admin</span>
          </Space>
        </Dropdown>
      </div>
    </header>
  );
}

export default Header;
