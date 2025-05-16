import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { changePassword } from '~/services/usersService';

function ChangePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Gọi API đổi mật khẩu
      const response = await changePassword(values);
      
      notification.success({
        message: 'Thành công',
        description: response.message || 'Đổi mật khẩu thành công',
      });
      form.resetFields();
    } catch (error) {
      console.error('Change password error:', error);
      notification.error({
        message: 'Lỗi',
        description: error.response?.data?.message || 'Đổi mật khẩu thất bại',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="change-password-section">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="password-form"
      >
        <Form.Item
          name="currentPassword"
          label="Mật khẩu hiện tại"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>
        
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="change-btn"
            loading={loading}
          >
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ChangePassword;