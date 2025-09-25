import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButton = ({ 
  fallbackPath = '/', 
  className = '', 
  text = 'Back',
  showIcon = true,
  customAction = null 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (customAction) {
      customAction();
      return;
    }

    // If there's history, go back
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Otherwise, navigate to fallback path
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors duration-200 ${className}`}
      aria-label={`Go back to ${fallbackPath}`}
    >
      {showIcon && <i className="ri-arrow-left-line"></i>}
      {text}
    </button>
  );
};

export default BackButton;


