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
    const cart = useSelector((state) => state.cart);

    const product = products.filter((product) => product.id == id);

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
          <div className='md:w-1/2 w-full'>
            <img className='rounded-md w-full h-auto' src={product[0].image} alt={product[0].name}></img>
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
