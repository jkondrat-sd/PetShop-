import React, { useState } from 'react';
import { Button, Badge, Tooltip, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { WOW } from 'wowjs';
import styles from './AccessoryCard.module.scss';

// Initialize WOW.js animations
if (typeof window !== 'undefined') {
  new WOW().init();
}

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

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id, name, price });
    }
  };

  return (
    <div 
      className={`${styles['accessory-card']} wow fadeIn`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-wow-duration="0.8s"
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
          
          <Tooltip title="Add to cart">
            <Button 
              type="primary"
              shape="round"
              icon={<ShoppingCartOutlined />} 
              className={styles['accessory-card__button']}
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