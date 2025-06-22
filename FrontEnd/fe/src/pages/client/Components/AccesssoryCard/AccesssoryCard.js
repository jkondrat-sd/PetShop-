import React, { useState, useEffect, useRef } from "react";
import { Button, Tooltip, Tag, notification } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "animate.css";
import styles from "./AccesssoryCard.module.scss";
import { addToCart } from "~/services/cartService";
import { Link } from "react-router-dom";

const AccessoryCard = ({
	id,
	name,
	image,
	categoryName = "Dog Food",
	size = "385g",
	price = "30",
	stockQuantity = 10,
	onAddToCart,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const cardRef = useRef(null);

	// Sử dụng Intersection Observer để phát hiện khi card xuất hiện trong viewport
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

	const handleAddToCart = async () => {
		try {
			await addToCart({
				type: "accessory",
				itemId: Number(id),
				quantity: 1,
			});
			window.dispatchEvent(new Event("cartUpdated"));
			notification.success({
				message: "Added to cart",
				description: `${name} has been added to your cart`,
				placement: "bottomRight",
			});
		} catch (error) {
			notification.error({
				message: "Failed to add to cart",
				description: "Please try again",
				placement: "bottomRight",
			});
		}
	};

	return (
		<div
			ref={cardRef}
			className={`${styles["accessory-card"]} ${
				isVisible ? "animate__animated animate__fadeIn" : ""
			}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className={styles["accessory-card__inner"]}>
				<Link to={`/accessories/${id}`} style={{ textDecoration: "none" }}>
					<div className={styles["accessory-card__image"]}>
						<img
							src={image}
							alt={name}
							className={`${styles["accessory-card__img"]} ${
								isHovered ? styles["accessory-card__img--zoomed"] : ""
							}`}
						/>
					</div>

					<h3 className={styles["accessory-card__name"]}>{name}</h3>

					<div className={styles["accessory-card__details"]}>
						<div className={styles["accessory-card__detail"]}>
							<Tag color="#108ee9">{categoryName}</Tag>
							<span>Size: {size}</span>
						</div>
					</div>
				</Link>
				<div className={styles["accessory-card__footer"]}>
					<div className={styles["accessory-card__price"]}>{price} $</div>

					<Tooltip title={stockQuantity <= 0 ? "Out of stock" : "Add to cart"}>
						<Button
							type="primary"
							shape="round"
							icon={<ShoppingCartOutlined />}
							className={`${styles["accessory-card__button"]} ${
								isVisible
									? "animate__animated animate__pulse animate__delay-1s"
									: ""
							}`}
							onClick={handleAddToCart}
							disabled={stockQuantity <= 0}
						>
							Add to cart
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

export default AccessoryCard;
