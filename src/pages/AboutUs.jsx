import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Us</h1>
      <div className="prose max-w-none">
        <p className="mb-6">
          Welcome to EWA, your premier destination for fashion and style. 
          Established in 2025, we've been committed to bringing you the latest trends 
          and timeless classics in clothing and accessories.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="mb-6">
          To provide high-quality fashion that empowers individuals to express their 
          unique style while maintaining affordable prices and sustainable practices.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
        <p className="mb-6">
          To become the most trusted and loved fashion destination, known for our 
          quality, style, and commitment to customer satisfaction.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;