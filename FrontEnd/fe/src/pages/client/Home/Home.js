import React from 'react';
import BannerSection from './HeroBanner/HeroBanner';
import PetsSection from './PetsSection/PetsSection';
import Banner2Section from './Banner2Section/Banner2Section';
import ProductsSection from './ProductSection/ProductsSection';
import SellersSection from './SellersSection/SellersSection';
import AdoptionSection from './AdoptionSection/AdoptionSection';
import KnowledgeSection from './KnowledgeSection/KnowledgeSection';

function Home() {
  return (
    <>
      <BannerSection />
      <PetsSection />
      <Banner2Section />
      <ProductsSection />
      <SellersSection />
      <AdoptionSection />
      <KnowledgeSection />
    </>
  );
}

export default Home;
