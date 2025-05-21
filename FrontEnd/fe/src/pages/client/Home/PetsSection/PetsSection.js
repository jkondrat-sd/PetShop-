import React from 'react';
import 'animate.css';
import Slider from 'react-slick';
import { Button, Badge } from 'antd';
import styles from './PetsSection.module.scss';
import PetCard from '../../Components/PetCard/PetCard';

const pets = [
  { id: 1, name: 'Pomeranian White', image: '../../../../assets/images/img-dogs/MO231.png', gender: 'Male', age: '2 months', price: '3,000' },
  { id: 2, name: 'Poodle Tiny Yellow', image: '/assets/images/img-dogs/MO502.png', gender: 'Female', age: '2 months', price: '2,500' },
  { id: 3, name: 'Poodle Tiny Sepia', image: '/assets/images/img-dogs/MO102.png', gender: 'Male', age: '2 months', price: '3,000' },
  { id: 4, name: 'Alaskan Malamute Grey', image: '/assets/images/img-dogs/MO512.png', gender: 'Male', age: '2 months', price: '5,000' },
  { id: 5, name: 'Pembroke Corgi Cream', image: '/assets/images/img-dogs/MO504.png', gender: 'Male', age: '2 months', price: '3,200' },
  { id: 6, name: 'Pembroke Corgi Tricolor', image: '/assets/images/img-dogs/MO502.png', gender: 'Female', age: '2 months', price: '3,000' },
  { id: 7, name: 'Pomeranian White', image: '/assets/images/img-dogs/MO231.png', gender: 'Male', age: '2 months', price: '3,000' },
  { id: 8, name: 'Poodle Tiny Dairy Cow', image: '/assets/images/img-dogs/MO512.png', gender: 'Male', age: '2 months', price: '2,000' },
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

function PetsSection() {
  return (
    <section className={styles.petsSection}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.headerContent}>
            <h3>Whats new?</h3>
            <h2>Take A Look At Some Of Our Pets</h2>
          </div>
          <div>
            <Button type="default" size="large" className={styles.btn}>View more</Button>
          </div>
        </div>
        <Slider {...sliderSettings} className={styles.slider}>
          {pets.map((pet) => (
            <div key={pet.id} className={styles.cardWrap}>
              <PetCard
                id={pet.id}
                name={pet.name}
                image={pet.image}
                gender={pet.gender}
                age={pet.age}
                price={pet.price}
                onAddToCart={() => console.log(`Added ${pet.name} to cart`)}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default PetsSection; 