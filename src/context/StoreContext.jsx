import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../../api';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [currentStore, setCurrentStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const identifyStore = async () => {
    try {
      setLoading(true);
      setError(null);

      // Method 1: Check subdomain
      let storeIdentifier = null;
      const host = window.location.hostname;
      if (host && host.includes('.')) {
        const subdomain = host.split('.')[0];
        if (subdomain !== 'www' && subdomain !== 'localhost' && subdomain !== '127') {
          storeIdentifier = subdomain;
        }
      }

      // Method 2: Check URL parameters
      if (!storeIdentifier) {
        const urlParams = new URLSearchParams(window.location.search);
        storeIdentifier = urlParams.get('store');
      }

      // Method 3: Check localStorage (for development)
      if (!storeIdentifier) {
        storeIdentifier = localStorage.getItem('currentStore');
      }

      if (storeIdentifier) {
        // Fetch store information using name or slug
        const response = await API.request(`${API.endpoints.stores}/public/${storeIdentifier}`);
        setCurrentStore(response.store);
        localStorage.setItem('currentStore', storeIdentifier);
      } else {
        // For development, try to get a default store
        const response = await API.request(`${API.endpoints.stores}/public/default`);
        setCurrentStore(response.store);
      }
    } catch (error) {
      console.error('Error identifying store:', error);
      setError('Failed to identify store');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    identifyStore();
  }, []);

  const value = {
    currentStore,
    loading,
    error,
    identifyStore
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}; 