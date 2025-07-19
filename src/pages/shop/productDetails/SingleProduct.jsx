import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import products from '../../../data/products.json';
import Ratingstars from '../../../Components/Ratingstars';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../redux/cartSlice';


const SingleProduct = () => {
    const {id} = useParams(); 
    const dispatch = useDispatch();
    const [showNotification, setShowNotification] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const cart = useSelector((state) => state.cart);

    const product = products.filter((product) => product.id == id);

    // Sample product media (5 images + 1 video)
    const productMedia = [
        { type: 'image', src: product[0]?.image },
        { type: 'image', src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop' },
        { type: 'video', src: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761' }
    ];
    useEffect(() => {
        window.scrollTo(0,0)
    }, [id]);

    const isInCart = (productId) => {
        return cart.cartItems.some(item => 
            (item.id === productId || item._id === productId)
        );
    };

    const getCartQuantity = (productId) => {
        const cartItem = cart.cartItems.find(
            item => item.id === productId || item._id === productId
        );
        return cartItem ? cartItem.cartQuantity : 0;
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % productMedia.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + productMedia.length) % productMedia.length);
    };
    return (
        <>
     <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">Shop Products</h2>
        <div className='section__subheader space-x-2' >
            <span>
                <Link to="/">home</Link>
            </span>
             <i className="ri-arrow-right-s-line"></i>
              <span>
                <Link to="/shop">shop</Link>
            </span>
              <i className="ri-arrow-right-s-line"></i>
              <span className="hover:text-primary">
             {product[0].name}
            </span>
        </div>
      </section> 

      <section className='section__container mt-8'>
        <div className='flex flex-col items-center md:flex-row gap-8'>
          {/* Product Image Slider */}
          <div className='md:w-1/2 w-full'>
            <div className='relative'>
              {/* Main Image/Video Display */}
              <div className='relative h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden'>
                {productMedia[currentImageIndex].type === 'image' ? (
                  <img 
                    className='w-full h-full object-cover' 
                    src={productMedia[currentImageIndex].src} 
                    alt={`${product[0].name} view ${currentImageIndex + 1}`}
                  />
                ) : (
                  <video 
                    className='w-full h-full object-cover' 
                    controls
                    src={productMedia[currentImageIndex].src}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevImage}
                  className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all'
                >
                  <i className="ri-arrow-left-s-line text-xl"></i>
                </button>
                <button 
                  onClick={nextImage}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all'
                >
                  <i className="ri-arrow-right-s-line text-xl"></i>
                </button>
                
                {/* Image Counter */}
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm'>
                  {currentImageIndex + 1} / {productMedia.length}
                </div>
              </div>
              
              {/* Thumbnail Navigation */}
              <div className='flex gap-2 mt-4 overflow-x-auto pb-2'>
                {productMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-primary' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img 
                        src={media.src} 
                        alt={`Thumbnail ${index + 1}`}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                        <i className="ri-play-circle-line text-xl text-gray-600"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
      
        <div className='md:w-1/2 w-full relative'>
        <h3 className='text-2xl font-semibold mb-4'>{product[0].name}</h3>
           <p>{product[0].price}{product[0].oldPrice ? <s>${product[0]?.oldPrice}</s>:null}</p>

                <p className='text-gray-400 mb-4'>{product[0].description}</p>

{/* additional */}
                <div>
                  <p><strong>Category:</strong> {product[0].category}</p>
                                    <p><strong>Color:</strong> {product[0].color}</p>
                                    <div className='flex flex-row gap-1 items-center'>
                                                      <strong>Rating:</strong>
                                                      { <Ratingstars rating={product[0].rating} />}

                                    </div>


                </div>

                <button 
                            onClick={() => handleAddToCart(product[0])} 
                            className={`mt-6 px-6 py-3 rounded-md transition-all duration-300 ${
                                isInCart(product[0].id) 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-primary hover:bg-primary-dark'
                            } text-white`}
                        >
                            {isInCart(product[0].id) 
                    ? `In Cart (${getCartQuantity(product[0].id)})` 
                    : 'Add to Cart'}
                        </button>

                        {/* Add notification */}
                        {showNotification && (
                            <div className="absolute bottom-0 left-0 right-0 mb-16 animate-fade-in-out">
                                <div className="bg-green-500 text-white text-center py-2 px-4 rounded-md shadow-lg">
                                    Added to cart successfully! (Quantity: {getCartQuantity(product[0].id)})
                                </div>
                            </div>
                        )}
        </div>


          </div>
      </section>


      {/* review */}

      <section className='section__container mt-8'>
        Reviews Here
      </section>


    </>
    );
}

export default SingleProduct;
