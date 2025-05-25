import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import styles from './DefaultLayout.module.scss';

const { Content } = Layout;

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className={styles.adminLayout}>
      <Sidebar collapsed={collapsed} />
      <Layout className={`${styles.siteLayout} ${collapsed ? 'collapsed' : ''}`}>
        <Header collapsed={collapsed} toggle={toggleCollapsed} />
        <Content className={styles.siteContent}>
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;