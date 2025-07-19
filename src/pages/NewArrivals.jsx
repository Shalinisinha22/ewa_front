import React, { useState, useEffect } from 'react';
import ProductCards from './shop/ProductCards';
import products from '../data/products.json';

const NewArrivals = () => {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    // Simulate new arrivals by taking the latest products
    // In a real app, this would filter by a "dateAdded" field or similar
    const latest = products.slice(-6); // Get last 6 products as "new arrivals"
    setNewProducts(latest);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header">New Arrivals</h2>
        <p className="section__subheader">
          Discover our latest collection featuring the newest trends and must-have pieces 
          that just arrived in our store.
        </p>
      </section>

      <section className="section__container">
        {/* Featured New Arrival */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary-light to-extra-light rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">✨ Just Dropped</h3>
            <p className="text-gray-600 mb-6">
              Be the first to shop our newest collection featuring the latest fashion trends
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="text-sm font-medium">Limited Stock</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="text-sm font-medium">Trending Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* New Arrivals Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-6">
            {newProducts.length} Latest Products
          </h3>
          <div className="mt-6">
            <ProductCards products={newProducts} />
          </div>
        </div>

        {/* Categories for New Arrivals */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Shop New Arrivals by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group cursor-pointer">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <i className="ri-handbag-line text-3xl"></i>
              </div>
              <h4 className="font-medium">New Accessories</h4>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <i className="ri-shirt-line text-3xl"></i>
              </div>
              <h4 className="font-medium">Latest Dresses</h4>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <i className="ri-gem-line text-3xl"></i>
              </div>
              <h4 className="font-medium">New Jewellery</h4>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <i className="ri-palette-line text-3xl"></i>
              </div>
              <h4 className="font-medium">Fresh Cosmetics</h4>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary-light rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-6">
            Be the first to know about new arrivals, exclusive offers, and fashion updates
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-primary"
            />
            <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewArrivals;