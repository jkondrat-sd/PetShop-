import React, { useState, useEffect, useRef } from 'react';
import 'animate.css';
import Slider from 'react-slick';
import styles from './SellersSection.module.scss';
import seller1 from '../../../../assets/images/Seller1.png';
import seller2 from '../../../../assets/images/Seller2.png';
import seller3 from '../../../../assets/images/Seller3.png';
import seller4 from '../../../../assets/images/Seller4.png';
import seller5 from '../../../../assets/images/Seller5.png';
import seller6 from '../../../../assets/images/Seller6.png';
import seller7 from '../../../../assets/images/Seller7.png';

// Định nghĩa mảng sellers
const sellers = [
  { id: 1, name: 'Sheba', image: seller1 },
  { id: 2, name: 'Whiskas', image: seller2 },
  { id: 3, name: 'Bakers', image: seller3 },
  { id: 4, name: 'Felix', image: seller4 },
  { id: 5, name: 'Good Boy', image: seller5 },
  { id: 6, name: 'Butchers', image: seller6 },
  { id: 7, name: 'Pedigree', image: seller7 },
];

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 4 } },
    { breakpoint: 900, settings: { slidesToShow: 3 } },
    { breakpoint: 600, settings: { slidesToShow: 2 } },
  ],
};

function SellersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Theo dõi khi section xuất hiện trong viewport
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.sellersSection}>
      <div className={styles.container}>
        <div className={`${styles.headerRow} ${isVisible ? 'animate__animated animate__fadeInDown' : ''}`}>
          <div className={styles.headerContent}>
            <h3>Proud to be part of</h3>
            <h2>Pet Sellers</h2>
          </div>
          <div>
            <button className={styles.btn}>View all</button>
          </div>
        </div>
        <Slider {...sliderSettings} className={styles.slider}>
          {sellers.map((seller, index) => (
            <div 
              key={seller.id} 
              className={`${styles.sellerWrap} ${isVisible ? 'animate__animated animate__fadeInUp' : ''}`} 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img src={seller.image} alt={seller.name} className={styles.sellerImg} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default SellersSection;