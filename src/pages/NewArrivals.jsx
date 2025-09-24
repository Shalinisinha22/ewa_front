import React, { useState, useEffect } from 'react';
import ProductCards from './shop/ProductCards';
import ShopFiltering from './shop/ShopFiltering';
import EmptyState from '../Components/EmptyState';
import BackButton from '../Components/BackButton';
import { useStore } from '../context/StoreContext';
import API from '../../api';

const NewArrivals = () => {
  const { currentStore } = useStore();
  const [newProducts, setNewProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dynamicFilters, setDynamicFilters] = useState({
    categories: [],
    priceRanges: [
      { label: "Under ₹500", min: 0, max: 500 },
      { label: "₹500 - ₹1000", min: 500, max: 1000 },
      { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
      { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
      { label: "₹5000 and above", min: 5000, max: Infinity },
    ],
    colors: ["all"],
  });
  const [filteredState, setFilteredState] = useState({
    categories: "all",
    priceRange: "",
    colors: "all",
  });

  useEffect(() => {
    if (currentStore) {
      fetchNewArrivals();
      fetchCategories();
    }
  }, [currentStore]);

  // Rebuild filters when categories are loaded
  useEffect(() => {
    if (allCategories.length > 0 && newProducts.length > 0) {
      buildDynamicFilters(newProducts, allCategories);
    }
  }, [allCategories, newProducts]);
  useEffect(() => {
    if (allCategories.length > 0 && newProducts.length > 0) {
      buildDynamicFilters(newProducts, allCategories);
    }
  }, [allCategories, newProducts]);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.request(
        `${API.endpoints.publicNewArrivals}?store=${currentStore.slug || currentStore.name}&limit=50`
      );
      
      const products = response.products || response || [];
      
      // Process products to add image URLs and fix data structure
      const processedProducts = products.map(product => {
        const processArrayField = (field) => {
          if (Array.isArray(field)) {
            return field.map(item => {
              if (typeof item === 'string' && item.startsWith('[') && item.endsWith(']')) {
                try {
                  return JSON.parse(item);
                } catch {
                  return item;
                }
              }
              return item;
            }).flat();
          }
          return field;
        };

        return {
          ...product,
          image: product.images && product.images.length > 0 
            ? API.getImageUrl(product.images[0]) 
            : null,
          attributes: product.attributes ? {
            ...product.attributes,
            size: processArrayField(product.attributes.size),
            color: product.attributes.color
          } : {},
          seo: product.seo ? {
            ...product.seo,
            keywords: processArrayField(product.seo.keywords)
          } : {},
          tags: processArrayField(product.tags || []),
          category: product.category?.name || product.category
        };
      });
      
      setNewProducts(processedProducts);
      setFilteredProducts(processedProducts);
      
      // Build dynamic filters based on fetched data
      buildDynamicFilters(processedProducts, allCategories);
      
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      setError('Failed to load new arrivals');
      setNewProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await API.request(`${API.endpoints.publicCategories}?store=${currentStore.slug || currentStore.name}&limit=50`);
      const categories = categoriesResponse.categories || categoriesResponse || [];
      setAllCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const buildDynamicFilters = (products, categories = []) => {
    // Build category filter from API categories
    const categoryFilters = ["all"];
    if (categories.length > 0) {
      categories.forEach(cat => {
        if (cat.slug && !categoryFilters.includes(cat.slug)) {
          categoryFilters.push(cat.slug);
        }
      });
    }
    
    // Extract unique colors from products
    const colorSet = new Set(["all"]);
    products.forEach(product => {
      if (product.attributes?.color) {
        const color = product.attributes.color.toLowerCase();
        colorSet.add(color);
      }
      // Also check for color variations in product variants if available
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach(variant => {
          if (variant.color) {
            colorSet.add(variant.color.toLowerCase());
          }
        });
      }
    });
    
    // Create price ranges based on actual product prices
    const prices = products.map(p => Number(p.price)).filter(p => !isNaN(p));
    const minPrice = Math.min(...prices) || 0;
    const maxPrice = Math.max(...prices) || 10000;
    
    const priceRanges = [
      { label: `Under ₹${Math.round(maxPrice * 0.2)}`, min: 0, max: Math.round(maxPrice * 0.2) },
      { label: `₹${Math.round(maxPrice * 0.2)} - ₹${Math.round(maxPrice * 0.4)}`, min: Math.round(maxPrice * 0.2), max: Math.round(maxPrice * 0.4) },
      { label: `₹${Math.round(maxPrice * 0.4)} - ₹${Math.round(maxPrice * 0.6)}`, min: Math.round(maxPrice * 0.4), max: Math.round(maxPrice * 0.6) },
      { label: `₹${Math.round(maxPrice * 0.6)} - ₹${Math.round(maxPrice * 0.8)}`, min: Math.round(maxPrice * 0.6), max: Math.round(maxPrice * 0.8) },
      { label: `₹${Math.round(maxPrice * 0.8)} and above`, min: Math.round(maxPrice * 0.8), max: Infinity },
    ];
    
    setDynamicFilters({
      categories: categoryFilters,
      priceRanges: priceRanges,
      colors: Array.from(colorSet)
    });
  };

  useEffect(() => {
    applyFilters();
  }, [filteredState, newProducts]);

  const applyFilters = () => {
    let filtered = [...newProducts];

    // Filter by category
    if (filteredState.categories !== "all") {
      filtered = filtered.filter((product) => {
        const productCategory = product.category?.toLowerCase() || '';
        const categorySlug = filteredState.categories.toLowerCase();
        return productCategory.includes(categorySlug) || 
               (product.category && product.category.slug === filteredState.categories);
      });
    }

    // Filter by price range
    if (filteredState.priceRange !== "") {
      const [min, max] = filteredState.priceRange.split(" - ").map(str => {
        // Extract numbers from strings like "Under ₹500" or "₹500 - ₹1000"
        const numbers = str.match(/\d+/g);
        return numbers ? Number(numbers[numbers.length - 1]) : 0;
      });
      
      filtered = filtered.filter((product) => {
        const price = Number(product.price);
        if (filteredState.priceRange.includes("and above")) {
          return price >= min;
        }
        return price >= min && price <= max;
      });
    }

    // Filter by color
    if (filteredState.colors !== "all") {
      filtered = filtered.filter((product) => {
        const productColor = product.attributes?.color?.toLowerCase() || '';
        return productColor === filteredState.colors.toLowerCase();
      });
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setFilteredState({
      categories: "all",
      priceRange: "",
      colors: "all",
    });
    setFilteredProducts(newProducts);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="section__container bg-primary-light">
        <div className="mb-4">
          <BackButton fallbackPath="/" text="Back to Home" />
        </div>
        <h2 className="section__header">New Arrivals</h2>
        <p className="section__subheader">
          Discover our latest collection featuring the newest trends and must-have pieces 
          that just arrived in our store.
        </p>
      </section>

      <div className="section__container">
        <div className="flex flex-col md:flex-row md:gap-12 gap-8">
          {/* Left Filter Bar */}
          <ShopFiltering
            filters={dynamicFilters}
            filteredState={filteredState}
            setFilteredState={setFilteredState}
            clearFilters={clearFilters}
            allCategories={allCategories}
            currentCategory="all"
          />

          {/* Right Products Section */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading new arrivals...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={fetchNewArrivals}
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium">
                    {filteredProducts.length} New Arrivals Found
                  </h3>
                </div>
                <div className="mt-6">
                  {filteredProducts.length > 0 ? (
                    <ProductCards products={filteredProducts} />
                  ) : (
                    <EmptyState 
                        type="new-arrivals"
                        message="No new arrivals found"
                        subMessage={newProducts.length === 0 
                            ? "New products are added regularly. Check back soon!" 
                            : "No new arrivals match your current filters. Try adjusting your filters."
                        }
                        actionText={newProducts.length === 0 ? "View All Products" : "Clear Filters"}
                        onAction={newProducts.length === 0 
                            ? () => window.location.href = '/shop'
                            : clearFilters
                        }
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewArrivals;