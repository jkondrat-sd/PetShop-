import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import 'animate.css';
import './Register.scss';
import logoImg from '../../../assets/images/logoPOMPOM-removebg.png';
import { register } from '../../../services/authService';

function Register() {
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    try {
      // Extract first name and last name
      const nameParts = values.fullName.split(' ');
      const lastName = nameParts.pop();
      const firstName = nameParts.join(' ');
      
      // Based on RegisterRequest.java requirements
      const response = await register(
        values.email,
        values.username,
        values.password,
        firstName,
        lastName,
        values.phone,
        values.address
      );
      
      console.log('Registration response:', response);
      
      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="left-panel">
          <h1 className="panel-title animate__animated animate__fadeInDown">Create Account</h1>
          <p className="panel-subtitle">or use your email for registration</p>
          
          <Form
            name="register-form"
            className="auth-form"
            onFinish={onFinish}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="fullName"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Full Name" 
                    className="auth-input"
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please enter a username' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
                className="auth-input"
              />
            </Form.Item>
            
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
                className="auth-input"
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Password" 
                className="auth-input"
              />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Confirm Password" 
                className="auth-input"
              />
            </Form.Item>
            
            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="Phone Number" 
                className="auth-input"
              />
            </Form.Item>
            
            <Form.Item
              name="address"
              rules={[{ required: true, message: 'Please enter your address' }]}
            >
              <Input 
                prefix={<HomeOutlined />} 
                placeholder="Address" 
                className="auth-input"
              />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" className="auth-button">
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </div>
        
        <div className="right-panel">
          <div className="logo-container">
            <img src={logoImg} alt="PomPom Logo" className="logo" />
          </div>
          <h1 className="animate__animated animate__fadeInDown">Hello, Friend!</h1>
          <p>Enter your personal details and start journey with us</p>
          <Link to="/login">
            <Button type="default" className="btnPrimary">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;