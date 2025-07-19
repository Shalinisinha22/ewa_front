import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Ratingstars from '../../Components/Ratingstars'
import { addToCart } from '../../redux/cartSlice';

const ProductCards = ({products}) => {
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const cart = useSelector((state) => state.cart);

  // Sample media for each product (5 images + 1 video)
  const getProductMedia = (product) => [
    { type: 'image', src: product.image },
    { type: 'image', src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop' },
    { type: 'video', src: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761' }
  ];

  const getCartQuantity = (productId) => {
    const cartItem = cart.cartItems.find(
      item => item.id === productId || item._id === productId
    );
    return cartItem ? cartItem.cartQuantity : 0;
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
                  
                  {/* Media Counter */}
                  <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity'>
                    {currentIndex + 1} / {media.length}
                  </div>

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
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <div className='flex gap-1 justify-center'>
                    {media.slice(0, 4).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setImageIndex(productId, index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                    {media.length > 4 && (
                      <button
                        onClick={() => setImageIndex(productId, 4)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentIndex >= 4 ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className='p-4'>
                <Link to={`/shop/${productId}`}>
                  <h4 className='font-semibold text-lg mb-2 hover:text-primary transition-colors'>{product.name}</h4>
                </Link>
                
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-primary font-bold text-lg'>${product.price}</span>
                  {product.oldPrice && (
                    <span className='text-gray-500 line-through text-sm'>${product.oldPrice}</span>
                  )}
                </div>
                
                <Ratingstars rating={product.rating} />
                
                {/* Add to Cart Button */}
                <button 
                  onClick={() => handleAddToCart(product)}
                  className={`w-full mt-3 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                    isInCart(productId)
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-primary hover:bg-primary-dark text-white'
                  }`}
                >
                  {isInCart(productId) 
                    ? `In Cart (${getCartQuantity(productId)})` 
                    : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

export default ProductCards;