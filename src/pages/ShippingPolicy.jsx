import React, { useState, useEffect } from 'react';
import API from '../api';
import LoadingSpinner from '../Components/LoadingSpinner';
import { getCurrentStoreName, getCurrentStoreId } from '../utils/storeUtils';

const ShippingPolicy = () => {
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
      let endpoint = `${API.endpoints.publicPageByType}/shipping`;
      
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Policy</h1>
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
            <p className="mb-4">
              We are committed to delivering your orders quickly and safely. Please review our 
              shipping policy below for detailed information about delivery times, costs, and procedures.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Methods & Delivery Times</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-medium mb-3">Standard Shipping (5-7 Business Days)</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Free shipping on orders over $75</li>
                <li>$5.99 shipping fee for orders under $75</li>
                <li>Available for all domestic addresses</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{page.title}</h1>
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  );
};

export default ShippingPolicy;