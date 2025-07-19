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
      <Categories></Categories>
      <HeroSection></HeroSection>
      <TrendingProducts></TrendingProducts>
      <PromoBanner></PromoBanner>
      <BlogSection></BlogSection>
    </>
  );
}

export default Home;
