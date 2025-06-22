import React, { useState, useEffect, useCallback } from "react";
import {
	Modal,
	Button,
	InputNumber,
	Empty,
	Divider,
	notification,
	Spin,
} from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { getCart, addToCart } from "~/services/cartService";
import "./CartModal.scss";

const CartModal = ({ visible, onClose }) => {
	const navigate = useNavigate();
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalAmount, setTotalAmount] = useState(0);
	const [totalItems, setTotalItems] = useState(0);

	// Lấy giỏ hàng từ API - sử dụng useCallback để tránh tạo function mới mỗi render
	const loadCartItems = useCallback(async () => {
		// console.log("loadCartItems called, visible:", visible);
		setLoading(true);
		try {
			const response = await getCart();
			// console.log("Chi tiết dữ liệu giỏ hàng:", response);

			if (response && response.success) {
				// Đảm bảo dữ liệu luôn tồn tại
				const data = response.data || {
					items: [],
					totalAmount: 0,
					totalItems: 0,
				};
				const items = data.items || [];

				// console.log("Các sản phẩm trong giỏ:", items);

				setCartItems(items);
				setTotalAmount(data.totalAmount || 0);
				setTotalItems(data.totalItems || 0);
				// console.log("Cart data updated in state:", items.length, "items");
			} else {
				// Trường hợp không có response.success
				console.log("Invalid response format, setting empty cart");
				setCartItems([]);
				setTotalAmount(0);
				setTotalItems(0);
			}
		} catch (error) {
			console.error("Lỗi khi tải giỏ hàng từ API:", error);
			// Trong trường hợp lỗi - thử dùng localStorage
			try {
				const backupCart = localStorage.getItem("cartBackup");
				if (backupCart) {
					const cart = JSON.parse(backupCart);
					// console.log("Using backup cart from localStorage:", cart);
					setCartItems(cart.items || []);
					setTotalAmount(cart.totalAmount || 0);
					setTotalItems(cart.totalItems || 0);
					return;
				}
			} catch (storageError) {
				// console.error("Lỗi đọc từ localStorage:", storageError);
			}

			setCartItems([]);
			setTotalAmount(0);
			setTotalItems(0);

			notification.error({
				message: "Failed to load cart",
				description: "Please try again later",
				placement: "bottomRight",
			});
		} finally {
			setLoading(false);
		}
	}, [visible]);

	// Cập nhật số lượng sản phẩm
	const handleQuantityChange = async (item, newQuantity) => {
		if (newQuantity < 1) return;

		try {
			// Gọi API cập nhật số lượng
			const response = await addToCart({
				type: item.itemType, // Loại sản phẩm (pet/accessory)
				itemId: item.itemId,
				quantity: newQuantity,
			});

			// console.log("Phản hồi cập nhật số lượng:", response);

			// Tải lại giỏ hàng để cập nhật dữ liệu
			await loadCartItems();
		} catch (error) {
			console.error("Lỗi khi cập nhật số lượng:", error);
			notification.error({
				message: "Error updating quantity",
				description: error.message || "Please try again",
				placement: "bottomRight",
			});
		}
	};

	// Xóa sản phẩm khỏi giỏ hàng
	const handleRemoveItem = async (item) => {
		try {
			// Gọi API xóa khỏi giỏ hàng (gửi quantity=0)
			const response = await addToCart({
				type: item.itemType,
				itemId: item.itemId,
				quantity: 0,
			});

			// console.log("Phản hồi xóa sản phẩm:", response);

			// Tải lại giỏ hàng
			await loadCartItems();

			notification.success({
				message: "Item removed from cart",
				placement: "bottomRight",
			});
		} catch (error) {
			console.error("Lỗi khi xóa sản phẩm:", error);
			notification.error({
				message: "Failed to remove item",
				description: error.message || "Please try again",
				placement: "bottomRight",
			});
		}
	};

	// Chuyển đến trang thanh toán
	const handleCheckout = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			onClose();
			navigate("/check-out");
		}, 500);
	};

	// Tải giỏ hàng khi modal hiện
	useEffect(() => {
		// console.log("Modal visibility changed:", visible);
		if (visible) {
			loadCartItems();
		}
	}, [visible, loadCartItems]);

	// Cập nhật giỏ hàng khi có sự kiện cartUpdated
	useEffect(() => {
		const handleCartUpdate = () => {
			// console.log("Cart update event received");
			if (visible) {
				// Thêm độ trễ nhỏ để đảm bảo dữ liệu đã được cập nhật ở backend
				setTimeout(() => {
					loadCartItems();
				}, 300);
			}
		};

		window.addEventListener("cartUpdated", handleCartUpdate);

		return () => {
			window.removeEventListener("cartUpdated", handleCartUpdate);
		};
	}, [visible, loadCartItems]);

	return (
		<Modal
			title={
				<div className="cart-modal-title">
					<ShoppingCartOutlined /> Shopping Cart
					<span className="cart-item-count">{totalItems || 0} items</span>
				</div>
			}
			open={visible}
			onCancel={onClose}
			footer={null}
			width={600}
			className="cart-modal"
		>
			<div className="cart-modal-content">
				{loading ? (
					<div
						className="loading-container"
						style={{ textAlign: "center", padding: "30px" }}
					>
						<Spin size="large" />
						<p>Loading your cart...</p>
					</div>
				) : cartItems.length === 0 ? (
					<>
						<Empty
							description="Your cart is empty"
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							className="empty-cart"
						/>

					</>
				) : (
					<>
						<div className="cart-items">
							{cartItems.map((item) => (
								<div
									key={`${item.itemType}-${item.itemId}`}
									className="cart-item"
								>
									<div className="cart-item-image">
										<img src={item.thumbnail || item.image} alt={item.name} />
									</div>

									<div className="cart-item-details">
										<h3 className="cart-item-name">{item.name}</h3>
										<p className="cart-item-type">
											{item.itemType === "pet" ? "Pet" : "Accessory"}
										</p>

										<div className="cart-item-quantity">
											{/* Chỉ cho phép thay đổi số lượng với phụ kiện, thú cưng luôn là 1 */}
											{item.itemType === "accessory" ? (
												<>
													<Button
														onClick={() =>
															handleQuantityChange(item, item.quantity - 1)
														}
														disabled={item.quantity <= 1}
														className="quantity-btn"
													>
														-
													</Button>

													<InputNumber
														min={1}
														value={item.quantity}
														onChange={(value) =>
															handleQuantityChange(item, value)
														}
														className="quantity-input"
													/>

													<Button
														onClick={() =>
															handleQuantityChange(item, item.quantity + 1)
														}
														className="quantity-btn"
													>
														+
													</Button>
												</>
											) : (
												<span>Quantity: 1</span>
											)}
										</div>
									</div>

									<div className="cart-item-price-section">
										<div className="cart-item-price">{item.price} $</div>
										<div className="cart-item-subtotal">
											{item.subtotal || item.price * item.quantity} $
										</div>
										<Button
											danger
											icon={<DeleteOutlined />}
											onClick={() => handleRemoveItem(item)}
											className="remove-item-btn"
											type="text"
										/>
									</div>
								</div>
							))}
						</div>

						<Divider />

						<div className="cart-summary">
							<div className="cart-total">
								<span className="total-label">Total</span>
								<span className="total-price">{totalAmount} $</span>
							</div>

							<div className="cart-actions">
								<Link to="/cart">
									<Button className="view-cart-btn" onClick={onClose}>
										View cart
									</Button>
								</Link>

								<Button
									type="primary"
									className="checkout-btn"
									onClick={handleCheckout}
									loading={loading}
								>
									Checkout
								</Button>

							</div>
						</div>
					</>
				)}
			</div>
		</Modal>
	);
};

export default CartModal;
