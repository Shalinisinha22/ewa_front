import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import API from '../../../api';

const Categories = () => {
  const { currentStore } = useStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                    `${API.endpoints.publicCategories}?store=${currentStore.slug}&topLevel=true&limit=8`
      );
      
      // Transform the API response to match our component structure
      const transformedCategories = (response?.categories || []).map((category) => ({
        id: category._id,
        name: category.name,
        path: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
        image: category.image,
        description: category.description,
        productCount: category.productCount || 0
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

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No categories available at the moment.</p>
      </div>
    );
  }

  return (
    <>
             <div className='product__grid'>
         {categories.map((category) => (
           <Link key={category.id} className='categories__card' to={`/categories/${category.path}`}>
             {category.image ? (
               <img src={category.image} alt={category.name} />
             ) : (
               <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                 <i className="ri-folder-line text-3xl text-gray-400"></i>
               </div>
             )}
             <h4>{category.name}</h4>
             {category.productCount > 0 && (
               <p className="text-sm text-gray-500 mt-1">{category.productCount} products</p>
             )}
           </Link>
         ))}
       </div>
    </>
  );
};

export default Categories;
