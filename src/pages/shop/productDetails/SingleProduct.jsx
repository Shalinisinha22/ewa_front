import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Ratingstars from '../../../Components/Ratingstars';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, decreaseCart } from '../../../redux/cartSlice';
import { useCallback } from 'react';
import ProductCards from '../ProductCards';
import { FaTag, FaTshirt, FaRulerCombined, FaWarehouse, FaBarcode, FaGlobeAsia, FaShieldAlt, FaTruck, FaGift, FaListUl, FaPalette } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../context/StoreContext';
import API from '../../../../api';

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentStore } = useStore();
    const [showNotification, setShowNotification] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [productMedia, setProductMedia] = useState([]);
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
                src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' 
            });
        }
        
        return media;
    };

    // Fetch product details
    useEffect(() => {
        if (currentStore && id) {
            fetchProductDetails();
        }
    }, [currentStore, id]);

    // Update selected size and color when product changes
    useEffect(() => {
        if (product) {
            setSelectedSize(
                product.attributes?.size && Array.isArray(product.attributes.size) ? product.attributes.size[0] : ''
            );
            setSelectedColor(
                product.attributes?.color || ''
            );
            
            // Update product media when product changes
            const media = getProductMedia(product);
            setProductMedia(media);
        }
    }, [product]);

    // Scroll to top when id changes
    useEffect(() => {
        window.scrollTo(0,0)
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch product details
            const response = await API.request(`${API.endpoints.publicProducts}/${id}?store=${currentStore.name}`);
            const productData = response.product || response;
            
            // Process product data
            const processedProduct = processProductData(productData);
            setProduct(processedProduct);
            
            // Fetch related products
            if (productData.category?._id) {
                const relatedResponse = await API.request(`${API.endpoints.publicProductsByCategory}/${productData.category._id}?store=${currentStore.name}&limit=4`);
                const relatedData = relatedResponse.products || relatedResponse || [];
                const processedRelated = relatedData
                    .filter(p => p._id !== productData._id)
                    .map(processProductData);
                setRelatedProducts(processedRelated);
            }
            
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    // Process product data to handle stringified arrays and fix data structure
    const processProductData = (productData) => {
        const processArrayField = (field) => {
            if (Array.isArray(field)) {
                return field.map(item => {
                    if (typeof item === 'string' && item.startsWith('[') && item.endsWith(']')) {
                        try {
                            return JSON.parse(item);
                        } catch {
                            return item;
                        }
                    }
                    return item;
                }).flat();
            }
            return field;
        };

        return {
            ...productData,
            image: productData.images && productData.images.length > 0 
                ? API.getImageUrl(productData.images[0]) 
                : null,
            // Fix attributes
            attributes: productData.attributes ? {
                ...productData.attributes,
                size: processArrayField(productData.attributes.size),
                color: productData.attributes.color
            } : {},
            // Fix SEO keywords
            seo: productData.seo ? {
                ...productData.seo,
                keywords: processArrayField(productData.seo.keywords)
            } : {},
            // Fix tags
            tags: processArrayField(productData.tags || []),
            // Ensure category is properly handled
            category: productData.category?.name || productData.category
        };
    };

    // Add a fallback if product not found
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="p-8 text-center text-red-600">
                {error || 'Product not found.'}
            </div>
        );
    }

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

    const handleAddToCart = (product) => {
        const productToAdd = {
            ...product,
            id: product._id, // Ensure both id and _id are available for cart compatibility
            _id: product._id
        };
        dispatch(addToCart(productToAdd));
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
             {product.name}
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
                    alt={`${product.name} view ${currentImageIndex + 1}`}
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
        <h3 className='text-2xl font-semibold mb-4 flex items-center gap-2'><FaTag className="inline text-primary" />{product.name}</h3>
           <p className="mb-2">
             <span className="text-xl font-bold">₹{product.price}</span>
             {product.oldPrice ? <span className="ml-2 text-gray-400 line-through">₹{product.oldPrice}</span> : null}
           </p>
                <p className='text-gray-400 mb-4'>{product.description}</p>

           {/* Additional Product Details */}
           <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
             <div className="flex items-center"><FaTshirt className="mr-2 text-primary" /><span className="font-semibold">Brand:</span></div>
             <div className="text-gray-700">{product.brand}</div>

             <div className="flex items-center"><FaRulerCombined className="mr-2 text-primary" /><span className="font-semibold">Material:</span></div>
             <div className="text-gray-700">{product.material}</div>

             <div className="flex items-center"><FaWarehouse className="mr-2 text-primary" /><span className="font-semibold">Size:</span></div>
             <div className="text-gray-700">
               {Array.isArray(product.attributes?.size) && product.attributes.size.length > 1 ? (
                 <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="border rounded px-2 py-1">
                   {product.attributes.size.map((sz, idx) => (
                     <option key={idx} value={sz}>{sz}</option>
                   ))}
                 </select>
               ) : (
                 <span>{Array.isArray(product.attributes?.size) ? product.attributes.size.join(', ') : product.attributes?.size}</span>
               )}
             </div>

             <div className="flex items-center"><FaListUl className="mr-2 text-primary" /><span className="font-semibold">Care Instructions:</span></div>
             <div className="text-gray-700">{product.careInstructions}</div>

             <div className="flex items-center"><FaWarehouse className="mr-2 text-primary" /><span className="font-semibold">Availability:</span></div>
             <div className={getStockQuantity(product) > 0 ? 'text-green-600' : 'text-red-600'}>
               {getStockQuantity(product) > 0 ? 'In Stock' : 'Out of Stock'}
             </div>

             <div className="flex items-center"><FaBarcode className="mr-2 text-primary" /><span className="font-semibold">SKU:</span></div>
             <div className="text-gray-700">{product.sku}</div>

             <div className="flex items-center"><FaGlobeAsia className="mr-2 text-primary" /><span className="font-semibold">Country of Origin:</span></div>
             <div className="text-gray-700">{product.countryOfOrigin}</div>

             <div className="flex items-center"><FaShieldAlt className="mr-2 text-primary" /><span className="font-semibold">Warranty:</span></div>
             <div className="text-gray-700">{product.warranty}</div>

             <div className="flex items-center"><FaTruck className="mr-2 text-primary" /><span className="font-semibold">Delivery Info:</span></div>
             <div className="text-gray-700">{product.deliveryInfo}</div>

             {/* Color Options */}
             {Array.isArray(product.attributes?.color) && product.attributes.color.length > 1 && (
               <>
                 <div className="flex items-center"><FaPalette className="mr-2 text-primary" /><span className="font-semibold">Color:</span></div>
                 <div className="flex items-center gap-2">
                   {product.attributes.color.map((clr, idx) => (
                     <button
                       key={idx}
                       onClick={() => setSelectedColor(clr)}
                       className={`w-6 h-6 rounded-full border-2 ${selectedColor === clr ? 'border-primary' : 'border-gray-300'}`}
                       style={{ backgroundColor: clr }}
                       aria-label={clr}
                     />
                   ))}
                   <span className="ml-2 text-gray-700">{selectedColor}</span>
                 </div>
               </>
             )}
           </div>

           {/* Offers */}
           {product.offers && product.offers.length > 0 && (
             <div className="mb-4">
               <h4 className="font-semibold mb-1 flex items-center gap-1"><FaGift className="text-primary" />Offers:</h4>
               <ul className="list-disc list-inside text-green-700">
                 {product.offers.map((offer, idx) => (
                   <li key={idx}>{offer}</li>
                 ))}
               </ul>
             </div>
           )}

           {/* Features */}
           {product.features && product.features.length > 0 && (
             <div className="mb-4">
               <h4 className="font-semibold mb-1 flex items-center gap-1"><FaListUl className="text-primary" />Features:</h4>
               <ul className="list-disc list-inside text-gray-700">
                 {product.features.map((feature, idx) => (
                   <li key={idx}>{feature}</li>
                 ))}
               </ul>
             </div>
           )}

                <div>
                  <p><strong>Category:</strong> {product.category}</p>
             {/* Color fallback if not multiple options */}
             {!(Array.isArray(product.attributes?.color) && product.attributes.color.length > 1) && (
                                    <p><strong>Color:</strong> {product.attributes?.color}</p>
             )}
                                    <div className='flex flex-row gap-1 items-center'>
                                                      <strong>Rating:</strong>
                                                      { <Ratingstars rating={product.rating} />}
             </div>
                                    </div>

           {/* Show selected options */}
           <div className="my-4">
             <span className="inline-block bg-gray-100 rounded px-3 py-1 mr-2">Selected Size: <strong>{selectedSize}</strong></span>
             {selectedColor && <span className="inline-block bg-gray-100 rounded px-3 py-1">Selected Color: <strong>{selectedColor}</strong></span>}
                </div>

           {/* Cart Quantity Controls */}
           <div className="mt-4 flex flex-col gap-2">
             {isInCart(product._id) ? (
               <>
                 <div className="flex items-center gap-2">
                   <button
                     className="bg-primary text-white px-3 py-1 rounded-l hover:bg-primary-dark text-lg"
                     onClick={() => {
                       if (getCartQuantity(product._id) === 1) {
                         dispatch(removeFromCart(product));
                       } else {
                         dispatch(decreaseCart(product));
                       }
                     }}
                     aria-label="Decrease quantity"
                   >
                     -
                   </button>
                   <span className="px-4 py-1 border-t border-b border-gray-300 bg-white text-lg">
                     {getCartQuantity(product._id)}
                   </span>
                   <button
                     className="bg-primary text-white px-3 py-1 rounded-r hover:bg-primary-dark text-lg"
                     onClick={() => handleAddToCart(product)}
                     aria-label="Increase quantity"
                     disabled={getCartQuantity(product._id) >= (getStockQuantity(product) || 99)}
                   >
                     +
                   </button>
                 </div>
                 <button
                   className="w-full py-2 rounded font-medium bg-primary hover:bg-primary-dark text-white transition-colors duration-300"
                   onClick={() => navigate('/cart')}
                 >
                   Go to Cart
                 </button>
               </>
             ) : (
               getStockQuantity(product) === 0 ? (
                 <div className="w-full py-3 rounded-md font-medium bg-gray-200 text-gray-500 text-center">Out of Stock</div>
               ) : (
                 <button 
                   onClick={() => handleAddToCart(product)} 
                   className="px-6 py-3 rounded-md transition-all duration-300 bg-primary hover:bg-primary-dark text-white"
                 >
                   Add to Cart
                 </button>
               )
             )}
           </div>

                        {/* Add notification */}
                        {showNotification && (
                            <div className="absolute bottom-0 left-0 right-0 mb-16 animate-fade-in-out">
                                <div className="bg-green-500 text-white text-center py-2 px-4 rounded-md shadow-lg">
                                    Added to cart successfully! (Quantity: {getCartQuantity(product._id)})
                                </div>
                            </div>
                        )}
        </div>


          </div>
      </section>


      {/* review */}

      <section className='section__container mt-8'>
        <h2 className="text-xl font-semibold mb-4">Customer Feedback</h2>
        <ReviewSection productId={product._id} />
      </section>

      {/* Related Products */}
      <section className='section__container mt-8'>
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <ProductCards products={relatedProducts} />
      </section>


    </>
    );
}

export default SingleProduct;

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([
    { name: 'Alice', comment: 'Great product!', rating: 5 },
    { name: 'Bob', comment: 'Good value for money.', rating: 4 },
  ]);
  const [form, setForm] = useState({ name: '', comment: '', rating: 5 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.comment) {
      setReviews((prev) => [
        { name: form.name, comment: form.comment, rating: form.rating },
        ...prev,
      ]);
      setForm({ name: '', comment: '', rating: 5 });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 md:flex-row md:items-end">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="border rounded px-3 py-2 mr-2"
          required
        />
        <input
          type="text"
          name="comment"
          value={form.comment}
          onChange={handleChange}
          placeholder="Your Feedback"
          className="border rounded px-3 py-2 mr-2"
          required
        />
        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
          className="border rounded px-3 py-2 mr-2"
        >
          {[5,4,3,2,1].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
          ))}
        </select>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">Submit</button>
      </form>
      <div className="space-y-4">
        {reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}
        {reviews.map((rev, idx) => (
          <div key={idx} className="border-b pb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{rev.name}</span>
              <span className="text-yellow-500">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
            </div>
            <p className="text-gray-700">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
