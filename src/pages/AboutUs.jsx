import React, { useState, useEffect } from 'react';
import API from '../api';
import LoadingSpinner from '../Components/LoadingSpinner';
import BackButton from '../Components/BackButton';
import { getCurrentStoreName, getCurrentStoreId } from '../utils/storeUtils';

const AboutUs = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get store information
      const storeId = getCurrentStoreId();
      const storeName = getCurrentStoreName();
      
      // Build endpoint with store parameter
      let endpoint = `${API.endpoints.publicPageByType}/about`;
      
      // Add store parameter
      if (storeId) {
        endpoint += `?storeId=${encodeURIComponent(storeId)}`;
      } else if (storeName) {
        endpoint += `?store=${encodeURIComponent(storeName)}`;
      } else {
        // Fallback to default store
        endpoint += `?store=ewa-luxe`;
      }
      
      const data = await API.request(endpoint);
      setPage(data);
      
      // Update page title and meta description
      if (data.title) {
        const storeName = getCurrentStoreName();
        document.title = `${data.title} - ${storeName}`;
      }
      
      if (data.seo?.metaDescription) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.seo.metaDescription);
        }
      }
    } catch (err) {
      console.error('Error fetching page:', err);
      setError(err.message || 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <BackButton fallbackPath="/" text="Back to Home" />
        </div>
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
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-4">
        <BackButton fallbackPath="/" text="Back to Home" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{page.title}</h1>
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  );
};

export default AboutUs;