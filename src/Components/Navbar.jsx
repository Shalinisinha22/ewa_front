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
        <li className='link'><Link to="/new-arrivals">New Arrivals</Link></li>
        <li className='link relative group'>
          <Link to="/" className="flex items-center">
            Shop <i className="ri-arrow-down-s-line ml-1"></i>
          </Link>
          <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            <Link to="/categories/accessories" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Accessories</Link>
            <Link to="/categories/dress" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dress Collection</Link>
            <Link to="/categories/jewellery" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Jewellery</Link>
            <Link to="/categories/cosmetics" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Cosmetics</Link>
          </div>
        </li>
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
    {/* Search Bar */}
    <div className="relative hidden md:block">
        <Link to="/search" className="flex items-center bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors">
            <i className="ri-search-line mr-2"></i>
            <span className="text-sm text-gray-600">Search products...</span>
        </Link>
    </div>
    <span>
        <Link to="/search">
            <i className="ri-search-line md:hidden"></i>
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
