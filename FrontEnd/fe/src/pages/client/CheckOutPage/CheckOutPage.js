import React, { useState, useEffect } from "react";
import {
	Row,
	Col,
	Form,
	Input,
	Button,
	Select,
	Divider,
	InputNumber,
	Typography,
	message,
	notification,
	Space,
} from "antd";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import * as orderService from "../../../services/orderService";
import * as cartService from "../../../services/cartService";
import "./CheckOutPage.scss";

const { Title, Text } = Typography;
const { Option } = Select;

const CheckOutPage = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [promoCode, setPromoCode] = useState("");
	const [discount, setDiscount] = useState(0);
	const [shippingMethod, setShippingMethod] = useState("standard");
	const [shippingCost, setShippingCost] = useState(15);

	// Load cart items when component mounts
	useEffect(() => {
		loadCartItems();
		// Check if user is logged in - sửa phần này
		const token = document.cookie.includes("token=");
		if (!token) {
			notification.warning({
				message: "Authentication Required",
				description: "Please login to proceed with checkout",
			});
			navigate("/login", { state: { from: "/check-out" } }); // Sửa đúng path
		}
	}, [navigate]);

	const loadCartItems = async () => {
		try {
			const res = await cartService.getCart();
			const items = res.data?.items || [];
			if (items.length === 0) {
				notification.warning({
					message: "Empty Cart",
					description: "Please add products to your cart before checkout",
				});
				navigate("/");
				return;
			}
			setCartItems(items);
		} catch (error) {
			console.error("Error loading cart from API:", error);
			notification.error({
				message: "Error",
				description: "Failed to load cart data",
			});
			navigate("/");
		}
	};

	const handleQuantityChange = async (itemId, newQuantity) => {
		if (newQuantity < 1) return;
		const item = cartItems.find((i) => i.id === itemId);
		if (!item) return;
		await cartService.addToCart({
			type: item.type || "pet",
			itemId: Number(item.id),
			quantity: newQuantity,
		});
		loadCartItems();
		window.dispatchEvent(new Event("cartUpdated"));
	};

	const handleRemoveItem = async (itemId) => {
		// Đặt quantity = 0 để xóa
		const item = cartItems.find((i) => i.id === itemId);
		if (!item) return;
		await cartService.addToCart({
			type: item.type || "pet",
			itemId: Number(item.id),
			quantity: 0,
		});
		loadCartItems();
		window.dispatchEvent(new Event("cartUpdated"));
	};

	const calculateItemTotal = (item) => {
		return Number(item.price) * item.quantity;
	};

	const calculateSubtotal = () => {
		return cartItems.reduce((total, item) => {
			return total + calculateItemTotal(item);
		}, 0);
	};

	const calculateTotal = () => {
		const subtotal = calculateSubtotal();
		return (subtotal + shippingCost - discount).toFixed(2);
	};

	const handleShippingMethodChange = (value) => {
		setShippingMethod(value);
		if (value === "standard") {
			setShippingCost(15);
		} else if (value === "express") {
			setShippingCost(30);
		}
	};

	const handleApplyPromoCode = () => {
		// Here you would typically validate the promo code with your backend
		if (promoCode === "DISCOUNT20") {
			const discountAmount = calculateSubtotal() * 0.2;
			setDiscount(discountAmount);
			message.success("Promo code applied successfully!");
		} else {
			message.error("Invalid promo code!");
		}
	};

	const onFinish = async (values) => {
		setLoading(true);
		try {
			// Check if cart is empty first
			if (!cartItems.length) {
				notification.error({
					message: "Empty Cart",
					description: "Your cart is empty. Please add items before checkout.",
				});
				navigate("/");
				return;
			}

			// Transform cart items into the EXACT format expected by backend
			const items = cartItems.map((item) => ({
				type: item.type || "pet", // Make sure this is either "pet" or "accessory"
				itemId: Number(item.id), // Convert to number explicitly
				quantity: Number(item.quantity), // Convert to number explicitly
			}));

			// Create order data structure that matches the backend OrderRequest exactly
			const orderData = {
				shipName: values.fullName,
				shipAddress: `${values.address}, ${values.city}`,
				freight: Number(shippingCost), // Convert to number explicitly
				paymentMethod: values.paymentMethod,
				items: items, // Include the items in the request
			};

			// Log the exact data being sent for debugging
			console.log("Sending order data to API:", JSON.stringify(orderData));

			const response = await orderService.createOrder(orderData);
			console.log("Order response:", response);

			// Xóa giỏ hàng trên server
			await cartService.clearCart();
			// Dispatch event AFTER successfully clearing the cart
			window.dispatchEvent(new Event("cartUpdated"));

			notification.success({
				message: "Order placed successfully!",
				description: `Your order #${response.id} has been created.`,
			});

			navigate("/order-confirmation", {
				state: {
					order: response,
					shippingAddress: `${values.address}, ${values.city}`,
					shippingMethod: shippingMethod,
				},
			});
		} catch (error) {
			console.error("Error creating order:", error);
			notification.error({
				message: "Order placement failed",
				description:
					error.response?.data?.message ||
					error.message ||
					"An error occurred while placing your order. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="checkout-page">
			<div className="container">
				<Link to="/" className="back-link">
					<ArrowLeftOutlined /> Continue Shopping
				</Link>

				<Row gutter={[32, 32]}>
					{/* Cart Items */}
					<Col xs={24} lg={14}>
						<div className="cart-section">
							<Title level={2}>Your Cart</Title>

							<div className="cart-items">
								{cartItems.map((item) => (
									<div key={item.id} className="cart-item">
										<div className="item-image">
											<img src={item.image} alt={item.name} />
										</div>

										<div className="item-details">
											<div className="item-info">
												<div className="item-type-name">
													<Text type="secondary">{item.type || "Dog"}</Text>
													<Title level={5} className="item-name">
														{item.name}
													</Title>
												</div>

												<div className="item-quantity">
													<Space>
														<Button
															onClick={() =>
																handleQuantityChange(item.id, item.quantity - 1)
															}
															disabled={item.quantity <= 1}
														>
															-
														</Button>
														<InputNumber
															min={1}
															value={item.quantity}
															onChange={(value) =>
																handleQuantityChange(item.id, value)
															}
															controls={false}
															className="quantity-input"
														/>
														<Button
															onClick={() =>
																handleQuantityChange(item.id, item.quantity + 1)
															}
														>
															+
														</Button>
													</Space>
												</div>
											</div>

											<div className="item-price-actions">
												<Text className="item-price">$ {item.price}</Text>
												<Button
													icon={<DeleteOutlined />}
													onClick={() => handleRemoveItem(item.id)}
													type="text"
													danger
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Shipping Form */}
						<div className="shipping-form-section">
							<Title level={3}>Shipping Information</Title>
							<Form
								form={form}
								layout="vertical"
								onFinish={onFinish}
								initialValues={{
									paymentMethod: "cod",
								}}
							>
								<Form.Item
									name="email"
									label="Email Address"
									rules={[
										{
											required: true,
											message: "Please enter your email!",
										},
										{
											type: "email",
											message: "Please enter a valid email!",
										},
									]}
								>
									<Input placeholder="example@email.com" />
								</Form.Item>

								<Row gutter={16}>
									<Col xs={24} sm={12}>
										<Form.Item
											name="fullName"
											label="Full Name"
											rules={[
												{
													required: true,
													message: "Please enter your full name!",
												},
											]}
										>
											<Input placeholder="John Doe" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={12}>
										<Form.Item
											name="phone"
											label="Phone Number"
											rules={[
												{
													required: true,
													message: "Please enter your phone number!",
												},
												{
													pattern: /^[0-9]{10,11}$/,
													message: "Invalid phone number!",
												},
											]}
										>
											<Input placeholder="0901234567" />
										</Form.Item>
									</Col>
								</Row>

								<Form.Item
									name="address"
									label="Address"
									rules={[
										{ required: true, message: "Please enter your address!" },
									]}
								>
									<Input placeholder="123 Main St" />
								</Form.Item>

								<Row gutter={16}>
									<Col xs={24} sm={12}>
										<Form.Item
											name="city"
											label="City"
											rules={[
												{ required: true, message: "Please enter your city!" },
											]}
										>
											<Input placeholder="Ho Chi Minh City" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={12}>
										<Form.Item
											name="zipCode"
											label="Zip Code"
											rules={[{ required: false }]}
										>
											<Input placeholder="700000" />
										</Form.Item>
									</Col>
								</Row>

								<Form.Item name="shippingMethod" label="Shipping Method">
									<Select
										value={shippingMethod}
										onChange={handleShippingMethodChange}
									>
										<Option value="standard">Standard Delivery - $15</Option>
										<Option value="express">Express Delivery - $30</Option>
									</Select>
								</Form.Item>

								<Form.Item
									name="paymentMethod"
									label="Payment Method"
									rules={[
										{
											required: true,
											message: "Please select a payment method!",
										},
									]}
								>
									<Select>
										<Option value="cod">Cash On Delivery (COD)</Option>
										<Option value="bank_transfer">Bank Transfer</Option>
										<Option value="credit_card">Credit/Debit Card</Option>
										<Option value="momo">MoMo Wallet</Option>
									</Select>
								</Form.Item>

								<Form.Item name="notes" label="Order Notes">
									<Input.TextArea
										rows={4}
										placeholder="Additional information for your order"
									/>
								</Form.Item>
							</Form>
						</div>
					</Col>

					{/* Order Summary */}
					<Col xs={24} lg={10}>
						<div className="order-summary-section">
							<Title level={3}>Order Summary</Title>

							<div className="summary-content">
								<div className="summary-row">
									<Text>Products ({cartItems.length})</Text>
									<Text strong>${calculateSubtotal().toFixed(2)}</Text>
								</div>

								<div className="summary-row">
									<Text>Shipping Fee</Text>
									<Text strong>${shippingCost.toFixed(2)}</Text>
								</div>

								{discount > 0 && (
									<div className="summary-row discount">
										<Text>Discount</Text>
										<Text type="success">-${discount.toFixed(2)}</Text>
									</div>
								)}

								<div className="promo-code-section">
									<Input
										placeholder="Enter promo code"
										value={promoCode}
										onChange={(e) => setPromoCode(e.target.value)}
										addonAfter={
											<Button
												type="text"
												onClick={handleApplyPromoCode}
												className="apply-code-btn"
											>
												Apply
											</Button>
										}
									/>
								</div>

								<Divider />

								<div className="summary-row total">
									<Text strong>Total</Text>
									<Text strong className="total-price">
										${calculateTotal()}
									</Text>
								</div>

								<div className="checkout-btn-container">
									<Button
										type="primary"
										size="large"
										block
										onClick={() => form.submit()}
										loading={loading}
									>
										Place Order
									</Button>
								</div>

								<Text type="secondary" className="terms-text">
									By placing an order, you agree to our terms and conditions.
								</Text>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default CheckOutPage;
