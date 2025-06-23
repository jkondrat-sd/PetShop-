import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Button, 
  Typography, 
  Divider, 
  Descriptions, 
  Space, 
  Skeleton,
  message,
  notification
} from 'antd';
import { 
  ShoppingCartOutlined, 
  DollarOutlined, 
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
import PetCard from '../../Components/PetCard/PetCard';
import 'animate.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './PetDetail.scss';
import { addToCart } from "../../../../services/cartService";
import { getPetById, getPets } from "../../../../services/petService";

const { Title, Text } = Typography;

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [relatedPets, setRelatedPets] = useState([]);
  const [customerImages, setCustomerImages] = useState([
    // Có thể để ảnh khách hàng thật hoặc giữ mock nếu chưa có
    require('../../../../assets/images/img-dogs/Frame 118.png'),
    require('../../../../assets/images/img-dogs/Frame 119.png'),
    require('../../../../assets/images/img-dogs/Frame 120.png'),
    require('../../../../assets/images/img-dogs/Frame 121.png'),
  ]);

  // Settings for the customer carousel
  const customerSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  useEffect(() => {
    const fetchPetDetails = async () => {
      setLoading(true);
      try {
        const data = await getPetById(id);
        setPet(data);
        setMainImage(data.thumbnail || (data.images && data.images[0]));
      } catch (error) {
        setPet(null);
        message.error("Could not load pet details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [id]);

  // Lấy danh sách thú cưng liên quan (ví dụ: cùng loại, cùng giống, hoặc random)
  useEffect(() => {
    const fetchRelatedPets = async () => {
      try {
        const response = await getPets({ page: 0, size: 4, type: pet?.type });
        // Loại bỏ chính pet hiện tại khỏi danh sách liên quan
        const filtered = (response.content || []).filter(p => p.petId !== pet?.petId);
        setRelatedPets(filtered);
      } catch (error) {
        setRelatedPets([]);
      }
    };
    if (pet && pet.type) fetchRelatedPets();
  }, [pet]);

  const handleAddToCart = async () => {
    if (!pet) return;

    // Kiểm tra trạng thái pet
    if (pet.status !== 'available') {
      message.warn("This pet is not available for purchase");
      return;
    }
    
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

      const numericId = Number(pet.petId) || pet.petId;

      notification.info({
        message: "Adding to cart...",
        description: `Adding ${pet.petName} to your cart`,
        placement: "bottomRight",
        duration: 2,
      });

      const response = await addToCart({
        type: "pet",
        itemId: numericId,
        quantity: 1,
      });

      if (response && response.success) {
        notification.success({
          message: "Added to cart",
          description: `${pet.petName} has been added to your cart`,
          placement: "bottomRight",
        });
        setTimeout(() => {
          window.dispatchEvent(new Event("cartUpdated"));
        }, 300);
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

  const handleBuyNow = async () => {
    if (!pet) return;
    
    // Kiểm tra trạng thái pet
    if (pet.status !== 'available') {
      message.warn("This pet is not available for purchase");
      return;
    }
    
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

      const numericId = Number(pet.petId) || pet.petId;

      // First add to cart
      const response = await addToCart({
        type: "pet",
        itemId: numericId,
        quantity: 1,
      });
      
      if (response && response.success) {
        // Dispatch cart update event
        window.dispatchEvent(new Event("cartUpdated"));
        
        // Show success message
        notification.success({
          message: "Added to cart",
          description: `${pet.petName} has been added to your cart, redirecting to checkout...`,
          placement: "bottomRight",
        });
        
        // Redirect to checkout after a short delay
        setTimeout(() => {
          navigate("/check-out");
        }, 1000);
      } else {
        throw new Error(response?.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Buy now error:", error);
      notification.error({
        message: "Action Failed",
        description: error.message || "Could not add to cart. Please try again.",
        placement: "bottomRight",
      });
    }
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  if (loading || !pet) {
    return (
      <div className="product-detail">
        <div className="container">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={24} md={12}>
              <Skeleton.Image active style={{ width: '100%', height: 400 }} />
              <Row gutter={8} style={{ marginTop: 16 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Col span={4} key={i}>
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

  return (
    <>
      {/* Product Detail Section */}
      <section className="product-detail">
        <div className="container">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={24} md={12} className="animate__animated animate__fadeInLeft">
              <div className="image-product" id="mainProduct">
                <div className="wrapper">
                  <img 
                    src={mainImage} 
                    alt={pet?.petName} 
                    id="mainPhoto" 
                    className="animate__animated animate__zoomIn"
                  />
                </div>
                <Row className="image-wrapper">
                  {pet?.images?.map((image, index) => (
                    <Col key={index}>
                      <img
                        className={`imgCarousel ${mainImage === image ? 'active' : ''}`}
                        src={image}
                        alt={`${pet?.petName} ${index + 1}`}
                        onClick={() => handleThumbnailClick(image)}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>

            <Col xs={24} sm={24} md={12} className="animate__animated animate__fadeInRight">
              <Text className="id-product">#{pet?.petId}</Text>
              <Title level={2} className="product-name">{pet?.petName}</Title>
              <div className="price">${pet?.unitPrice?.toLocaleString()}</div>

              {/* Status indicator */}
              {pet?.status && (
                <div style={{ marginBottom: 16 }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '4px', 
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: pet.status === 'available' ? '#f6ffed' : '#fff2f0',
                    color: pet.status === 'available' ? '#52c41a' : '#ff4d4f',
                    border: `1px solid ${pet.status === 'available' ? '#b7eb8f' : '#ffccc7'}`
                  }}>
                    {pet.status === 'available' ? 'Available' : 'Not Available'}
                  </span>
                </div>
              )}

              <div className="inner-button">
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handleBuyNow}
                  disabled={pet?.status !== 'available'}
                  className="animate__animated animate__pulse animate__infinite animate__slower"
                >
                  Buy Now
                </Button>
                <Button 
                  type="default" 
                  size="large" 
                  icon={<ShoppingCartOutlined />} 
                  onClick={handleAddToCart}
                  disabled={pet?.status !== 'available'}
                  className="animate__animated animate__fadeIn animate__delay-1s"
                >
                  Add to Cart
                </Button>
              </div>

              <Divider />

              <div className="product-info">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Age">{pet?.age} months</Descriptions.Item>
                  <Descriptions.Item label="Weight">{pet?.weight || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Height">{pet?.height || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Gender">{pet?.gender}</Descriptions.Item>
                  <Descriptions.Item label="Breed">{pet?.breed}</Descriptions.Item>
                  <Descriptions.Item label="Status">{pet?.status}</Descriptions.Item>
                  <Descriptions.Item label="Character">{pet?.character || '-'}</Descriptions.Item>
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

      {/* Our Customers Section */}
      <section className="our-customer">
        <div className="container">
          <Row justify="center" className="animate__animated animate__fadeIn">
            <Col xs={24} sm={24} md={16} lg={12}>
              <div className="sec-heading text-center">
                <Title level={3}>Our Lovely Customer</Title>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Slider {...customerSliderSettings} className="clients-carousel">
                {customerImages.map((image, index) => (
                  <div key={index} className="inner-img">
                    <img src={image} alt={`Customer ${index + 1}`} />
                  </div>
                ))}
              </Slider>
            </Col>
          </Row>
        </div>
      </section>

      {/* More Puppies Section */}
      <section className="our-pets">
        <div className="container">
          <Row className="animate__animated animate__fadeIn">
            <Col xs={24} className="our-pets-header">
              <Row>
                <Col xs={24} sm={24} md={18} xl={20} className="content">
                  <Title level={5}>Whats new?</Title>
                  <Title level={2}>See More Puppies</Title>
                </Col>
                <Col xs={24} sm={24} md={6} xl={4} className="inner-button">
                  <Button type="default" size="large">
                    View more <PlayCircleOutlined />
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={[16, 24]}>
            {relatedPets.map((relatedPet) => (
              <Col key={relatedPet.petId} xs={24} sm={12} md={8} lg={6}>
                <PetCard 
                  id={relatedPet.petId}
                  name={relatedPet.petName}
                  image={relatedPet.thumbnail}
                  gender={relatedPet.gender}
                  age={relatedPet.age}
                  price={relatedPet.unitPrice}
                  onAddToCart={async () => {
                    try {
                      // Kiểm tra trạng thái pet
                      if (relatedPet.status !== 'available') {
                        message.warn("This pet is not available for purchase");
                        return;
                      }
                      
                      // Kiểm tra token
                      const tokenCookie = document.cookie
                        .split("; ")
                        .find((row) => row.startsWith("token="));
                      if (!tokenCookie) {
                        message.warn("Please login to add items to your cart");
                        return;
                      }
                      
                      await addToCart({
                        type: "pet",
                        itemId: relatedPet.petId,
                        quantity: 1,
                      });
                      window.dispatchEvent(new Event("cartUpdated"));
                      message.success(`${relatedPet.petName} has been added to your cart!`);
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
    </>
  );
};

export default PetDetail;