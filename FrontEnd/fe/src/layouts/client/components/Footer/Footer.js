import React, { useState } from 'react';
import { Row, Col, Button, Input, Form } from 'antd';
import { Link } from 'react-router-dom';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  YoutubeFilled
} from '@ant-design/icons';
import styles from './Footer.module.scss';
import logo from '~/assets/images/logoPOMPOM-removebg.png';

const Footer = () => {
  const [email, setEmail] = useState('');
  
  const handleSubscribe = () => {
    if (email) {
      console.log('Subscribing with email:', email);
      // Add your subscription logic here
      setEmail('');
    }
  };

  return (
    <footer className={styles.footer}>
      <div>
        <Row>
          <Col span={24}>
            <div className={styles.footer__subscribe}>
              <div className={styles['footer__subscribe-content']}>
                <h2 className={styles['footer__subscribe-title']}>
                  Register Now So You Don't <br />
                  Miss Our Programs
                </h2>
              </div>
              <div className={styles['footer__subscribe-form']}>
                <Input
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles['footer__subscribe-input']}
                />
                <Button 
                  type="primary" 
                  onClick={handleSubscribe}
                  className={styles['footer__subscribe-button']}
                >
                  Subcribe Now
                </Button>
              </div>
            </div>
          </Col>
          
          <Col span={24}>
            <div className={styles.footer__navigation}>
              <ul className={styles['footer__navigation-menu']}>
                <li className={styles['footer__navigation-item']}>
                  <Link to="/" className={styles['footer__navigation-link']}>Home</Link>
                </li>
                <li className={styles['footer__navigation-item']}>
                  <Link to="/pets" className={styles['footer__navigation-link']}>Pets</Link>
                </li>
                <li className={styles['footer__navigation-item']}>
                  <Link to="/accessories" className={styles['footer__navigation-link']}>Accessories</Link>
                </li>
                <li className={styles['footer__navigation-item']}>
                  <Link to="/blog" className={styles['footer__navigation-link']}>Blog</Link>
                </li>
                <li className={styles['footer__navigation-item']}>
                  <Link to="/contact" className={styles['footer__navigation-link']}>Contact</Link>
                </li>
              </ul>
              
              <div className={styles.footer__socials}>
                <a href="https://facebook.com" className={styles['footer__socials-link']}>
                  <FacebookOutlined />
                </a>
                <a href="https://twitter.com" className={styles['footer__socials-link']}>
                  <TwitterOutlined />
                </a>
                <a href="https://instagram.com" className={styles['footer__socials-link']}>
                  <InstagramOutlined />
                </a>
                <a href="https://youtube.com" className={styles['footer__socials-link']}>
                  <YoutubeFilled />
                </a>
              </div>
            </div>
          </Col>
          
          <div className={styles.footer__divider}></div>
          
          <Col span={24}>
            <div className={styles.footer__bottom}>
              <div className={styles['footer__bottom-copyright']}>
                © 2022 PomPom. All rights reserved.
              </div>
              
              <div className={styles['footer__bottom-logo']}>
                <img src={logo} alt="PomPom Logo" />
              </div>
              
              <div className={styles['footer__bottom-links']}>
                <Link to="/terms" className={styles['footer__bottom-link']}>
                  Terms of Service
                </Link>
                <Link to="/privacy" className={styles['footer__bottom-link']}>
                  Privacy Policy
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;