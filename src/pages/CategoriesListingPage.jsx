import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import API from '../../api';

const CategoriesListingPage = () => {
  const { currentStore } = useStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentStore) {
      fetchCategories();
    }
  }, [currentStore]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.request(
        `${API.endpoints.publicCategories}?store=${currentStore.slug}&limit=50`
      );
      
      // Transform the API response to match our component structure
      const transformedCategories = (response?.categories || []).map((category) => ({
        id: category._id,
        name: category.name,
        path: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
        image: category.image,
        description: category.description,
        productCount: category.productCount || 0,
        level: category.level || 0,
        parent: category.parent
      }));
      
      setCategories(transformedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group categories by level (main categories and subcategories)
  const mainCategories = filteredCategories.filter(cat => cat.level === 0);
  const subCategories = filteredCategories.filter(cat => cat.level > 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchCategories}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header">All Categories</h2>
        <p className="section__subheader">
          Explore our complete collection of categories and discover products that match your style and preferences.
        </p>
      </section>

      <section className="section__container">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} found
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Main Categories */}
        {mainCategories.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Main Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mainCategories.map((category) => (
                <Link 
                  key={category.id} 
                  className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  to={`/categories/${category.path}`}
                >
                                     <div className="relative h-48 overflow-hidden">
                     {category.image ? (
                       <img 
                         src={category.image} 
                         alt={category.name}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                       />
                     ) : (
                       <div className="w-full h-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                         <i className="ri-folder-line text-4xl text-gray-400 group-hover:text-gray-500"></i>
                       </div>
                     )}
                     <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                     <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
                       {category.productCount} products
                     </div>
                   </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sub Categories */}
        {subCategories.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Sub Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subCategories.map((category) => (
                <Link 
                  key={category.id} 
                  className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  to={`/categories/${category.path}`}
                >
                                     <div className="relative h-48 overflow-hidden">
                     {category.image ? (
                       <img 
                         src={category.image} 
                         alt={category.name}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                       />
                     ) : (
                       <div className="w-full h-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                         <i className="ri-folder-line text-4xl text-gray-400 group-hover:text-gray-500"></i>
                       </div>
                     )}
                     <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                     <div className="absolute top-3 right-3 bg-secondary text-white text-xs px-2 py-1 rounded-full">
                       {category.productCount} products
                     </div>
                   </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCategories.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-folder-line text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No categories match "${searchTerm}". Try a different search term.`
                : 'No categories are available at the moment.'
              }
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary-light rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-6">
            Be the first to know about new categories, products, and exclusive offers
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-primary"
            />
            <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoriesListingPage;
