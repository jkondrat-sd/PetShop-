import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Form, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

// Import components
import Header from '~/layouts/client/components/Header/Header';
import Footer from '~/layouts/client/components/Footer/Footer';
import BasicInfo from '../Components/BasicInfo/BasicInfo';

import ChangePassword from '../Components/ChangePassword/ChangePassword';

import config from '~/config';
import './MyProfile.scss';

function MyProfile() {
  const { userData } = useSelector((state) => state.loginReducer);
  // console.log('userData', userData);

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const [avatar, setAvatar] = useState(userData?.avatarUrl || null);
  
  // const items = [
  //   {
  //     key: '1',
  //     label: 'Thông tin cá nhân',
  //     children: <BasicInfo form={form} avatar={avatar} setAvatar={setAvatar} userData={userData} />
  //   },
  //   {
  //     key: '2',
  //     label: 'Tài liệu của tôi',
  //     children: <MyDocuments userData={userData} />
  //   },
  //   {
  //     key: '3',
  //     label: 'Đổi mật khẩu',
  //     children: <ChangePassword form={passwordForm} />
  //   },
  // ];

  // useEffect(() => {
  //   if (userData) {
  //     form.setFieldsValue({
  //       fullName: userData.fullName,
  //       email: userData.email,
  //       phone: userData.phone,
  //       description: userData.description,
  //     });
  //   }
  // }, [userData, form]);

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Thông tin cá nhân</h1>
          <p>Quản lý thông tin cá nhân và tài khoản</p>
        </div>
        
        <Card bordered={false} className="profile-card">
          <Tabs 
            defaultActiveKey="1" 
            activeKey={activeTab}
            onChange={setActiveTab}
            // items={items}
            className="profile-tabs"
          />
        </Card>
      </div>
      <Footer />
    </>
  );
}

export default MyProfile;