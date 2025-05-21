import React from 'react';
import 'animate.css';
import Slider from 'react-slick';
import { Button, Badge, Tag } from 'antd';
import styles from './ProductsSection.module.scss';

const products = [
  { id: 1, name: 'Reflex Plus Adult Dog Food Salmon', image: '/assets/images/img-accessories/image 2-6.png', category: 'Dog Food', size: '385g', price: '30' },
  { id: 2, name: 'Reflex Plus Adult Cat Food Salmon', image: '/assets/images/img-accessories/image 2-3.png', category: 'Cat Food', size: '700g', price: '20' },
  { id: 3, name: 'Cat scratching ball toy kitten sisal rope ball', image: '/assets/images/img-accessories/image 2-4.png', category: 'Toy', size: 'small', price: '90' },
  { id: 4, name: 'Cute Pet Cat Warm Nest', image: '/assets/images/img-accessories/image 2-5.png', category: 'Toy', size: 'small', price: '50' },
  { id: 5, name: 'NaturVet Dogs - Omega-Gold Plus Salmon Oil', image: '/assets/images/img-accessories/Frame 7.png', category: 'Dog Food', size: '385g', price: '50' },
  { id: 6, name: 'Costumes Fashion Pet Clother Cowboy Rider', image: '/assets/images/img-accessories/Frame 7 (1).png', category: 'Costume', size: '1.5kg', price: '80' },
  { id: 7, name: 'Costumes Chicken Drumsti ck Headband', image: '/assets/images/img-accessories/image 2.png', category: 'Costume', size: 'small', price: '75' },
  { id: 8, name: 'Plush Pet Toy', image: '/assets/images/img-accessories/image 2 (1).png', category: 'Toy', size: 'small', price: '25' },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 900, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } },
  ],
};

function ProductsSection() {
  return (
    <section className={styles.productsSection}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.headerContent}>
            <h3>Hard to choose the right products for your pets?</h3>
            <h2>Our Products</h2>
          </div>
          <div>
            <Button type="default" size="large" className={styles.btn}>View more</Button>
          </div>
        </div>
        <Slider {...sliderSettings} className={styles.slider}>
          {products.map((product) => (
            <div key={product.id} className={`animate__animated animate__fadeInUp ${styles.cardWrap}`} data-wow-delay="0.1s">
              <div className={styles.productCard}>
                <Badge.Ribbon text={product.category} color="#007ea7">
                  <img src={product.image} alt={product.name} className={styles.productImg} />
                </Badge.Ribbon>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>{product.name}</div>
                  <div className={styles.productDesc}><Tag color="#108ee9">{product.category}</Tag> Size: {product.size}</div>
                  <div className={styles.productPrice}>{product.price} $</div>
                  <Button type="primary" size="small" className={styles.btnATC}>Add to cart</Button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default ProductsSection; 