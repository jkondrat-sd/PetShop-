import React from 'react';
import 'animate.css';
import { Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import styles from './ProductsSection.module.scss';
import AccessoryCard from '../../Components/AccesssoryCard/AccesssoryCard';

// Import hình ảnh phụ kiện
import dogFood from '../../../../assets/images/img-accessories/image 2-3.png';
import catFood from '../../../../assets/images/img-accessories/image 2-3.png';
import scratchingToy from '../../../../assets/images/img-accessories/image 2-3.png';
import catNest from '../../../../assets/images/img-accessories/image 2-3.png';
import omegaGold from '../../../../assets/images/img-accessories/image 2-3.png';
import cowboyRider from '../../../../assets/images/img-accessories/image 2-3.png';
import chickenHeadband from '../../../../assets/images/img-accessories/image 2-3.png';
import plushToy from '../../../../assets/images/img-accessories/image 2-3.png';

const products = [
  { id: 1, name: 'Reflex Plus Adult Dog Food Salmon', image: dogFood, category: 'Dog Food', size: '385g', price: '30', stockQuantity: 15 },
  { id: 2, name: 'Reflex Plus Adult Cat Food Salmon', image: catFood, category: 'Cat Food', size: '700g', price: '20', stockQuantity: 20 },
  { id: 3, name: 'Cat scratching ball toy kitten sisal rope ball', image: scratchingToy, category: 'Toy', size: 'small', price: '50', stockQuantity: 8 },
  { id: 4, name: 'Cute Pet Cat Warm Nest', image: catNest, category: 'Toy', size: 'small', price: '20', stockQuantity: 12 },
  { id: 5, name: 'NaturVet Dogs - Omega-Gold Plus Salmon Oil', image: omegaGold, category: 'Dog Food', size: '385g', price: '25', stockQuantity: 17 },
  { id: 6, name: 'Costumes Fashion Pet Clother Cowboy Rider', image: cowboyRider, category: 'Costume', size: '1.5kg', price: '30', stockQuantity: 5 },
  { id: 7, name: 'Costumes Chicken Drumstick Headband', image: chickenHeadband, category: 'Costume', size: 'small', price: '30', stockQuantity: 0 },
  { id: 8, name: 'Plush Pet Toy', image: plushToy, category: 'Toy', size: 'small', price: '25', stockQuantity: 10 },
];

function ProductsSection() {
  const handleAddToCart = (product) => {
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <section className={styles.productsSection}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.headerContent}>
            <h3>Hard to choose the right products for your pets?</h3>
            <h2>Our Products</h2>
          </div>
          <div>
            <Link to="/accessories">
              <Button type="default" size="large" className={styles.btn}>
                View more
              </Button>
            </Link>
          </div>
        </div>
        
        <div className={styles.petsGrid}>
          <Row gutter={[24, 30]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id} className={styles.productCardCol}>
                <AccessoryCard
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  categoryName={product.category}
                  size={product.size}
                  price={product.price}
                  stockQuantity={product.stockQuantity}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;