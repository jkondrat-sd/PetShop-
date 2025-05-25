import React, { useEffect, useState } from 'react';
import { Layout, Button, Avatar, Dropdown, theme, Badge, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BellOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../../../services/authService';
import styles from './Header.module.scss';
import 'animate.css';
import { deleteCookie } from '~/helpers/cookie';

const { Header: AntHeader } = Layout;

const Header = ({ collapsed, toggle }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { token } = theme.useToken();

  useEffect(() => {
    // Lấy thông tin từ localStorage thay vì gọi API
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  }, []);

  const handleLogout = () => {
    deleteCookie('token');
    localStorage.removeItem('userData');
    navigate('/admin/auth/login');
  };

  const avatarMenu = {
    items: [
      {
        key: 'profile',
        label: 'Hồ sơ cá nhân',
        icon: <UserOutlined />,
        onClick: () => navigate('/admin/profile'),
      },
      {
        key: 'settings',
        label: 'Thiết lập',
        icon: <SettingOutlined />,
        onClick: () => navigate('/admin/settings'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout,
      },
    ],
    className: styles.userMenu
  };

  return (
    <AntHeader className={`${styles.header} animate__animated animate__fadeIn`}>
      <div className={styles.left}>
        <Button
          type="text"
          className={styles.toggleButton}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggle}
        />
      </div>
      
      <div className={styles.right}>
        <Badge count={5} size="small" className={styles.notificationBadge}>
          <Button 
            shape="circle" 
            icon={<BellOutlined className={styles.icon} />}
            className="animate__animated animate__pulse animate__infinite"
          />
        </Badge>
        
        <Dropdown menu={avatarMenu} placement="bottomRight" trigger={['click']}>
          <Space className={styles.userDropdown}>
            <Avatar 
              src={user?.avatarUrl} 
              icon={!user?.avatarUrl && <UserOutlined />} 
              size="default"
              className={styles.avatar}
            />
            <span className={styles.username}>{user?.username || 'Admin'}</span>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;