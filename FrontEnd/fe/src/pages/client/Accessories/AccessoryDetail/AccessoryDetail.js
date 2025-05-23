import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Button, 
  Typography, 
  Divider, 
  Descriptions, 
  Space, 
  Skeleton,
  Tag,
  message
} from 'antd';
import { 
  ShoppingCartOutlined, 
  ShareAltOutlined, 
  PlayCircleOutlined
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebook, 
  faFacebookMessenger, 
  faInstagram, 
  faXTwitter 
} from '@fortawesome/free-brands-svg-icons';
import Slider from 'react-slick';
import AccessoryCard from '../../Components/AccesssoryCard/AccesssoryCard';
import 'animate.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './AccessoryDetail.scss';
import { addToCart } from "../../../../services/cartService";
import * as accessoryService from "../../../../services/accessoryService";

const { Title, Text, Paragraph } = Typography;

const AccessoryDetail = () => {
  const { id } = useParams();
  const [accessory, setAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [relatedAccessories, setRelatedAccessories] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchAccessoryDetails = async () => {
      setLoading(true);
      try {
        // Call the API to get accessory details
        const response = await accessoryService.getAccessoryById(id);
        
        setAccessory(response);
        
        // Set the main image to the thumbnail or first image
        if (response.images && response.images.length > 0) {
          setMainImage(response.images[0]);
        } else if (response.thumbnail) {
          setMainImage(response.thumbnail);
        }
        
        // Fetch related accessories from the same category
        const relatedResponse = await accessoryService.getAccessories({
          status: "active", 
          categoryId: response.categoryId,
          page: 0,
          size: 4
        });
        
        // Filter out the current accessory
        const filtered = relatedResponse.content.filter(item => 
          item.accessoryId.toString() !== id.toString()
        );
        
        setRelatedAccessories(filtered);
      } catch (error) {
        console.error("Error fetching accessory details:", error);
        message.error("Could not load accessory details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccessoryDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!accessory) return;
    
    try {
      // Check stock quantity
      if (accessory.stockQuantity < quantity) {
        return message.error("Not enough items in stock!");
      }
      
      await addToCart({
        type: "accessory",
        itemId: accessory.accessoryId,
        quantity: quantity
      });
      
      window.dispatchEvent(new Event("cartUpdated"));
      message.success(`${accessory.accessoryName} has been added to your cart!`);
    } catch (error) {
      message.error("Failed to add to cart. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      // Navigate to checkout
      window.location.href = "/check-out";
    } catch (error) {
      console.error("Error during buy now:", error);
    }
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (accessory && newQuantity > accessory.stockQuantity) {
      message.warning(`Only ${accessory.stockQuantity} items available in stock`);
      setQuantity(accessory.stockQuantity);
      return;
    }
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="accessory-detail">
        <div className="container">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={24} md={12}>
              <Skeleton.Image active style={{ width: '100%', height: 400 }} />
              <Row gutter={8} style={{ marginTop: 16 }}>
                {[1, 2, 3, 4].map(i => (
                  <Col span={6} key={i}>
                    <Skeleton.Image active />
                  </Col>
                ))}
              </Row>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Skeleton active paragraph={{ rows: 10 }} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="accessory-detail">
        <div className="container">
          <Title level={3}>Accessory not found!</Title>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Product Detail Section */}
      <section className="accessory-detail">
        <div className="container">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={24} md={12} className="animate__animated animate__fadeInLeft">
              <div className="image-product" id="mainProduct">
                <div className="wrapper">
                  <img 
                    src={mainImage} 
                    alt={accessory.accessoryName} 
                    id="mainPhoto" 
                    className="animate__animated animate__zoomIn"
                  />
                </div>
                
                {accessory.images && accessory.images.length > 0 && (
                  <Row className="image-wrapper">
                    {accessory.images.map((image, index) => (
                      <Col key={index}>
                        <img
                          className={`imgCarousel ${mainImage === image ? 'active' : ''}`}
                          src={image}
                          alt={`${accessory.accessoryName} ${index + 1}`}
                          onClick={() => handleThumbnailClick(image)}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </Col>

            <Col xs={24} sm={24} md={12} className="animate__animated animate__fadeInRight">
              <div className="accessory-meta">
                <Text className="id-product">#{accessory.accessoryId}</Text>
                <Tag color="blue" className="category-tag">{accessory.category}</Tag>
                {accessory.stockQuantity > 0 ? (
                  <Tag color="green" className="stock-tag">In Stock</Tag>
                ) : (
                  <Tag color="red" className="stock-tag">Out of Stock</Tag>
                )}
              </div>
              
              <Title level={2} className="product-name">{accessory.accessoryName}</Title>
              <div className="price">${accessory.unitPrice.toLocaleString()}</div>
              
              {accessory.stockQuantity > 0 && (
                <div className="quantity-selector">
                  <span>Quantity:</span>
                  <Space>
                    <Button 
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="quantity-display">{quantity}</span>
                    <Button 
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= accessory.stockQuantity}
                    >
                      +
                    </Button>
                  </Space>
                  <span className="stock-count">
                    {accessory.stockQuantity} available
                  </span>
                </div>
              )}

              <div className="inner-button">
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handleBuyNow}
                  disabled={accessory.stockQuantity === 0}
                  className="animate__animated animate__pulse animate__infinite animate__slower"
                >
                  Buy Now
                </Button>
                <Button 
                  type="default" 
                  size="large" 
                  icon={<ShoppingCartOutlined />} 
                  onClick={handleAddToCart}
                  disabled={accessory.stockQuantity === 0}
                  className="animate__animated animate__fadeIn animate__delay-1s"
                >
                  Add to Cart
                </Button>
              </div>

              <Divider />
              
              <div className="product-description">
                <Title level={4}>Description</Title>
                <Paragraph>
                  {accessory.description || "No description available for this product."}
                </Paragraph>
              </div>

              <div className="product-info">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Category">{accessory.category}</Descriptions.Item>
                  <Descriptions.Item label="Stock Quantity">{accessory.stockQuantity}</Descriptions.Item>
                  <Descriptions.Item label="Item ID">{accessory.accessoryId}</Descriptions.Item>
                </Descriptions>
              </div>

              <div className="share-product">
                <ShareAltOutlined />
                <div className="title">Share:</div>
                <div className="socials">
                  <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                  <a href="#"><FontAwesomeIcon icon={faFacebookMessenger} /></a>
                  <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                  <a href="#"><FontAwesomeIcon icon={faXTwitter} /></a>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedAccessories.length > 0 && (
        <section className="related-accessories">
          <div className="container">
            <Row className="animate__animated animate__fadeIn">
              <Col xs={24} className="related-header">
                <Row>
                  <Col xs={24} sm={24} md={18} xl={20} className="content">
                    <Title level={5}>You may also like</Title>
                    <Title level={2}>Related Products</Title>
                  </Col>
                  <Col xs={24} sm={24} md={6} xl={4} className="inner-button">
                    <Button type="default" size="large" href="/accessories">
                      View more <PlayCircleOutlined />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            
            <Row gutter={[16, 24]}>
              {relatedAccessories.map((item) => (
                <Col key={item.accessoryId} xs={24} sm={12} md={8} lg={6}>
                  <AccessoryCard 
                    id={item.accessoryId}
                    name={item.accessoryName}
                    image={item.thumbnail}
                    categoryName={item.category}
                    price={item.unitPrice.toString()}
                    stockQuantity={item.stockQuantity}
                    onAddToCart={async () => {
                      try {
                        await addToCart({
                          type: "accessory",
                          itemId: item.accessoryId,
                          quantity: 1,
                        });
                        window.dispatchEvent(new Event("cartUpdated"));
                        message.success(`${item.accessoryName} has been added to your cart!`);
                      } catch (error) {
                        message.error("Failed to add to cart. Please try again.");
                      }
                    }}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}
    </>
  );
};

export default AccessoryDetail;