import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, NavLink } from "react-router-dom";
import {
	Result,
	Card,
	Typography,
	Button,
	Spin,
	Input,
	message,
	Steps,
	Space,
} from "antd";
import {
	CheckCircleFilled,
	CopyOutlined,
	ExclamationCircleFilled,
	MailOutlined,
	UserOutlined,
	SafetyOutlined,
	CheckOutlined,
} from "@ant-design/icons";
import "./ConfirmAccount.scss";

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const ConfirmAccount = () => {
  // const [showLoginModal, setShowLoginModal] = useState(false);
	const [token, setToken] = useState("");
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState("processing"); // processing, success, error
	const [copied, setCopied] = useState(false);
	const [messageContent, setMessageContent] = useState("");
	const [responseData, setResponseData] = useState(null);
	const location = useLocation();
	const navigate = useNavigate();
	const params = useParams();
	const API_DOMAIN = "http://localhost:8089";

	useEffect(() => {
		// Extract token from URL path or query parameter
		const pathToken = params.code;
		const queryParams = new URLSearchParams(location.search);
		const queryToken = queryParams.get("token");

		const tokenToUse = pathToken || queryToken;

		if (tokenToUse) {
			setToken(tokenToUse);
			verifyToken(tokenToUse);
		} else {
			setLoading(false);
			setStatus("error");
			setMessageContent("Không tìm thấy mã xác thực trong đường dẫn.");
		}
	}, [location, params]);

	const verifyToken = async (token) => {
		try {
			// Update to match your API as shown in Postman
			// Using GET method with path parameter instead of POST with body
			const response = await fetch(
				`${API_DOMAIN}/users/confirm-account/${token}`,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
					},
				}
			);

			const data = await response.json();
			setResponseData(data);

			setLoading(false);

			if (response.ok && data.code === 200) {
				setStatus("success");
				setMessageContent(
					data.result || "Tài khoản đã được xác thực thành công!"
				);
			} else {
				setStatus("error");
				setMessageContent(
					data.message || "Mã xác thực không hợp lệ hoặc đã hết hạn."
				);
			}
		} catch (error) {
			console.error("Error verifying token:", error);
			setLoading(false);
			setStatus("error");
			setMessageContent(
				"Có lỗi xảy ra khi xác thực tài khoản. Vui lòng thử lại sau."
			);
		}
	};

	// const copyToClipboard = () => {
	// 	navigator.clipboard.writeText(token).then(() => {
	// 		setCopied(true);
	// 		message.success("Token đã được sao chép vào clipboard!");
	// 		setTimeout(() => setCopied(false), 3000);
	// 	});
	// };

	const renderContent = () => {
		if (loading) {
			return (
				<div className="loading-container">
					<Spin size="large" />
					<Paragraph className="loading-text">
						Đang xác thực tài khoản của bạn...
					</Paragraph>
				</div>
			);
		}

		if (status === "success") {
			return (
				<Result
					icon={<CheckCircleFilled className="success-icon" />}
					title="Xác thực tài khoản thành công!"
					subTitle={
						<>
							<p>{messageContent}</p>
						</>
					}
					extra={[
						// <div key="token-container" className="token-container">
						// 	<div className="token-field">
						// 		<Input value={token} readOnly className="token-input" />
						// 		<Button
						// 			type="primary"
						// 			icon={<CopyOutlined />}
						// 			onClick={copyToClipboard}
						// 			className="copy-button"
						// 		>
						// 			{copied ? "Đã sao chép" : "Sao chép"}
						// 		</Button>
						// 	</div>
						// 	<Paragraph type="secondary" className="token-help">
						// 		Hãy sử dụng token trên để hoàn tất quá trình xác thực tài khoản
						// 		của bạn trong Postman.
						// 	</Paragraph>
						// </div>,
						<Space className="action-buttons">
							
                <Button
                  key="go-to-login"
                  type="primary"
                  size="large"
                  onClick={() => {
                    // setShowLoginModal(true);
                    navigate("/");
                  }}
                >
                  Đăng nhập ngay
                </Button>
              
							<Button key="go-home" size="large" onClick={() => navigate("/")}>
								Về trang chủ
							</Button>
						</Space>,
					]}
				/>
			);
		}

		if (status === "error") {
			return (
				<Result
					status="error"
					icon={<ExclamationCircleFilled className="error-icon" />}
					title="Xác thực tài khoản thất bại"
					subTitle={messageContent}
					extra={[
						<Space className="action-buttons">
							<Button
								key="try-again"
								type="primary"
								size="large"
								onClick={() => navigate("/resend-confirmation")}
							>
								Gửi lại email xác thực
							</Button>
							<Button
								key="contact"
								size="large"
								onClick={() => navigate("/support")}
							>
								Liên hệ hỗ trợ
							</Button>
						</Space>,
					]}
				/>
			);
		}
	};

	return (
		<div className="confirmation-page">
			<Card className="confirmation-card">
				<div className="card-header">
					<MailOutlined className="mail-icon" />
					<Title level={2}>Xác nhận tài khoản</Title>
				</div>

				{renderContent()}

				{!loading && (
					<div className="verification-steps">
						<Title level={4}>Quá trình xác thực</Title>
						<Steps
							current={status === "success" ? 3 : 2}
							className="steps-container"
						>
							<Step
								title="Đăng ký"
								description="Hoàn thành đăng ký"
								icon={<UserOutlined />}
								status="finish"
							/>
							<Step
								title="Nhận email"
								description="Kiểm tra hộp thư"
								icon={<MailOutlined />}
								status="finish"
							/>
							<Step
								title="Xác thực"
								description="Xác nhận tài khoản"
								icon={<SafetyOutlined />}
								status={status === "success" ? "finish" : "error"}
							/>
							<Step
								title="Hoàn tất"
								description="Bắt đầu sử dụng"
								icon={<CheckOutlined />}
								status={status === "success" ? "finish" : "wait"}
							/>
						</Steps>
					</div>
				)}

				<div className="support-section">
					<Paragraph type="secondary">
						Nếu bạn gặp khó khăn trong quá trình xác thực, vui lòng liên hệ với
						đội hỗ trợ của chúng tôi qua email{" "}
						<Text strong copyable>
							support@ttcsdoc.vn
						</Text>{" "}
						hoặc hotline <Text strong>1900 xxxx</Text>
					</Paragraph>
				</div>
			</Card>
		</div>
	);
};

export default ConfirmAccount;
