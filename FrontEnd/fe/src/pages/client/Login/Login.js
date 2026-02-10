import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkLogin } from '../../../redux/actions/login';
import 'animate.css';
import './Login.scss';
import logoImg from '../../../assets/images/logoPOMPOM-removebg.png';
import { getUserInfo, login } from '../../../services/authService';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
const onFinish = async (values) => {
  setLoading(true);
  try {
    const userData = await login(values.username, values.password);

    if (userData) {
      try {
        // Gọi API để lấy thông tin profile đầy đủ
        const profileResponse = await getUserInfo();
        // Kiểm tra cấu trúc response và lưu đúng dữ liệu
        let fullUserData;
        if (profileResponse.data) {
          // Lấy dữ liệu từ response.data (cấu trúc thực tế API)
          fullUserData = profileResponse.data;
        } else if (profileResponse.result) {
          // Phòng trường hợp API có cấu trúc khác
          fullUserData = profileResponse.result;
        } else {
          fullUserData = userData;
        }
        
        // Lưu dữ liệu vào Redux store
        dispatch(checkLogin(true, fullUserData));
        localStorage.setItem('userData', JSON.stringify(fullUserData));
        
        message.success('Đăng nhập thành công!');
        navigate('/');
      } catch (profileError) {
        // Xử lý nếu không lấy được profile
        console.error('Error fetching profile:', profileError);
        dispatch(checkLogin(true, userData));
        localStorage.setItem('userData', JSON.stringify(userData));
        message.warning('Đăng nhập thành công nhưng không lấy được đầy đủ thông tin');
        navigate('/');
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    // Luôn kiểm tra mã lỗi 401 hoặc message liên quan xác thực
    let errorMsg = 'Đăng nhập thất bại!';
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.data && (
        error.response.data.message?.toLowerCase().includes('authentication failed') ||
        error.response.data.message?.toLowerCase().includes('bad credentials')
      ))
    ) {
      errorMsg = 'Sai tên đăng nhập hoặc mật khẩu!';
    } else if (error.response && error.response.data && error.response.data.message) {
      errorMsg = error.response.data.message;
    }
    message.error(errorMsg);
  } finally {
    setLoading(false);
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
              name="username"
              rules={[
                { required: true, message: 'Please enter your username' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
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

            {/* Demo Account Info */}
            <div style={{ 
              background: '#f0f9ff', 
              border: '1px solid #0ea5e9', 
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '16px',
              fontSize: '13px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#0284c7' }}>🎮 Demo Account:</div>
              <div><strong>Admin:</strong> admin / admin123</div>
              <div><strong>User:</strong> user / user123</div>
            </div>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="auth-button" 
                loading={loading}
              >
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