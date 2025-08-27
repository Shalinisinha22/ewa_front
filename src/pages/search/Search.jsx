import React, { useEffect, useState, useCallback } from 'react';
import ProductCards from '../shop/ProductCards';
import { useStore } from '../../context/StoreContext';
import API from '../../../api';

// Debounce utility function
const debounce = (func, delay) => {
    let timeoutId;
    const debouncedFunction = (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
    
    debouncedFunction.cancel = () => {
        clearTimeout(timeoutId);
    };
    
    return debouncedFunction;
};

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');   
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        inStock: false
    });
    const { currentStore } = useStore();

    // Fetch categories for filter dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.request(
                    `${API.endpoints.publicCategories}?store=${currentStore?.slug || 'ewa-luxe'}`
                );
                setCategories(response.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        if (currentStore) {
            fetchCategories();
        }
    }, [currentStore]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.trim() === '' || query.length < 2) {
                setIsTyping(false);
                return;
            }

            try {
                setLoading(true);
                setIsTyping(false);
                setError(null);
                setSearchPerformed(true);
                
                const response = await API.request(buildSearchUrl(query));
                setFilteredProducts(response.products || []);
            } catch (error) {
                console.error('Error searching products:', error);
                setError('Failed to search products. Please try again.');
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        }, 500), // 500ms delay
        [filters, currentStore]
    );

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        
        if (query.trim() === '') {
            setFilteredProducts([]);
            setSearchPerformed(false);
            setLoading(false);
            setIsTyping(false);
            return;
        }

        if (query.length >= 2) {
            setIsTyping(true);
        }

        // Call debounced search
        debouncedSearch(query);
    };

    const buildSearchUrl = (query = searchQuery) => {
        let url = `${API.endpoints.publicProducts}?store=${currentStore?.slug || 'ewa-luxe'}&limit=50`;
        
        if (query.trim()) {
            url += `&keyword=${encodeURIComponent(query)}`;
        }
        
        if (filters.category) {
            url += `&category=${filters.category}`;
        }
        
        if (filters.minPrice) {
            url += `&minPrice=${filters.minPrice}`;
        }
        
        if (filters.maxPrice) {
            url += `&maxPrice=${filters.maxPrice}`;
        }
        
        if (filters.inStock) {
            url += `&inStock=true`;
        }
        
        return url;
    };

    const handleSearchButton = async () => {
        if (searchQuery.trim() === '' && !filters.category && !filters.minPrice && !filters.maxPrice && !filters.inStock) return;
        
        try {
            setLoading(true);
            setError(null);
            setSearchPerformed(true);
            
            const response = await API.request(buildSearchUrl());
            setFilteredProducts(response.products || []);
        } catch (error) {
            console.error('Error searching products:', error);
            setError('Failed to search products. Please try again.');
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            inStock: false
        });
        setSearchQuery('');
        setFilteredProducts([]);
        setSearchPerformed(false);
        setIsTyping(false);
        setLoading(false);
        setError(null);
        
        // Cancel any pending debounced search
        debouncedSearch.cancel();
    };

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredProducts([]);
            setSearchPerformed(false);
        }
    }, [searchQuery]);

    // Cleanup debounced function on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel?.();
        };
    }, [debouncedSearch]);
  return (
    <>
         <section className='section__container bg-primary-light' >
        <h2 className='section__header capitalize'>Search Products</h2>
        <p className='section__subheader'>Find exactly what you're looking for from our extensive collection of fashion items and accessories.</p>
     </section>

     <section className='section__container'>
        <div className='w-full mb-8 flex flex-col md:flex-row items-center gap-4 justify-center'>
            <input 
                type="text" 
                placeholder="Search for products..." 
                value={searchQuery} 
                onChange={handleSearch} 
                onKeyPress={(e) => e.key === 'Enter' && handleSearchButton()}
                className="search-bar w-full max-w-4xl p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                disabled={loading}
            />
            <button 
                onClick={handleSearchButton} 
                disabled={loading}
                className='search-button w-full md:w-auto py-3 px-8 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
                {loading ? 'Searching...' : 'Search'}
            </button>
        </div>

        {/* Advanced Filters */}
        <div className='mb-8 p-6 bg-gray-50 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <i className="ri-filter-line"></i>
                Filters
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {/* Category Filter */}
                <div>
                    <label className='block text-sm font-medium mb-2'>Category</label>
                    <select 
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className='w-full p-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <label className='block text-sm font-medium mb-2'>Min Price</label>
                    <input 
                        type="number" 
                        placeholder="₹0"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className='w-full p-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium mb-2'>Max Price</label>
                    <input 
                        type="number" 
                        placeholder="₹10000"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className='w-full p-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    />
                </div>

                {/* Stock Filter */}
                <div>
                    <label className='block text-sm font-medium mb-2'>Availability</label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                        <input 
                            type="checkbox" 
                            checked={filters.inStock}
                            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                            className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2'
                        />
                        <span className='text-sm'>In Stock Only</span>
                    </label>
                </div>
            </div>

            {/* Filter Actions */}
            <div className='mt-4 flex gap-3'>
                <button 
                    onClick={handleSearchButton}
                    disabled={loading}
                    className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400'
                >
                    Apply Filters
                </button>
                <button 
                    onClick={clearFilters}
                    className='px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
                >
                    Clear All
                </button>
            </div>
        </div>

        {/* Typing Indicator */}
        {isTyping && !loading && (
            <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                    <div className="animate-pulse">
                        <i className="ri-search-line"></i>
                    </div>
                    <span className="text-sm">Searching as you type...</span>
                </div>
            </div>
        )}

        {/* Loading State */}
        {loading && (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Searching products...</p>
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                    onClick={handleSearchButton}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
                >
                    Try Again
                </button>
            </div>
        )}

        {/* Results */}
        {!loading && !error && searchPerformed && (
            <div className="mb-6">
                <h3 className="text-xl font-medium">
                    {filteredProducts.length} Results for "{searchQuery}"
                </h3>
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-600 text-lg mb-2">No products found</p>
                        <p className="text-gray-500">Try searching with different keywords</p>
                    </div>
                )}
            </div>
        )}

        {/* Products */}
        {!loading && !error && filteredProducts.length > 0 && (
            <div className="mt-6">
                <ProductCards products={filteredProducts} />
            </div>
        )}

     </section>
    </>
  );
}

export default Search;
