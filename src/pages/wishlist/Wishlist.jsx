import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import EmptyState from '../../Components/EmptyState';
import BackButton from '../../Components/BackButton';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  const formatPrice = (price, discountPrice) => {
    if (discountPrice && discountPrice < price) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">₹{discountPrice}</span>
          <span className="text-sm text-gray-500 line-through">₹{price}</span>
        </div>
      );
    }
    return <span className="text-lg font-semibold text-gray-900">₹{price}</span>;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-4">
          <BackButton fallbackPath="/" text="Back to Home" />
        </div>
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Loading wishlist...</span>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-4">
          <BackButton fallbackPath="/" text="Back to Home" />
        </div>
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <EmptyState 
          type="wishlist"
          onAction={() => window.location.href = '/shop'}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <BackButton fallbackPath="/" text="Back to Home" />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
        </h1>
        {wishlist.length > 0 && (
          <button
            onClick={handleClearWishlist}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <i className="ri-delete-bin-line mr-1"></i>
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const product = item.product || item;
          const productId = product._id || product.id || item.productId;
          
          return (
            <div key={productId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/product/${product.slug || productId}`} className="block">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <i className="ri-image-line text-4xl text-gray-400"></i>
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/product/${product.slug || productId}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="mb-3">
                  {formatPrice(product.price, product.discountPrice)}
                </div>
                
                <div className="flex items-center justify-between">
                  <Link
                    to={`/product/${product.slug || productId}`}
                    className="flex-1 mr-2 px-4 py-2 bg-primary text-white text-center rounded-lg hover:bg-primary-dark transition-colors font-medium"
                  >
                    View Product
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFromWishlist(productId);
                    }}
                    className="px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    title="Remove from wishlist"
                  >
                    <i className="ri-heart-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;