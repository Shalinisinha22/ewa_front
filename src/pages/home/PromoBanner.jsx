import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import API from '../../../api';

const PromoBanner = () => {
  const { currentStore } = useStore();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentStore) {
      fetchPromoBanners();
    }
  }, [currentStore]);

  const fetchPromoBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.request(`${API.endpoints.publicPromoBanners}?store=${currentStore.name}`);
      setBanners(response.banners || []);
    } catch (error) {
      console.error('Error fetching promo banners:', error);
      setError('Failed to load promo banners');
      // Set default banners as fallback
      setBanners(getDefaultBanners());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultBanners = () => [
    {
      title: 'Free Delivery',
      description: 'Offers convenience and the ability to shop from anywhere, anytime.',
      icon: 'ri-truck-line'
    },
    {
      title: '100% Money Back Guarantee',
      description: 'Shop with confidence with our money-back guarantee policy.',
      icon: 'ri-money-dollar-circle-line'
    },
    {
      title: 'Strong Support',
      description: '24/7 customer support to assist you with any queries.',
      icon: 'ri-user-voice-fill'
    },
    {
      title: 'Secure Payment',
      description: 'Ensures safe and encrypted transactions for your peace of mind.',
      icon: 'ri-shield-check-line'
    }
  ];

  const handleBannerClick = (banner) => {
    if (banner.link && banner.link.url) {
      if (banner.link.target === '_blank') {
        window.open(banner.link.url, '_blank');
      } else {
        window.location.href = banner.link.url;
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white py-12">
        <section className="max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="banner__card p-6 bg-white rounded-lg shadow-sm animate-pulse border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error && banners.length === 0) {
    return (
      <div className="bg-white py-12">
        <section className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>Unable to load promo banners</p>
          </div>
        </section>
      </div>
    );
  }

  const displayBanners = banners.length > 0 ? banners : getDefaultBanners();

  // Function to get the correct icon class
  const getIconClass = (icon) => {
    if (!icon) return 'ri-question-line'; // fallback icon
    
    // If it already starts with 'ri-', return as is
    if (icon.startsWith('ri-')) {
      return icon;
    }
    
    // Otherwise, add 'ri-' prefix
    const iconClass = `ri-${icon}`;
    console.log('Icon class generated:', iconClass); // Debug log
    return iconClass;
  };

  // Function to get responsive grid classes based on number of banners
  const getGridClasses = (bannerCount) => {
    if (bannerCount === 1) {
      return 'grid grid-cols-1 max-w-md mx-auto';
    } else if (bannerCount === 2) {
      return 'grid grid-cols-1 md:grid-cols-2 gap-6';
    } else if (bannerCount === 3) {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    } else {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
    }
  };

  return (
    <div className="bg-white py-12">
      <section className="max-w-screen-2xl mx-auto px-4">
        <div className={getGridClasses(displayBanners.length)}>
          {displayBanners.map((banner, index) => (
            <div 
              key={banner._id || index}
              className={`banner__card group p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 ${
                banner.link && banner.link.url ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleBannerClick(banner)}
              style={{
                backgroundColor: banner.style?.backgroundColor || '#ffffff',
                color: banner.style?.textColor || '#000000'
              }}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto" 
                   style={{ backgroundColor: `${banner.style?.iconColor || '#3b82f6'}15` }}>
                <span 
                  className="inline-block text-2xl transform group-hover:scale-110 transition-transform duration-300"
                  style={{ color: banner.style?.iconColor || '#3b82f6' }}
                >
                  <i className={getIconClass(banner.icon)}></i>
                </span>
              </div>
              <h4 className="text-lg font-semibold mb-2">{banner.title}</h4>
              <p className="text-gray-600" style={{ color: banner.style?.textColor || '#6b7280' }}>
                {banner.description}
              </p>
              {banner.link && banner.link.text && (
                <div className="mt-3">
                  <span className="text-sm font-medium" style={{ color: banner.style?.iconColor || '#3b82f6' }}>
                    {banner.link.text} →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PromoBanner;
