import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';
import LoadingSpinner from '../Components/LoadingSpinner';
import { getCurrentStoreName, getCurrentStoreId } from '../utils/storeUtils';

const DynamicPage = () => {
  const { pageType } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPage();
  }, [pageType]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get store information
      const storeId = getCurrentStoreId();
      const storeName = getCurrentStoreName();
      
      // Build endpoint with store parameter
      let endpoint = `${API.endpoints.publicPageByType}/${pageType}`;
      
      // Add store parameter
      if (storeId) {
        endpoint += `?storeId=${encodeURIComponent(storeId)}`;
      } else if (storeName) {
        endpoint += `?store=${encodeURIComponent(storeName)}`;
      } else {
        // Fallback to default store
        endpoint += `?store=ewa-luxe`;
      }
      
      console.log('Fetching page from:', endpoint);
      
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">The requested page could not be found.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Go Back
          </button>
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

export default DynamicPage;
