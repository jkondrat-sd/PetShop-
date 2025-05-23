import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Tabs, Card, Spin, Avatar, Typography, Tag
} from 'antd';
import { 
  UserOutlined, ShoppingOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../../../layouts/client/components/Header/Header';
import Footer from '../../../layouts/client/components/Footer/Footer';

import 'animate.css';
import './Profile.scss';
import BasicInfo from './BasicInfo/BasicInfo';
import MyOrders from './MyOrders/MyOrders';
import { checkLogin } from '../../../redux/actions/login';
import TabPane from 'antd/es/tabs/TabPane';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, userData } = useSelector(state => state.loginReducer);
  const [activeTab, setActiveTab] = useState('1');
  const [avatar, setAvatar] = useState(userData?.avatarUrl || null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check if userData exists in localStorage
        const storedUserData = localStorage.getItem('userData');
        
        if (storedUserData) {
          // If exists, restore login state in Redux
          const parsedUserData = JSON.parse(storedUserData);
          dispatch(checkLogin(true, parsedUserData));
          setAvatar(parsedUserData.avatarUrl || null);
          
          // Stop loading as we have data
          setIsLoading(false);
        } else if (!isLoggedIn) {
          // If no data in localStorage and not logged in
          navigate('/login', { state: { from: '/profile' } });
        } else {
          // Stop loading if isLoggedIn = true
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsLoading(false);
        navigate('/login', { state: { from: '/profile' } });
      }
    };
    
    checkAuthStatus();
  }, [dispatch, isLoggedIn, navigate]);

  // Show loading when data is being fetched
  if (isLoading || !userData) {
    return (
      <>
        <Header />
        <div className="profile-loading-container">
          <Spin size="large" tip="Loading profile information..." />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="profile-container animate__animated animate__fadeIn">
        <div className="profile-content">
          <Card bordered={false}>
            <Tabs 
              activeKey={activeTab}
              onChange={setActiveTab}
              type="card"
              size="large"
              tabBarGutter={8}
              className="profile-tabs"
            >
              <TabPane 
                tab={<span><UserOutlined />Personal Information</span>} 
                key="1"
              >
                <div className="tab-content animate__animated animate__fadeIn">
                  <BasicInfo avatar={avatar} setAvatar={setAvatar} />
                </div>
              </TabPane>
              
              <TabPane 
                tab={<span><ShoppingOutlined />Order Management</span>} 
                key="2"
              >
                <div className="tab-content animate__animated animate__fadeIn">
                  <MyOrders />
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;