import React from 'react';
import 'animate.css';
import { Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import styles from './AdoptionSection.module.scss';
import adoptionImage from '../../../../assets/images/leg.png'; // Adjust the path as necessary
import pawIcon from '../../../../assets/images/fontisto_paw.svg'; // Adjust the path as necessary

function AdoptionSection() {
  return (
    <section className={styles.adoptionSection}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={`animate__animated animate__fadeInLeft ${styles.content}`}> 
            <div className={styles.headTitle}>
              <h2 className={styles.title}>Adoption</h2>
              <img src={pawIcon} alt="paw" className={styles.pawIcon} />
            </div>
            <h3 className={styles.subtitle}>We Need Help. So Do They.</h3>
            <p className={styles.desc}>Adopt a pet and give it a home,<br/>it will love you back unconditionally.</p>
            <div className={styles.buttonGroup}>
              <Button type="primary" size="large" className={styles.btnPrimary}>Explore Now</Button>
              <Button type="default" icon={<PlayCircleOutlined />} size="large" className={styles.btn}>View Intro</Button>
            </div>
          </div>
          <div className={`animate__animated animate__fadeInRight ${styles.imageWrap}`}>
            <img src={adoptionImage} alt="adoption" className={styles.adoptionImg} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdoptionSection; 