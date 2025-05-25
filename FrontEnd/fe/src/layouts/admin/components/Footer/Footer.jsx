import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter style={{ textAlign: 'center', padding: '12px 50px' }}>
      Pet Shop Admin ©{new Date().getFullYear()} - Created by Your Company
    </AntFooter>
  );
};

export default Footer;