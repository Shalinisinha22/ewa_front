import React from 'react';
import { useWishlist } from '../context/WishlistContext';

const WishlistButton = ({ product, size = 'md', showText = false, className = '' }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-12 h-12 text-lg';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={`
        ${getSizeClasses()}
        ${isWishlisted 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-400 hover:text-red-500 bg-white hover:bg-red-50'
        }
        rounded-full flex items-center justify-center transition-all duration-200
        shadow-sm hover:shadow-md border border-gray-200 hover:border-red-200
        ${className}
      `}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <i className={`ri-heart-${isWishlisted ? 'fill' : 'line'}`}></i>
      {showText && (
        <span className={`ml-2 font-medium ${getTextSizeClasses()}`}>
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;


