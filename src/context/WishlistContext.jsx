// CACHE BUST - Force reload - Updated: 2025-01-24 22:20
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useCustomer } from './CustomerContext';
import API from '../../api';
import toast from 'react-hot-toast';

// Force reload and debug - Updated at: 2025-01-24 22:15
console.log('=== WISHLIST CONTEXT DEBUG ===');
console.log('API object:', API);
console.log('API methods available:', Object.keys(API));
console.log('API.request type:', typeof API.request);
console.log('API.post type:', typeof API.post);
console.log('API.get type:', typeof API.get);
console.log('API.delete type:', typeof API.delete);
console.log('WishlistContext version: 2.3 - CACHE BUST - ' + new Date().toISOString());
console.log('=== END DEBUG ===');

const WishlistContext = createContext();

// Local storage keys
const WISHLIST_STORAGE_KEY = 'ewa_wishlist';

// Wishlist reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload, loading: false, error: null };
    case 'ADD_TO_WISHLIST':
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { 
        ...state, 
        wishlist: state.wishlist.filter(item => item.productId !== action.payload) 
      };
    case 'CLEAR_WISHLIST':
      return { ...state, wishlist: [] };
    case 'SYNC_WISHLIST':
      return { ...state, wishlist: action.payload };
    default:
      return state;
  }
};

const initialState = {
  wishlist: [],
  loading: false,
  error: null
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { customer, isAuthenticated } = useCustomer();

  // Local storage functions
  const getLocalWishlist = () => {
    try {
      const localWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return localWishlist ? JSON.parse(localWishlist) : [];
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error);
      return [];
    }
  };

  const saveLocalWishlist = (wishlist) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  };

  const clearLocalWishlist = () => {
    try {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing wishlist from localStorage:', error);
    }
  };

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      // Load from local storage for non-authenticated users
      const localWishlist = getLocalWishlist();
      dispatch({ type: 'SET_WISHLIST', payload: localWishlist });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await API.request('/api/wishlist', {
        method: 'GET'
      });
      console.log('Wishlist API response:', response);
      dispatch({ type: 'SET_WISHLIST', payload: response.data || [] });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch wishlist' });

      // Fallback to local storage
      const localWishlist = getLocalWishlist();
      dispatch({ type: 'SET_WISHLIST', payload: localWishlist });
    }
  };

  // Add to wishlist
  const addToWishlist = async (product) => {
    console.log('=== ADD TO WISHLIST DEBUG ===');
    console.log('Product:', product);
    console.log('API object in addToWishlist:', API);
    console.log('API.request available:', typeof API.request);
    console.log('isAuthenticated:', isAuthenticated);
    
    const wishlistItem = {
      productId: product._id || product.id,
      product: product,
      addedAt: new Date().toISOString()
    };

    console.log('Wishlist item:', wishlistItem);

    if (!isAuthenticated) {
      console.log('User not authenticated, using local storage');
      // Add to local storage for non-authenticated users
      const localWishlist = getLocalWishlist();
      const exists = localWishlist.find(item => item.productId === wishlistItem.productId);
      
      if (!exists) {
        const updatedWishlist = [...localWishlist, wishlistItem];
        saveLocalWishlist(updatedWishlist);
        dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });
        toast.success('Added to wishlist!');
      } else {
        toast.error('Product already in wishlist');
      }
      return;
    }

    // Add to database for authenticated users
    try {
      console.log('User authenticated, adding to database');
      console.log('About to call API.request with:', {
        endpoint: '/api/wishlist',
        method: 'POST',
        body: JSON.stringify({ productId: wishlistItem.productId })
      });
      
      const response = await API.request('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({
          productId: wishlistItem.productId
        })
      });
      
      console.log('Add to wishlist response:', response);
      dispatch({ type: 'ADD_TO_WISHLIST', payload: response.data });
      toast.success('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      console.error('Error stack:', error.stack);
      const errorMessage = error.message || 'Failed to add to wishlist';
      toast.error(errorMessage);
    }
    console.log('=== END ADD TO WISHLIST DEBUG ===');
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      // Remove from local storage for non-authenticated users
      const localWishlist = getLocalWishlist();
      const updatedWishlist = localWishlist.filter(item => item.productId !== productId);
      saveLocalWishlist(updatedWishlist);
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      toast.success('Removed from wishlist');
      return;
    }

    // Remove from database for authenticated users
    try {
      await API.request(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      });
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return state.wishlist.some(item => 
      item.productId === productId || 
      item.product?._id === productId || 
      item.product?.id === productId
    );
  };

  // Sync local storage to database when user logs in
  const syncLocalWishlistToDB = async () => {
    if (!isAuthenticated) return;

    const localWishlist = getLocalWishlist();
    if (localWishlist.length === 0) return;

    try {
      // Add each local wishlist item to database
      for (const item of localWishlist) {
        try {
          await API.request('/api/wishlist', {
            method: 'POST',
            body: JSON.stringify({
              productId: item.productId
            })
          });
        } catch (error) {
          // Ignore if already exists in database
          if (error.message?.includes('already exists')) {
            continue;
          }
          console.error('Error syncing wishlist item:', error);
        }
      }

      // Clear local storage after successful sync
      clearLocalWishlist();
      
      // Fetch updated wishlist from database
      await fetchWishlist();
      
      toast.success('Wishlist synced successfully!');
    } catch (error) {
      console.error('Error syncing wishlist:', error);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!isAuthenticated) {
      clearLocalWishlist();
      dispatch({ type: 'CLEAR_WISHLIST' });
      toast.success('Wishlist cleared');
      return;
    }

    try {
      await API.request('/api/wishlist', {
        method: 'DELETE'
      });
      dispatch({ type: 'CLEAR_WISHLIST' });
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  // Load wishlist when component mounts or user authentication changes
  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  // Sync local wishlist to database when user logs in
  useEffect(() => {
    if (isAuthenticated && customer) {
      syncLocalWishlistToDB();
    }
  }, [isAuthenticated, customer]);

  const value = {
    wishlist: state.wishlist,
    loading: state.loading,
    error: state.error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
