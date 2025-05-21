import React from 'react';
import 'animate.css';
import { Card, Tag } from 'antd';
import styles from './KnowledgeSection.module.scss';
import dogImage1 from '../../../../assets/images/img-dogs/dog3.6.png'; // Adjust the path as necessary
import dogImage2 from '../../../../assets/images/img-dogs/dog2.7.png'; // Adjust the path as necessary
import dogImage3 from '../../../../assets/images/img-dogs/dog1.9.png'; // Adjust the path as necessary

const knowledges = [
  {
    id: 1,
    title: 'What is a Pomeranian? How to Identify Pomeranian Dogs',
    image: dogImage1,
    desc: 'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circ...'
  },
  {
    id: 2,
    title: 'Dog Diet You Need To Know',
    image: dogImage2,
    desc: 'Dividing a dogs diet may seem simple at first, but there are some rules you should know so that your dog can easily absorb the nutrients in the diet...'
  },
  {
    id: 3,
    title: 'Why Dogs Bite and Destroy Furniture and How to Prevent It Effectively',
    image: dogImage3,
    desc: 'Dog bites are common during development. However, no one wants to see their furniture or important items being bitten by a dog...'
  },
];

function KnowledgeSection() {
  return (
    <section className={styles.knowledgeSection}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.headerContent}>
            <h3>You already know ?</h3>
            <h2>Useful Pet Knowledge</h2>
          </div>
          <div>
            <button className={styles.btn}>View more</button>
          </div>
        </div>
        <div className={styles.cardsRow}>
          {knowledges.map((item, idx) => (
            <Card
              key={item.id}
              className={`animate__animated animate__fadeInUp ${styles.knowledgeCard}`}
              cover={<img alt={item.title} src={item.image} className={styles.cardImg} />}
              data-wow-delay={`${0.1 + idx * 0.1}s`}
            >
              <Tag color="#003459" className={styles.knowledgeTag}>Pet knowledge</Tag>
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardDesc}>{item.desc}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default KnowledgeSection; 