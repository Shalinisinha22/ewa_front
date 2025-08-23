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
      fetchBanners();
    }
  }, [currentStore]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.request(
        `${API.endpoints.publicBanners}/position/hero?store=${currentStore.name}&page=home`
      );
      
      setBanners(response || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  // Auto-rotate banners if there are multiple
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // Change banner every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // If no banners or loading, show default banner
  if (loading) {
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
          <button className="btn"><Link to="/shop">Explore Now</Link></button>
        </div>
        <div className="header__image">
          <img src={bannerImg} alt="banner"></img>
        </div>
      </div>
    );
  }

  // If there are banners, show the current one
  if (banners.length > 0) {
    const currentBanner = banners[currentBannerIndex];
    
    return (
      <div className="section__container header__container">
        <div className="header__content z-30">
          <h4 className="uppercase">{currentBanner.subtitle || "UP To 20% Discount on"}</h4>
          <h1>{currentBanner.title || "Girl's Fashion"}</h1>
          <p>
            {currentBanner.description || 
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat explicabo architecto odit autem esse consequatur quaerat natus optio ullam, rem, laudantium distinctio nostrum, necessitatibus quo debitis aut tempore ex amet ea adipisci!"
            }
          </p>
          {currentBanner.link?.url ? (
            <button className="btn">
              <a 
                href={currentBanner.link.url} 
                target={currentBanner.link.target || "_self"}
                rel={currentBanner.link.target === "_blank" ? "noopener noreferrer" : ""}
              >
                {currentBanner.link.text || "Explore Now"}
              </a>
            </button>
          ) : (
            <button className="btn"><Link to="/shop">Explore Now</Link></button>
          )}
        </div>
        <div className="header__image">
          <img 
            src={currentBanner.image || bannerImg} 
            alt={currentBanner.title || "banner"}
            onError={(e) => {
              e.target.src = bannerImg; // Fallback to default image
            }}
          />
        </div>
        
        {/* Banner navigation dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentBannerIndex === index 
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
  }

  // Fallback to default banner if no banners found
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
        <button className="btn"><Link to="/shop">Explore Now</Link></button>
      </div>
      <div className="header__image">
        <img src={bannerImg} alt="banner"></img>
      </div>
    </div>
  );
};

export default Banner;
