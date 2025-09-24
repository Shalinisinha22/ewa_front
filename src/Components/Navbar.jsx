import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getTotals } from '../redux/cartSlice'
import { useStore } from '../context/StoreContext';
import { useCustomer } from '../context/CustomerContext';
import { useTheme } from '../hooks/useTheme';
// import API from '../../../api'
import API from '../../api'

const Navbar = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { currentStore } = useStore();
  const { customer, logout } = useCustomer();
  const { theme, logo, storeName } = useTheme();
  const user = localStorage.getItem('token'); // Get user token
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    dispatch(getTotals());
    if (currentStore) {
      fetchCategories();
    }
  }, [cart, dispatch, currentStore]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
              const response = await API.request(`${API.endpoints.publicCategories}?store=${currentStore.slug}`);
      // Filter only active categories and sort by sortOrder
      const activeCategories = (response.categories || response || [])
        .filter(cat => cat.status === 'active')
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(category => ({
          ...category,
          name: category.name || 'Unnamed Category',
          slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || 'unnamed-category'
        }));
      setCategories(activeCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { name: 'Women', slug: 'womens' },
        { name: "Men's", slug: 'mens' }
      ]);
    } finally {
      setLoading(false);
    }
  };

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
            {loading ? (
              <div className="px-4 py-2 text-gray-500">Loading...</div>
            ) : (
              categories.map((category) => (
                <Link 
                  key={category._id || category.slug} 
                  to={`/categories/${category.slug}`} 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {category.name}
                </Link>
              ))
            )}
          </div>
        </li>
        {/* <li className='link'><Link to="/">Pages</Link></li> */}
        <li className='link'><Link to="/contact">Contact</Link></li>
            {/* <li className='link'><Link to="/login">Login</Link></li> */}
         
             </ul>

{/* logo */}
             <div className='nav__logo'>
               <Link to="/" className="flex items-center">
                 {logo ? (
                   <img 
                     src={API.getImageUrl(logo)} 
                     alt={storeName}
                     className="h-8 w-auto"
                   />
                 ) : (
                   <span>{storeName}<span className="text-primary">.</span></span>
                 )}
               </Link>
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
    
    {user && customer ? (
        <div className="relative profile-dropdown">
            <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
                <span className="hidden md:block">{customer.firstName || 'User'}</span>
                <i className="ri-user-line"></i>
                <i className="ri-arrow-down-s-line text-xs"></i>
            </button>
            
            {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                    </div>
                    
                    <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                    >
                        <i className="ri-user-line mr-2"></i>
                        My Profile
                    </Link>
                    
                    <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                    >
                        <i className="ri-shopping-bag-line mr-2"></i>
                        My Orders
                    </Link>
                    
                    <Link 
                        to="/wishlist" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                    >
                        <i className="ri-heart-line mr-2"></i>
                        Wishlist
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-1 pt-1">
                        <button 
                            onClick={() => {
                                logout();
                                setShowProfileDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <i className="ri-logout-box-line mr-2"></i>
                            Logout
                        </button>
                    </div>
                </div>
            )}
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
