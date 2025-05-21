import React from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import 'animate.css';
import './Login.scss';
import logoImg from '../../../assets/images/logoPOMPOM-removebg.png';
import { login } from '../../../services/authService';

function Login() {
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    try {
      const response = await login(values.email, values.password);
      console.log('Login response:', response);
      
      // Store token in localStorage
      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        // Navigate to home page
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card login-card">
        <div className="left-panel">
          <div className="logo-container">
            <img src={logoImg} alt="PomPom Logo" className="logo" />
          </div>
          <h1 className="animate__animated animate__fadeInDown">Welcome Back!</h1>
          <p>To keep connected with us please login with your personal info</p>
          <Link to="/register">
            <Button type="default" className="btnPrimary">
              Sign Up
            </Button>
          </Link>
        </div>
        
        <div className="right-panel">
          <h1 className="panel-title animate__animated animate__fadeInDown">Log In</h1>
          <p className="panel-subtitle">or use your account</p>
          
          <Form
            name="login-form"
            className="auth-form"
            onFinish={onFinish}
            layout="vertical"
          >
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
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Password" 
                className="auth-input"
              />
            </Form.Item>
            
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" className="auth-button">
                Log In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;