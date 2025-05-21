import React, { useState, useEffect, useRef } from 'react';
import { Button, Badge, Tooltip } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faClock } from '@fortawesome/free-solid-svg-icons';
import 'animate.css';
import styles from './PetCard.scss';

const PetCard = ({ 
  id, 
  name, 
  image, 
  gender = 'Male', 
  age = '2 months', 
  price = '3,000', 
  onAddToCart 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Function to check if element is in viewport
  const isInViewport = (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
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

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id, name, price });
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`${styles['pet-card']} ${isVisible ? 'animate__animated animate__fadeInUp' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles['pet-card__inner']}>
        <div className={styles['pet-card__image']}>
          <Badge.Ribbon 
            text={gender === 'Male' ? 'Male' : 'Female'} 
            color={gender === 'Male' ? '#003459' : '#FF64B4'}
            className={styles['pet-card__gender-badge']}
          >
            <img 
              src={image} 
              alt={name} 
              className={`${styles['pet-card__img']} ${isHovered ? styles['pet-card__img--zoomed'] : ''}`} 
            />
          </Badge.Ribbon>
        </div>
        
        <h3 className={styles['pet-card__name']}>{name}</h3>
        
        <div className={styles['pet-card__details']}>
          <div className={styles['pet-card__detail']}>
            <FontAwesomeIcon 
              icon={gender === 'Male' ? faMars : faVenus} 
              className={styles['pet-card__icon']} 
            />
            <span>Gender: {gender}</span>
          </div>
          
          <div className={styles['pet-card__detail']}>
            <FontAwesomeIcon 
              icon={faClock} 
              className={styles['pet-card__icon']} 
            />
            <span>Age: {age}</span>
          </div>
        </div>
        
        <div className={styles['pet-card__footer']}>
          <div className={styles['pet-card__price']}>
            {price} $
          </div>
          
          <Tooltip title="Add to cart">
            <Button 
              type="primary"
              shape="round"
              icon={<ShoppingCartOutlined />} 
              className={`${styles['pet-card__button']} ${isVisible ? 'animate__animated animate__pulse animate__delay-1s' : ''}`}
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