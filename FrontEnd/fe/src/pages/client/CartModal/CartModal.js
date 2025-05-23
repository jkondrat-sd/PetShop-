import React, { useState, useEffect } from 'react';
import { Modal, Button, InputNumber, Empty, Divider, notification } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'; 
import './CartModal.scss';

const CartModal = ({ visible, onClose }) => {
  const navigate = useNavigate(); // Thêm dòng này
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart items from localStorage when component mounts or modal becomes visible
  useEffect(() => {
    if (visible) {
      loadCartItems();
    }
  }, [visible]);

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  };

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    updateCart(updatedCart);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    updateCart(updatedCart);
    notification.success({
      message: 'Item removed from cart',
      placement: 'bottomRight'
    });
  };

  const calculateItemTotal = (price, quantity) => {
    return (parseFloat(price.replace(/,/g, '')) * quantity).toFixed(2);
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(calculateItemTotal(item.price, item.quantity));
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    // Implement checkout logic
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      notification.success({
        message: 'Checkout initiated',
        description: 'Redirecting to checkout page...',
        placement: 'bottomRight'
      });
      // Navigate to checkout page
      navigate('/check-out');
    }, 1000);
  };

  return (
    <Modal
      title={<div className="cart-modal-title">
        <ShoppingCartOutlined /> Shopping Cart
        <span className="cart-item-count">{cartItems.length} items</span>
      </div>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      className="cart-modal"
    >
      <div className="cart-modal-content">
        {cartItems.length === 0 ? (
          <Empty 
            description="Your cart is empty" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="empty-cart"
          />
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    
                    <div className="cart-item-quantity">
                      <Button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="quantity-btn"
                      >
                        -
                      </Button>
                      
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(item.id, value)}
                        className="quantity-input"
                      />
                      
                      <Button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="cart-item-price-section">
                    <div className="cart-item-price">
                      X {item.price} $
                    </div>
                    <Button 
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(item.id)}
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
                <span className="total-price">{calculateCartTotal()} $</span>
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
                  Check out
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