import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import products from '../../../data/products.json';
import Ratingstars from '../../../Components/Ratingstars';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, decreaseCart } from '../../../redux/cartSlice';
import { useCallback } from 'react';
import ProductCards from '../ProductCards';
import { FaTag, FaTshirt, FaRulerCombined, FaWarehouse, FaBarcode, FaGlobeAsia, FaShieldAlt, FaTruck, FaGift, FaListUl, FaPalette } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const cart = useSelector((state) => state.cart);
    const product = products.filter((product) => product.id == id);

    // Add a fallback if product not found
    if (!product[0]) {
      return <div className="p-8 text-center text-red-600">Product not found.</div>;
    }

    // Now you can safely use product[0] in useState and everywhere else
    const [selectedSize, setSelectedSize] = useState(
      product[0]?.size && Array.isArray(product[0].size) ? product[0].size[0] : ''
    );
    const [selectedColor, setSelectedColor] = useState(
      product[0]?.color || (Array.isArray(product[0]?.colors) ? product[0].colors[0] : '')
    );

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
        <h3 className='text-2xl font-semibold mb-4 flex items-center gap-2'><FaTag className="inline text-primary" />{product[0].name}</h3>
           <p className="mb-2">
             <span className="text-xl font-bold">₹{product[0].price}</span>
             {product[0].oldPrice ? <span className="ml-2 text-gray-400 line-through">₹{product[0]?.oldPrice}</span> : null}
           </p>
                <p className='text-gray-400 mb-4'>{product[0].description}</p>

           {/* Additional Product Details */}
           <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
             <div className="flex items-center"><FaTshirt className="mr-2 text-primary" /><span className="font-semibold">Brand:</span></div>
             <div className="text-gray-700">{product[0].brand}</div>

             <div className="flex items-center"><FaRulerCombined className="mr-2 text-primary" /><span className="font-semibold">Material:</span></div>
             <div className="text-gray-700">{product[0].material}</div>

             <div className="flex items-center"><FaWarehouse className="mr-2 text-primary" /><span className="font-semibold">Size:</span></div>
             <div className="text-gray-700">
               {Array.isArray(product[0].size) && product[0].size.length > 1 ? (
                 <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="border rounded px-2 py-1">
                   {product[0].size.map((sz, idx) => (
                     <option key={idx} value={sz}>{sz}</option>
                   ))}
                 </select>
               ) : (
                 <span>{Array.isArray(product[0].size) ? product[0].size.join(', ') : product[0].size}</span>
               )}
             </div>

             <div className="flex items-center"><FaListUl className="mr-2 text-primary" /><span className="font-semibold">Care Instructions:</span></div>
             <div className="text-gray-700">{product[0].careInstructions}</div>

             <div className="flex items-center"><FaWarehouse className="mr-2 text-primary" /><span className="font-semibold">Availability:</span></div>
             <div className={product[0].availability === 'In Stock' ? 'text-green-600' : 'text-red-600'}>{product[0].availability}</div>

             <div className="flex items-center"><FaBarcode className="mr-2 text-primary" /><span className="font-semibold">SKU:</span></div>
             <div className="text-gray-700">{product[0].sku}</div>

             <div className="flex items-center"><FaGlobeAsia className="mr-2 text-primary" /><span className="font-semibold">Country of Origin:</span></div>
             <div className="text-gray-700">{product[0].countryOfOrigin}</div>

             <div className="flex items-center"><FaShieldAlt className="mr-2 text-primary" /><span className="font-semibold">Warranty:</span></div>
             <div className="text-gray-700">{product[0].warranty}</div>

             <div className="flex items-center"><FaTruck className="mr-2 text-primary" /><span className="font-semibold">Delivery Info:</span></div>
             <div className="text-gray-700">{product[0].deliveryInfo}</div>

             {/* Color Options */}
             {Array.isArray(product[0].colors) && product[0].colors.length > 1 && (
               <>
                 <div className="flex items-center"><FaPalette className="mr-2 text-primary" /><span className="font-semibold">Color:</span></div>
                 <div className="flex items-center gap-2">
                   {product[0].colors.map((clr, idx) => (
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
           {product[0].offers && product[0].offers.length > 0 && (
             <div className="mb-4">
               <h4 className="font-semibold mb-1 flex items-center gap-1"><FaGift className="text-primary" />Offers:</h4>
               <ul className="list-disc list-inside text-green-700">
                 {product[0].offers.map((offer, idx) => (
                   <li key={idx}>{offer}</li>
                 ))}
               </ul>
             </div>
           )}

           {/* Features */}
           {product[0].features && product[0].features.length > 0 && (
             <div className="mb-4">
               <h4 className="font-semibold mb-1 flex items-center gap-1"><FaListUl className="text-primary" />Features:</h4>
               <ul className="list-disc list-inside text-gray-700">
                 {product[0].features.map((feature, idx) => (
                   <li key={idx}>{feature}</li>
                 ))}
               </ul>
             </div>
           )}

                <div>
                  <p><strong>Category:</strong> {product[0].category}</p>
             {/* Color fallback if not multiple options */}
             {!(Array.isArray(product[0].colors) && product[0].colors.length > 1) && (
                                    <p><strong>Color:</strong> {product[0].color}</p>
             )}
                                    <div className='flex flex-row gap-1 items-center'>
                                                      <strong>Rating:</strong>
                                                      { <Ratingstars rating={product[0].rating} />}
             </div>
                                    </div>

           {/* Show selected options */}
           <div className="my-4">
             <span className="inline-block bg-gray-100 rounded px-3 py-1 mr-2">Selected Size: <strong>{selectedSize}</strong></span>
             {selectedColor && <span className="inline-block bg-gray-100 rounded px-3 py-1">Selected Color: <strong>{selectedColor}</strong></span>}
                </div>

           {/* Cart Quantity Controls */}
           <div className="mt-4 flex flex-col gap-2">
             {isInCart(product[0].id) ? (
               <>
                 <div className="flex items-center gap-2">
                   <button
                     className="bg-primary text-white px-3 py-1 rounded-l hover:bg-primary-dark text-lg"
                     onClick={() => {
                       if (getCartQuantity(product[0].id) === 1) {
                         dispatch(removeFromCart(product[0]));
                       } else {
                         dispatch(decreaseCart(product[0]));
                       }
                     }}
                     aria-label="Decrease quantity"
                   >
                     -
                   </button>
                   <span className="px-4 py-1 border-t border-b border-gray-300 bg-white text-lg">
                     {getCartQuantity(product[0].id)}
                   </span>
                   <button
                     className="bg-primary text-white px-3 py-1 rounded-r hover:bg-primary-dark text-lg"
                     onClick={() => handleAddToCart(product[0])}
                     aria-label="Increase quantity"
                     disabled={getCartQuantity(product[0].id) >= (product[0].stock || 99)}
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
                product[0].stock === 0 ? (
                  <div className="w-full py-3 rounded-md font-medium bg-gray-200 text-gray-500 text-center">Out of Stock</div>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(product[0])} 
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
                                    Added to cart successfully! (Quantity: {getCartQuantity(product[0].id)})
                                </div>
                            </div>
                        )}
        </div>


          </div>
      </section>


      {/* review */}

      <section className='section__container mt-8'>
        <h2 className="text-xl font-semibold mb-4">Customer Feedback</h2>
        <ReviewSection productId={product[0].id} />
      </section>

      {/* Related Products */}
      <section className='section__container mt-8'>
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <ProductCards products={products.filter(p => p.category === product[0].category && p.id !== product[0].id).slice(0, 4)} />
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
