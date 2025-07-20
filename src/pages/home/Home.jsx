import React from 'react';
import Banner from './Banner';
import Categories from './Categories';
import HeroSection from './HeroSection';
import TrendingProducts from '../shop/TrendingProducts';
import PromoBanner from './PromoBanner';
import BlogSection from './BlogSection.jsx';

const Home = () => {
  return (
    <>
      <Banner></Banner>
       <PromoBanner></PromoBanner>
         <TrendingProducts></TrendingProducts>
      <Categories></Categories>
      <HeroSection></HeroSection>
    
     
      <BlogSection></BlogSection>
    </>
  );
}

export default Home;
