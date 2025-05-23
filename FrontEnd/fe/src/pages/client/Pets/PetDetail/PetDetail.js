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
  message
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
import { addToCart } from "../../../../services/cartService"



import imgDog from '../../../../assets/images/img-dogs/MO231.png';
import imgDog2 from '../../../../assets/images/img-dogs/MO326.png';
import profile1 from '../../../../assets/images/img-dogs/Frame 118.png';
import profile2 from '../../../../assets/images/img-dogs/Frame 119.png';
import profile3 from '../../../../assets/images/img-dogs/Frame 120.png';
import profile4 from '../../../../assets/images/img-dogs/Frame 121.png';


const { Title, Text } = Typography;

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [relatedPets, setRelatedPets] = useState([]);
  const [customerImages, setCustomerImages] = useState([]);

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
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    // Fetch pet details
    const fetchPetDetails = async () => {
      setLoading(true);
      try {
        // Replace with your actual API call
        // const response = await fetch(`/api/pets/${id}`);
        // const data = await response.json();
        
        // Simulating API response for this example
        const data = {
          petId: id || 'MO228',
          petName: 'Pomeranian White',
          type: 'DOG',
          breed: 'Pomeranian',
          breedId: 1,
          gender: 'Male',
          unitPrice: 1500.00,
          age: 2,
          status: 'available',
          character: 'Friendly, Active, Playful',
          weight: '1.5 kg',
          height: '20 cm',
          thumbnail: imgDog,
          images: [
            imgDog,
            imgDog2,
            imgDog,
            imgDog2,
            imgDog,
          ]
        };
        
        setPet(data);
        setMainImage(data.images[0]);
        
        // Fetch customer images
        setCustomerImages([
          profile1,
          profile2,
          profile3,
          profile4,
          profile3,
          profile2,
        ]);
        
        // Fetch related pets
        setRelatedPets([
          {
            id: 'MO102',
            name: 'Poodle Tiny Sepia',
            image: 'assets/images/img-dogs/MO102.png',
            gender: 'Male',
            age: '2 months',
            price: '3,000'
          },
          {
            id: 'MO512',
            name: 'Alaskan Malamute Grey',
            image: 'assets/images/img-dogs/MO512.png',
            gender: 'Male',
            age: '2 months',
            price: '5,000'
          },
          {
            id: 'MO504',
            name: 'Pembroke Corgi Cream',
            image: 'assets/images/img-dogs/MO504.png',
            gender: 'Male',
            age: '2 months',
            price: '3,200'
          },
          {
            id: 'MO502',
            name: 'Pembroke Corgi Tricolor',
            image: 'assets/images/img-dogs/MO502.png',
            gender: 'Female',
            age: '2 months',
            price: '3,000'
          }
        ]);
      } catch (error) {
        console.error("Error fetching pet details:", error);
        message.error("Could not load pet details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!pet) return;
    try {
      await addToCart({
        type: "pet",
        itemId: pet.petId,
        quantity: 1,
      });
      window.dispatchEvent(new Event("cartUpdated"));
      message.success(`${pet.petName} has been added to your cart!`);
    } catch (error) {
      message.error("Failed to add to cart. Please try again.");
    }
  };

  const handleBuyNow = () => {
    message.info("Redirecting to checkout...");
    // Implement redirect to checkout
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  if (loading) {
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
                  {pet?.images.map((image, index) => (
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
              <div className="price">${pet?.unitPrice.toLocaleString()}</div>

              <div className="inner-button">
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handleBuyNow}
                  className="animate__animated animate__pulse animate__infinite animate__slower"
                >
                  Buy Now
                </Button>
                <Button 
                  type="default" 
                  size="large" 
                  icon={<ShoppingCartOutlined />} 
                  onClick={handleAddToCart}
                  className="animate__animated animate__fadeIn animate__delay-1s"
                >
                  Add to Cart
                </Button>
              </div>

              <Divider />

              <div className="product-info">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Age">{pet?.age} months</Descriptions.Item>
                  <Descriptions.Item label="Weight">{pet?.weight}</Descriptions.Item>
                  <Descriptions.Item label="Height">{pet?.height}</Descriptions.Item>
                  <Descriptions.Item label="Gender">{pet?.gender}</Descriptions.Item>
                  <Descriptions.Item label="Character">{pet?.character}</Descriptions.Item>
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
              <Col key={relatedPet.id} xs={24} sm={12} md={8} lg={6}>
                <PetCard 
                  id={relatedPet.id}
                  name={relatedPet.name}
                  image={relatedPet.image}
                  gender={relatedPet.gender}
                  age={relatedPet.age}
                  price={relatedPet.price}
                  onAddToCart={async () => {
                    try {
                      await addToCart({
                        type: "pet",
                        itemId: relatedPet.id,
                        quantity: 1,
                      });
                      window.dispatchEvent(new Event("cartUpdated"));
                      message.success(`${relatedPet.name} has been added to your cart!`);
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