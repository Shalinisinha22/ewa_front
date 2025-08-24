import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import API from "../../../api";
import bannerImg from "../../assets/header.png";

const Banner = () => {
  const { currentStore } = useStore();
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentStore) {
      fetchHeroBanners();
    }
  }, [currentStore]);

  useEffect(() => {
    // Auto-rotate banners if there are multiple
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change banner every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchHeroBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.request(
        `${API.endpoints.publicBanners}/position/hero?store=${currentStore.slug}&page=home`
      );
      
      setBanners(response || []);
    } catch (error) {
      console.error('Error fetching hero banners:', error);
      setError('Failed to load banners');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = async (banner) => {
    if (banner._id) {
      try {
        // Record banner click for analytics
        await API.request(`${API.endpoints.publicBanners}/${banner._id}/click?store=${currentStore.slug}`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error recording banner click:', error);
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="section__container header__container">
        <div className="header__content z-30">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
        <div className="header__image">
          <div className="animate-pulse bg-gray-300 h-full w-full rounded"></div>
        </div>
      </div>
    );
  }

  // Show error state or fallback
  if (error || banners.length === 0) {
    return (
      <div className="section__container header__container">
        <div className="header__content z-30">
          <h4 className="uppercase">UP To 20% Discount on</h4>
          <h1>Girl's Fashion</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
            explicabo architecto odit autem esse consequatur quaerat natus optio
            ullam, rem, laudantium distinctio nostrum, necessitatibus quo debitis
            aut tempore ex amet ea adipisci!
          </p>
          <button className="btn">
            <Link to="/shop">Explore Now</Link>
          </button>
        </div>
        <div className="header__image">
          <img src={bannerImg} alt="banner" />
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="section__container header__container">
      <div className="header__content z-30">
        {currentBanner.subtitle && (
          <h4 className="uppercase">{currentBanner.subtitle}</h4>
        )}
        <h1>{currentBanner.title}</h1>
        {currentBanner.description && (
          <p>{currentBanner.description}</p>
        )}
        {currentBanner.link ? (
          <button className="btn">
            <a 
              href={currentBanner.link.url} 
              target={currentBanner.link.target || '_self'}
              onClick={() => handleBannerClick(currentBanner)}
            >
              {currentBanner.link.text || "Explore Now"}
            </a>
          </button>
        ) : (
          <button className="btn">
            <Link to="/shop">Explore Now</Link>
          </button>
        )}
      </div>
      <div className="header__image">
        <img 
          src={API.getImageUrl(currentBanner.image)} 
          alt={currentBanner.title || "banner"}
          onLoad={() => {
            // Record banner impression when image loads
            if (currentBanner._id) {
              API.request(`${API.endpoints.publicBanners}/${currentBanner._id}/impression?store=${currentStore.slug}`, {
                method: 'POST'
              }).catch(error => {
                console.error('Error recording banner impression:', error);
              });
            }
          }}
        />
      </div>
      
      {/* Banner navigation dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBannerIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
