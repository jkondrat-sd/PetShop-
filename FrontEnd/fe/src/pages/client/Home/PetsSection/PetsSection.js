import React from 'react';
import 'animate.css';
import { Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import styles from './PetsSection.module.scss';
import PetCard from '../../Components/PetCard/PetCard';

// Import hình ảnh thú cưng
import MO231 from '../../../../assets/images/img-dogs/MO231.png';
import MO502 from '../../../../assets/images/img-dogs/MO502.png';
import MO102 from '../../../../assets/images/img-dogs/MO102.png';
import MO512 from '../../../../assets/images/img-dogs/MO512.png';
import MO504 from '../../../../assets/images/img-dogs/MO504.png';

const pets = [
  { id: 1, name: 'MO231 - Pomeranian White', image: MO231, gender: 'Male', age: '2 months', price: '3,000' },
  { id: 2, name: 'MO502 - Poodle Tiny Yellow', image: MO502, gender: 'Female', age: '2 months', price: '2,500' },
  { id: 3, name: 'MO102 - Poodle Tiny Sepia', image: MO102, gender: 'Male', age: '2 months', price: '3,000' },
  { id: 4, name: 'MO512 - Alaskan Malamute Grey', image: MO512, gender: 'Male', age: '2 months', price: '5,000' },
  { id: 5, name: 'MO504 - Pembroke Corgi Cream', image: MO504, gender: 'Male', age: '2 months', price: '3,200' },
  { id: 6, name: 'MO502 - Pembroke Corgi Tricolor', image: MO502, gender: 'Female', age: '2 months', price: '3,000' },
  { id: 7, name: 'MO231 - Pomeranian White', image: MO231, gender: 'Male', age: '2 months', price: '3,000' },
  { id: 8, name: 'MO512 - Poodle Tiny Dairy Cow', image: MO512, gender: 'Male', age: '2 months', price: '2,000' },
];

function PetsSection() {
  return (
    <section className={styles.petsSection}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.headerContent}>
            <h3>What's new?</h3>
            <h2>Take A Look At Some Of Our Pets</h2>
          </div>
          <div>
            <Link to="/pets">
              <Button type="primary" size="large" className={styles.viewMoreBtn}>
                View more
              </Button>
            </Link>
          </div>
        </div>
        
        <div className={styles.petsGrid}>
          <Row gutter={[24, 30]}>
            {pets.map((pet) => (
              <Col xs={24} sm={12} md={8} lg={6} key={pet.id} className={styles.petCardCol}>
                <PetCard
                  id={pet.id}
                  name={pet.name}
                  image={pet.image}
                  gender={pet.gender}
                  age={pet.age}
                  price={pet.price}
                  onAddToCart={() => console.log(`Added ${pet.name} to cart`)}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </section>
  );
}

export default PetsSection;