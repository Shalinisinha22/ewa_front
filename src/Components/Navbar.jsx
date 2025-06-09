import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getTotals } from '../redux/cartSlice'

const Navbar = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const user = localStorage.getItem('token'); // Get user token

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  return (
    <header className=''>
   <nav className='max-w-screen-2xl mx-auto px-4 flex  justify-between items-center'>

     <ul className='nav__links'>
        <li className='link'><Link to="/">Home</Link></li>
        <li className='link'><Link to="/shop">Shop</Link></li>
        {/* <li className='link'><Link to="/">Pages</Link></li> */}
        <li className='link'><Link to="/contact">Contact</Link></li>
            {/* <li className='link'><Link to="/login">Login</Link></li> */}
         
             </ul>

{/* logo */}
             <div className='nav__logo'>
               <Link to="/">EWA<span>.</span></Link>
             </div>


             {/* nav icons */}
             <div className='nav__icons relative flex items-center gap-4'>
    <span>
        <Link to="/search">
            <i className="ri-search-line"></i>
        </Link>
    </span>
    <button className='hover:text-primary'>
        <Link to="/cart">
            <i className="ri-shopping-bag-line"></i>   
            <sup className='text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center'>
                {cart.cartTotalQuantity}
            </sup>       
        </Link>
    </button>
    
    {user ? (
        <div className="flex items-center gap-2">
            <span className="text-sm">{user.name}</span>
            <Link to="/profile">
                <i className="ri-user-line hover:text-primary"></i>
            </Link>
        </div>
    ) : (
        <div className="flex items-center gap-3">
            <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary border border-gray-300 rounded-md transition duration-300 hover:border-primary"
            >
                Login
            </Link>
            <Link 
                to="/signup" 
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition duration-300"
            >
                Sign Up
            </Link>
        </div>
    )}
</div>





    
    </nav>




    </header>
  )
}

export default Navbar
