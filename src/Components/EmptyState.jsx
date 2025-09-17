import React from 'react';

const EmptyState = ({ 
  type = 'products', 
  message = null, 
  subMessage = null, 
  actionText = null, 
  onAction = null,
  icon = null 
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'products':
        return {
          icon: icon || 'ri-shopping-bag-line',
          message: message || 'No products found',
          subMessage: subMessage || 'We couldn\'t find any products matching your criteria. Try adjusting your filters or search terms.',
          actionText: actionText || 'Clear Filters',
          onAction: onAction
        };
      case 'search':
        return {
          icon: icon || 'ri-search-line',
          message: message || 'No results found',
          subMessage: subMessage || 'Try searching with different keywords or check your spelling.',
          actionText: actionText || 'Clear Search',
          onAction: onAction
        };
      case 'trending':
        return {
          icon: icon || 'ri-fire-line',
          message: message || 'No trending products',
          subMessage: subMessage || 'Check back later for our most popular items.',
          actionText: actionText || 'View All Products',
          onAction: onAction
        };
      case 'new-arrivals':
        return {
          icon: icon || 'ri-newspaper-line',
          message: message || 'No new arrivals',
          subMessage: subMessage || 'New products are added regularly. Check back soon!',
          actionText: actionText || 'View All Products',
          onAction: onAction
        };
      case 'category':
        return {
          icon: icon || 'ri-folder-line',
          message: message || 'No products in this category',
          subMessage: subMessage || 'This category is currently empty. Explore other categories.',
          actionText: actionText || 'View All Categories',
          onAction: onAction
        };
      case 'wishlist':
        return {
          icon: icon || 'ri-heart-line',
          message: message || 'Your wishlist is empty',
          subMessage: subMessage || 'Start adding products you love to your wishlist.',
          actionText: actionText || 'Start Shopping',
          onAction: onAction
        };
      case 'cart':
        return {
          icon: icon || 'ri-shopping-cart-line',
          message: message || 'Your cart is empty',
          subMessage: subMessage || 'Add some products to your cart to get started.',
          actionText: actionText || 'Continue Shopping',
          onAction: onAction
        };
      default:
        return {
          icon: icon || 'ri-inbox-line',
          message: message || 'Nothing to show',
          subMessage: subMessage || 'No items available at the moment.',
          actionText: actionText,
          onAction: onAction
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-6">
          <i className={`${content.icon} text-6xl text-gray-300`}></i>
        </div>
        
        {/* Message */}
        <h3 className="text-xl font-semibold text-gray-700 mb-3">
          {content.message}
        </h3>
        
        {/* Sub Message */}
        {content.subMessage && (
          <p className="text-gray-500 mb-6 leading-relaxed">
            {content.subMessage}
          </p>
        )}
        
        {/* Action Button */}
        {content.actionText && content.onAction && (
          <button
            onClick={content.onAction}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            {content.actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;




