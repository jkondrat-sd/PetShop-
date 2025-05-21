import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./LoginModal.module.scss";

import { setCookie } from "~/helpers/cookie";
import { checkLogin } from "~/store/actions/login";
import { showAlert } from "~/store/actions/alert";
import { login } from "~/services/authService";

const cx = classNames.bind(styles);

function LoginModal({ open, onClose, onForgotPassword, onRegister }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Gọi API đăng nhập
      const response = await login(values.emailPhone, values.password);
      
      if (response && response.code === 200) {
        // Lấy token từ response 
        const token = response.result.token;
        
        // Lưu token vào cookie
        setCookie("token", token);
        
        // Tạo đối tượng userData từ thông tin đăng nhập
        // Bạn có thể điều chỉnh theo cấu trúc API trả về
        const userData = {
          username: values.emailPhone,
          fullName: values.emailPhone // Tạm thời dùng username làm fullName
        };
        
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Cập nhật trạng thái đăng nhập trong Redux
        dispatch(checkLogin(true, userData));
        
        // Hiển thị thông báo thành công
        dispatch(showAlert("Đăng nhập thành công!", "success"));
        
        // Đóng modal
        onClose();
        
        // Tải lại trang để áp dụng thay đổi
        // window.location.reload();
      } else {
        throw new Error(response?.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      dispatch(showAlert(error.message || "Đăng nhập thất bại", "error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="ĐĂNG NHẬP"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      className={cx("login-modal")}
      closeIcon={<span className={cx("close-icon")}>×</span>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={cx("login-form")}
      >
        <Form.Item
          name="emailPhone"
          label="Tên đăng nhập"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên đăng nhập",
            },
          ]}
        >
          <Input
            placeholder="Nhập tên đăng nhập"
            className={cx("input-field")}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password
            placeholder="••••••••"
            className={cx("input-field")}
          />
        </Form.Item>

        <Form.Item>
          <div className={cx("form-options")}>
            <Form.Item name="rememberPassword" valuePropName="checked" noStyle>
              <label className={cx("remember-password")}>
                <Input type="checkbox" />
                <span>Nhớ mật khẩu</span>
              </label>
            </Form.Item>
            <button
              type="button"
              className={cx("forgot-password")}
              onClick={onForgotPassword}
            >
              Quên mật khẩu
            </button>
          </div>
        </Form.Item>

        <Form.Item>
          <button type="submit" className={cx("submit-btn")} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </Form.Item>

        <div className={cx("register-section")}>
          <span>Chưa có tài khoản?</span>
          <button
            type="button"
            className={cx("register-link")}
            onClick={onRegister}
          >
            Đăng ký ngay
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default LoginModal;