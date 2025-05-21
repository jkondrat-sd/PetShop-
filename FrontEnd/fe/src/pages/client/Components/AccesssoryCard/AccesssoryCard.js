import React, { useState, useEffect, useRef } from 'react';
import { Button, Badge, Tooltip, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import 'animate.css';
import styles from './AccesssoryCard.module.scss';

const AccessoryCard = ({ 
  id, 
  name, 
  image, 
  categoryName = 'Dog Food', 
  size = '385g', 
  price = '30', 
  stockQuantity = 10,
  onAddToCart 
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

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id, name, price });
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`${styles['accessory-card']} ${isVisible ? 'animate__animated animate__fadeIn' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles['accessory-card__inner']}>
        <div className={styles['accessory-card__image']}>
          <Badge.Ribbon 
            text={stockQuantity > 0 ? 'In Stock' : 'Out of Stock'} 
            color={stockQuantity > 0 ? '#52c41a' : '#ff4d4f'}
            className={styles['accessory-card__stock-badge']}
          >
            <img 
              src={image} 
              alt={name} 
              className={`${styles['accessory-card__img']} ${isHovered ? styles['accessory-card__img--zoomed'] : ''}`} 
            />
          </Badge.Ribbon>
        </div>
        
        <h3 className={styles['accessory-card__name']}>{name}</h3>
        
        <div className={styles['accessory-card__details']}>
          <div className={styles['accessory-card__detail']}>
            <Tag color="#108ee9">{categoryName}</Tag>
            <span>Size: {size}</span>
          </div>
        </div>
        
        <div className={styles['accessory-card__footer']}>
          <div className={styles['accessory-card__price']}>
            {price} $
          </div>
          
          <Tooltip title={stockQuantity <= 0 ? 'Out of stock' : 'Add to cart'}>
            <Button 
              type="primary"
              shape="round"
              icon={<ShoppingCartOutlined />} 
              className={`${styles['accessory-card__button']} ${isVisible ? 'animate__animated animate__pulse animate__delay-1s' : ''}`}
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