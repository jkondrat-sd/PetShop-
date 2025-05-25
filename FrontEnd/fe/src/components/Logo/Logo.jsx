import React from 'react';
import { Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import styles from './Logo.module.scss';

const { Title } = Typography;

const Logo = ({ collapsed }) => {
  return (
    <div className={styles.logo}>
      <ShopOutlined className={styles.icon} />
      {!collapsed && (
        <Title level={4} className={styles.text}>
          Pet Shop
        </Title>
      )}
    </div>
  );
};

export default Logo; 