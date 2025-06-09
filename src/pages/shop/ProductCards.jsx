import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Ratingstars from '../../Components/ratingstars';
import { addToCart } from '../../redux/cartSlice';

const ProductCards = ({products}) => {
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(null);
  const cart = useSelector((state) => state.cart);

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

  const handleAddToCart = (product) => {
      const productToAdd = {
        ...product,
        _id: product._id || product.id
      };
      
      dispatch(addToCart(productToAdd));
      setShowNotification(product.id);
      setTimeout(() => setShowNotification(null), 2000);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10'>
      {
        products.slice(0,8).map((product)=>(
            <div key={product.id || product._id} className='product__card'>
                <div className='relative'>
                    <Link to={`/shop/${product.id || product._id}`}>
                        <img src={product.image} 
                             alt={product.name} 
                             className='max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300'/>
                    </Link>

                    <div className='absolute top-2 right-3'>
                       <button 
                         onClick={() => handleAddToCart(product)}
                         className={`relative ${isInCart(product.id || product._id) ? 'opacity-80' : ''}`}
                       >
                         <i className={`ri-shopping-cart-2-line p-1.5 text-white
                           ${isInCart(product.id || product._id) 
                             ? 'bg-green-500 hover:bg-green-600' 
                             : 'bg-primary hover:bg-primary-dark'}`}>
                         </i>
                         {isInCart(product.id || product._id) && (
                           <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 
                                          flex items-center justify-center rounded-full">
                             {getCartQuantity(product.id || product._id)}
                           </span>
                         )}
                       </button>
                    </div>

                    {showNotification === product.id && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-md 
                        animate-fade-in-out shadow-lg">
                        Added to cart! (Qty: {getCartQuantity(product.id || product._id)})
                      </div>
                    )}
                </div>


               {/* product description */}
               <div className='product__card__content'>
                <h4>{product.name}</h4>
                <p>{product.price}{product.oldPrice ? <s>${product?.oldPrice}</s>:null}</p>
                <Ratingstars rating={product.rating} />

                </div>
             
         </div>
        ))
      }
    </div>
  );
}

export default ProductCards;
