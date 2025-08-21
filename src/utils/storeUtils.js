// Get store name from document title
export const getStoreNameFromTitle = () => {
  const title = document.title;
  // Remove "EWA Luxe" if it's the default title
  if (title === 'EWA Luxe') {
    return 'Ewa Luxe'; // Default store name
  }
  return title;
};

// Get store name from localStorage or fallback to title
export const getCurrentStoreName = () => {
  const storedStoreName = localStorage.getItem('storeName');
  if (storedStoreName) {
    return storedStoreName;
  }
  return getStoreNameFromTitle();
};

// Get store ID from localStorage
export const getCurrentStoreId = () => {
  return localStorage.getItem('storeId');
};

// Check if user is authenticated for current store
export const isAuthenticatedForStore = () => {
  const token = localStorage.getItem('token');
  const storeId = localStorage.getItem('storeId');
  return !!(token && storeId);
}; 