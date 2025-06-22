import React, { useState, useEffect, useRef } from "react";
import { Button, Badge, Tooltip, notification } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faVenus, faClock } from "@fortawesome/free-solid-svg-icons";
import "animate.css";
import styles from "./PetCard.module.scss";
import { addToCart } from "~/services/cartService";
import { Link } from "react-router-dom";

const PetCard = ({
	id,
	name,
	image,
	gender = "MALE",
	age = "2 months",
	price = "3,000",
	onAddToCart,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const cardRef = useRef(null);

	// Helper function to get gender display
	const getGenderDisplay = (gender) => {
		const genderMap = {
			'MALE': 'Male',
			'FEMALE': 'Female',
			'Male': 'Male',
			'Female': 'Female'
		};
		return genderMap[gender] || 'Unknown';
	};

	// Helper function to get gender color
	const getGenderColor = (gender) => {
		const colorMap = {
			'MALE': '#003459',
			'FEMALE': '#FF64B4',
			'Male': '#003459',
			'Female': '#FF64B4'
		};
		return colorMap[gender] || '#666666';
	};

	// Helper function to get gender icon
	const getGenderIcon = (gender) => {
		const upperGender = gender?.toUpperCase();
		return upperGender === 'MALE' ? faMars : faVenus;
	};

	// Function to check if element is in viewport
	const isInViewport = (element) => {
		if (!element) return false;
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	};

	// Set up observer to trigger animation when card comes into view
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.1 }
		);

		if (cardRef.current) {
			observer.observe(cardRef.current);
		}

		return () => {
			if (cardRef.current) {
				observer.unobserve(cardRef.current);
			}
		};
	}, []);

	// Cập nhật hàm handleAddToCart
	const handleAddToCart = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			// Kiểm tra token
			const tokenCookie = document.cookie
				.split("; ")
				.find((row) => row.startsWith("token="));
			if (!tokenCookie) {
				notification.warn({
					message: "Login Required",
					description: "Please login to add items to your cart",
					placement: "bottomRight",
				});
				return;
			}

			// Chuyển đổi id sang số (nếu nó là chuỗi)
			const numericId = Number(id) || id;

			// Hiện thông báo đang xử lý
			notification.info({
				message: "Adding to cart...",
				description: `Adding ${name} to your cart`,
				placement: "bottomRight",
				duration: 1,
			});

			// Gọi API với dữ liệu đã chuyển đổi
			const response = await addToCart({
				type: "pet",
				itemId: numericId,
				quantity: 1,
			});

			if (response && response.success) {
				notification.success({
					message: "Added to cart",
					description: `${name} has been added to your cart`,
					placement: "bottomRight",
				});

				// Thêm một lần nữa với timeout dài hơn để đảm bảo event được xử lý
				setTimeout(() => {
					console.log("Dispatching delayed cartUpdated event");
					window.dispatchEvent(new Event("cartUpdated"));
				}, 500);
			} else {
				throw new Error(response?.message || "Failed to add to cart");
			}
		} catch (error) {
			console.error("Add to cart error:", error);

			notification.error({
				message: "Failed to add to cart",
				description: error.message || "Please try again",
				placement: "bottomRight",
			});
		}
	};

	return (
		<div
			ref={cardRef}
			className={`${styles["pet-card"]} ${
				isVisible ? "animate__animated animate__fadeInUp" : ""
			}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className={styles["pet-card__inner"]}>
				{/* Clickable area for pet details */}
				<div className={styles["pet-card__content"]}>
					<Link to={`/pets/${id}`} className={styles["pet-card__link"]}>
						<div className={styles["pet-card__image"]}>
							<Badge.Ribbon
								text={getGenderDisplay(gender)}
								color={getGenderColor(gender)}
								className={styles["pet-card__gender-badge"]}
							>
								<img
									src={image}
									alt={name}
									className={`${styles["pet-card__img"]} ${
										isHovered ? styles["pet-card__img--zoomed"] : ""
									}`}
								/>
							</Badge.Ribbon>
						</div>

						<h3 className={styles["pet-card__name"]}>{name}</h3>

						<div className={styles["pet-card__details"]}>
							<div className={styles["pet-card__detail"]}>
								<FontAwesomeIcon
									icon={getGenderIcon(gender)}
									className={styles["pet-card__icon"]}
								/>
								<span>Gender: {getGenderDisplay(gender)}</span>
							</div>

							<div className={styles["pet-card__detail"]}>
								<FontAwesomeIcon
									icon={faClock}
									className={styles["pet-card__icon"]}
								/>
								<span>Age: {age}</span>
							</div>
						</div>
					</Link>
				</div>

				{/* Separate footer area with price and button */}
				<div className={styles["pet-card__footer"]}>
					<div className={styles["pet-card__price"]}>{price} $</div>

					<Tooltip title="Add to cart">
						<Button
							type="primary"
							shape="round"
							icon={<ShoppingCartOutlined />}
							className={`${styles["pet-card__button"]} ${
								isVisible
									? "animate__animated animate__pulse animate__delay-1s"
									: ""
							}`}
							onClick={handleAddToCart}
						>
							Add to cart
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

export default PetCard;
