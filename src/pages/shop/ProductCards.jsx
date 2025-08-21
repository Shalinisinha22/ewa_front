import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Ratingstars from '../../Components/Ratingstars'
import { addToCart, removeFromCart, decreaseCart } from '../../redux/cartSlice';
// import API from '../../../api';
import API from '../../../api';

const ProductCards = ({products}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const cart = useSelector((state) => state.cart);

  // Get product media from actual product images
  const getProductMedia = (product) => {
    const media = [];
    
    // Add actual product images
    if (product.images && product.images.length > 0) {
      product.images.forEach(image => {
        media.push({ 
          type: 'image', 
          src: image.startsWith('http') ? image : API.getImageUrl(image)
        });
      });
    }
    
    // If no images, use the single image field
    if (media.length === 0 && product.image) {
      media.push({ type: 'image', src: product.image });
    }
    
    // If still no images, add placeholder
    if (media.length === 0) {
      media.push({ 
        type: 'image', 
        src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop' 
      });
    }
    
    return media;
  };

  const getCartQuantity = (productId) => {
    const cartItem = cart.cartItems.find(
      item => item.id === productId || item._id === productId
    );
    return cartItem ? cartItem.cartQuantity : 0;
  };

  // Helper function to get stock quantity from new stock structure
  const getStockQuantity = (product) => {
    if (product.stock && typeof product.stock === 'object' && product.stock.quantity !== undefined) {
      return product.stock.quantity;
    }
    // Fallback to old structure
    return product.stock || 0;
  };

  // Helper function to check if stock is low
  const isLowStock = (product) => {
    if (product.stock && typeof product.stock === 'object') {
      const quantity = product.stock.quantity || 0;
      const threshold = product.stock.lowStockThreshold || 3;
      return quantity <= threshold && quantity > 0;
    }
    // Fallback to old structure
    return (product.stock || 0) <= 3 && (product.stock || 0) > 0;
  };

  const isInCart = (productId) => {
    return cart.cartItems.some(item => 
      (item.id === productId || item._id === productId)
    );
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const handleWishlistToggle = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product) => {
    const productToAdd = {
      ...product,
      _id: product._id || product.id
    };
    
    dispatch(addToCart(productToAdd));
    setShowNotification(product.id);
    setTimeout(() => setShowNotification(null), 2000);
  };

  const nextImage = (productId) => {
    const media = getProductMedia(products.find(p => (p.id || p._id) === productId));
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % media.length
    }));
  };

  const prevImage = (productId) => {
    const media = getProductMedia(products.find(p => (p.id || p._id) === productId));
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + media.length) % media.length
    }));
  };

  const setImageIndex = (productId, index) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: index
    }));
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
      {
        products.map((product) => {
          const productId = product.id || product._id;
          const media = getProductMedia(product);
          const currentIndex = currentImageIndex[productId] || 0;
          const qty = getCartQuantity(productId);
          return (
            <div key={productId} className='product__card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
              <div className='relative group'>
                {/* Media Display */}
                <div className='relative h-64 bg-gray-100 overflow-hidden'>
                  {media[currentIndex].type === 'image' ? (
                    <img 
                      src={media[currentIndex].src} 
                      alt={product.name}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  ) : (
                    <video 
                      className='w-full h-full object-cover' 
                      controls
                      muted
                      src={media[currentIndex].src}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  
                  {/* Navigation Arrows */}
                  {media.length > 1 && (
                    <>
                      <button 
                        onClick={() => prevImage(productId)}
                        className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <i className="ri-arrow-left-s-line text-sm"></i>
                      </button>
                      <button 
                        onClick={() => nextImage(productId)}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <i className="ri-arrow-right-s-line text-sm"></i>
                      </button>
                    </>
                  )}
                  
                  {/* Media Counter */}
                  {media.length > 1 && (
                    <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity'>
                      {currentIndex + 1} / {media.length}
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button 
                    onClick={() => handleWishlistToggle(productId)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
                      isInWishlist(productId) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <i className={`${isInWishlist(productId) ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>
                  </button>

                  {/* Notification */}
                  {showNotification === product.id && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-md 
                      animate-fade-in-out shadow-lg text-sm">
                      Added to cart!
                    </div>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {media.length > 1 && (
                  <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <div className='flex gap-1 justify-center'>
                      {media.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setImageIndex(productId, index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className='p-4'>
                <Link to={`/shop/${product._id || product.id}`}>
                  <h4 className='font-semibold text-lg mb-1 hover:text-primary transition-colors'>{product.name}</h4>
                </Link>
                {/* Brand and Category */}
                <div className='text-xs text-gray-500 mb-1'>
                  {product.brand} &bull; {product.category?.name || product.category}
                </div>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-primary font-bold text-lg'>₹{product.price}</span>
                  {product.oldPrice && (
                    <span className='text-gray-500 line-through text-sm'>₹{product.oldPrice}</span>
                  )}
                  {/* Offer badge */}
                  {product.offers && product.offers.length > 0 && (
                    <span className='ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded'>
                      {product.offers[0]}
                    </span>
                  )}
                </div>
                {/* Material */}
                {product.material && (
                  <div className='text-xs text-gray-600 mb-1'>Material: {product.material}</div>
                )}
                {/* Features as badges */}
                {product.features && product.features.length > 0 && (
                  <div className='flex flex-wrap gap-1 mb-2'>
                    {product.features.slice(0,2).map((feature, idx) => (
                      <span key={idx} className='bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded'>{feature}</span>
                    ))}
                  </div>
                )}
                {/* Low stock warning */}
                {isLowStock(product) && (
                  <div className='text-xs text-red-500 mb-1'>Only {getStockQuantity(product)} left in stock!</div>
                )}
                {/* Delivery info */}
                {product.deliveryInfo && (
                  <div className='text-xs text-gray-400 mb-2'>{product.deliveryInfo}</div>
                )}
                <Ratingstars rating={product.rating} />
                {/* Cart Quantity Controls and Go to Cart */}
                <div className='mt-3 flex flex-col gap-2'>
                  {isInCart(productId) ? (
                    <>
                      <div className='flex items-center justify-center w-full border rounded-full bg-white overflow-hidden'>
                        <button
                          className='flex-1 py-2 text-lg font-bold text-primary hover:bg-primary hover:text-white transition-colors duration-200 rounded-none'
                          style={{ borderRight: '1px solid #eee' }}
                          onClick={() => {
                            if (qty === 1) {
                              dispatch(removeFromCart(product));
                            } else {
                              dispatch(decreaseCart(product));
                            }
                          }}
                          aria-label='Decrease quantity'
                        >
                          -
                        </button>
                        <span className='flex-1 py-2 text-lg text-center select-none'>{qty}</span>
                        <button
                          className='flex-1 py-2 text-lg font-bold text-primary hover:bg-primary hover:text-white transition-colors duration-200 rounded-none'
                          style={{ borderLeft: '1px solid #eee' }}
                          onClick={() => handleAddToCart(product)}
                          aria-label='Increase quantity'
                          disabled={qty >= (getStockQuantity(product) || 99)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className='w-full py-2 rounded font-medium bg-primary hover:bg-primary-dark text-white transition-colors duration-300 mt-2'
                        onClick={() => navigate('/cart')}
                      >
                        Go to Cart
                      </button>
                    </>
                  ) : (
                    getStockQuantity(product) === 0 ? (
                      <div className='w-full py-2.5 px-4 rounded-full font-medium bg-gray-200 text-gray-500 text-center'>Out of Stock</div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className='w-full py-2.5 px-4 rounded-full font-medium transition-all duration-300 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
                      >
                        Add to Cart
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

export default ProductCards;