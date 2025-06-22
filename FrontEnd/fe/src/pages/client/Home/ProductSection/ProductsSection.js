import React, { useState, useEffect } from 'react';
import 'animate.css';
import { Button, Row, Col, Spin } from 'antd';
import { Link } from 'react-router-dom';
import styles from './ProductsSection.module.scss';
import AccessoryCard from '../../Components/AccesssoryCard/AccesssoryCard';
import { getAccessories } from '~/services/accessoryService';

function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch accessories from API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getAccessories({
          page: 0,
          size: 8, // Limit to 8 products for the homepage
          status: 'active',
          sortBy: 'newest'
        });
        
        // Check if we have valid data
        if (response && response.content) {
          setProducts(response.content);
        }
      } catch (error) {
        console.error('Failed to fetch accessories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    console.log(`Added ${product.accessoryName} to cart`);
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
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" tip="Loading products..." />
          </div>
        ) : (
          <div className={styles.petsGrid}>
            <Row gutter={[24, 30]}>
              {products.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.accessoryId} className={styles.productCardCol}>
                  <AccessoryCard
                    id={product.accessoryId}
                    name={product.accessoryName}
                    image={product.thumbnail}
                    categoryName={product.category}
                    price={product.unitPrice}
                    stockQuantity={product.stockQuantity}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </Col>
              ))}
            </Row>
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className={styles.noProducts}>
            <p>No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsSection;