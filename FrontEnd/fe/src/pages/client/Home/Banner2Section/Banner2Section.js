import React from 'react';
import 'animate.css';
import { Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import styles from './Banner2Section.module.scss';
import banner2Image from '../../../../assets/images/banner2.svg';

function Banner2Section() {
  return (
    <section className={styles.banner2Section}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={`animate__animated animate__fadeInLeft ${styles.imageWrap}`}>
            <img src={banner2Image} alt="banner2" className={styles.bannerImg} />
          </div>
          <div className={`animate__animated animate__fadeInRight ${styles.content}`}> 
            <h2 className={styles.title}>One More Friend</h2>
            <h3 className={styles.subtitle}>Thousands More Fun!</h3>
            <p className={styles.desc}>
              Having a pet means you have more joy, a new friend, a happy person who will always be with you to have fun. We have 200+ different pets that can meet your needs!
            </p>
            <div className={styles.buttonGroup}>
              <Button type="default" icon={<PlayCircleOutlined />} size="large" className={styles.btn}>View Intro</Button>
              <Button type="primary" size="large" className={styles.btnPrimary}>Explore Now</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner2Section; 