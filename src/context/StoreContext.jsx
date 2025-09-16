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

  // Apply dynamic theme colors to CSS variables
  const applyTheme = (store) => {
    if (store?.settings?.theme) {
      const { primaryColor, secondaryColor } = store.settings.theme;
      
      // Update CSS custom properties
      if (primaryColor) {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--color-primary', primaryColor);
        
        // Create a darker variant for primary color
        const primaryColorDark = darkenColor(primaryColor, 0.1);
        document.documentElement.style.setProperty('--primary-color-dark', primaryColorDark);
        
        // Create a lighter variant for primary color
        const primaryColorLight = lightenColor(primaryColor, 0.9);
        document.documentElement.style.setProperty('--primary-color-light', primaryColorLight);
      }
      if (secondaryColor) {
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
        document.documentElement.style.setProperty('--color-secondary', secondaryColor);
      }
    }
  };

  // Helper function to darken a color
  const darkenColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.round(255 * amount));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.round(255 * amount));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Helper function to lighten a color
  const lightenColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(255 * amount));
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(255 * amount));
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Apply dynamic favicon
  const applyFavicon = (store) => {
    if (store?.favicon) {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(link => link.remove());

      // Add new favicon
      const faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      faviconLink.type = 'image/png';
      faviconLink.href = API.getImageUrl(store.favicon);
      document.head.appendChild(faviconLink);
    }
  };

  // Apply dynamic title (optional - can be disabled)
  const applyTitle = (store, force = false) => {
    // Only apply dynamic title if force is true or if title is still default
    const currentTitle = document.title;
    const isDefaultTitle = ['EWA Luxe', 'Zudio', 'Vite + React', 'React App'].includes(currentTitle);
    
    if (store?.name && (force || isDefaultTitle)) {
      document.title = store.name;
    }
  };

  const identifyStore = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use title for store differentiation
      const currentTitle = document.title;
      
      // Convert title to store identifier (slug format)
      const storeIdentifier = currentTitle.toLowerCase().replace(/\s+/g, '-');
      
      // Clear old store data to prevent caching issues
      localStorage.removeItem('storeName');
      localStorage.removeItem('currentStore');
      localStorage.removeItem('storeId');
      
      // Fetch store information using store query parameter
      const response = await API.request(`${API.endpoints.stores}/public/default?store=${storeIdentifier}`);
      const store = response.store;
      
      setCurrentStore(store);
      
      // Apply dynamic styling
      applyTheme(store);
      applyFavicon(store);
      // Note: Title is not automatically applied - you can call applyTitle(store, true) if needed
      
      localStorage.setItem('currentStore', storeIdentifier);
      // Use the original store identifier from title, not the API response
      localStorage.setItem('storeName', storeIdentifier);
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
    identifyStore,
    applyTheme,
    applyFavicon,
    applyTitle
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}; 