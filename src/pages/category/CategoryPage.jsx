import React,{useState,useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import ProductCards from '../shop/ProductCards';
import ShopFiltering from '../shop/ShopFiltering';
import EmptyState from '../../Components/EmptyState';
import BackButton from '../../Components/BackButton';
import { useStore } from '../../context/StoreContext';
import API from '../../api';

const CategoryPage = () => {
    const {category} = useParams();
    const navigate = useNavigate();
    const { currentStore } = useStore();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allCategoryProducts, setAllCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [allSubcategories, setAllSubcategories] = useState([]);
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
        categories: category || "all",
        priceRange: "",
        colors: "all",
    });

    useEffect(() => {
        if (currentStore) {
            fetchStoreData();
        }
    }, [category, currentStore]);

    // Update filteredState when category changes
    useEffect(() => {
        setFilteredState(prevState => ({
            ...prevState,
            categories: category || "all"
        }));
    }, [category]);

    const fetchStoreData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch all categories for this store
            const categoriesResponse = await API.request(`${API.endpoints.publicCategories}?store=${currentStore.slug || currentStore.name}&limit=50`);
            const categories = categoriesResponse.categories || categoriesResponse || [];
            setAllCategories(categories);
            
            // Find the current category
            const categoryData = categories.find(cat => cat.slug === category);
            
            if (!categoryData) {
                setError('Category not found');
                setLoading(false);
                return;
            }
            
            // Process category data to ensure clean display
            const processedCategoryData = {
                ...categoryData,
                name: categoryData.name || 'Unnamed Category',
                description: categoryData.description || `Explore our curated collection of ${categoryData.name || category} items.`,
                slug: categoryData.slug || categoryData.name?.toLowerCase().replace(/\s+/g, '-') || 'unnamed-category'
            };
            
            // Clean the description - remove any JSON-like content
            if (processedCategoryData.description && typeof processedCategoryData.description === 'string') {
                const cleanDescription = processedCategoryData.description
                    .replace(/"metaTitle":\s*"[^"]*"/g, '')
                    .replace(/"metaDescription":\s*"[^"]*"/g, '')
                    .replace(/"keywords":\s*\[[^\]]*\]/g, '')
                    .replace(/\s*,\s*}/g, '')
                    .replace(/\s*}\s*$/g, '')
                    .trim();
                
                processedCategoryData.description = cleanDescription || `Explore our curated collection of ${processedCategoryData.name || category} items.`;
            }
            
            setCategoryInfo(processedCategoryData);
            
            // Fetch subcategories for this category
            const subcategoriesResponse = await API.request(`${API.endpoints.publicCategories}?store=${currentStore.slug || currentStore.name}&parent=${categoryData._id}&limit=50`);
            const fetchedSubcategories = subcategoriesResponse.categories || subcategoriesResponse || [];
            setSubcategories(fetchedSubcategories);
            
            // Also fetch all subcategories to handle products that might have subcategories from different parents
            const allSubcategoriesResponse = await API.request(`${API.endpoints.publicCategories}?store=${currentStore.slug || currentStore.name}&limit=100`);
            const allSubcategories = allSubcategoriesResponse.categories || allSubcategoriesResponse || [];
            const allSubcategoriesOnly = allSubcategories.filter(cat => cat.parent || cat.level > 0);
            setAllSubcategories(allSubcategoriesOnly);
            
            // Debug: Log subcategories to help troubleshoot
            console.log('Fetched subcategories for category:', fetchedSubcategories);
            console.log('All subcategories:', allSubcategoriesOnly);
            
            // Fetch products for this category
            const productsResponse = await API.request(`${API.endpoints.publicProductsByCategory}/${categoryData._id}?store=${currentStore.slug || currentStore.name}&limit=100`);
            const products = productsResponse.products || productsResponse || [];
            
            // Process products to add image URLs and fix data structure
            const processedProducts = products.map(product => {
                // Debug: Log product subcategory data
                if (product.subcategory) {
                    console.log('Product subcategory data:', {
                        productName: product.name,
                        subcategory: product.subcategory,
                        subcategoryType: typeof product.subcategory
                    });
                }
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
            
            setAllCategoryProducts(processedProducts);
            setFilteredProducts(processedProducts);
            
            // Build dynamic filters based on fetched data
            buildDynamicFilters(categories, processedProducts);
            
        } catch (error) {
            console.error('Error fetching store data:', error);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const buildDynamicFilters = (categories, products) => {
        // Build category filter from API categories - only include parent categories
        const categoryFilters = ["all"];
        categories.forEach(cat => {
            if (cat.slug && !categoryFilters.includes(cat.slug) && (!cat.parent || cat.level === 0)) {
                categoryFilters.push(cat.slug);
            }
        });
        
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
    }, [filteredState, allCategoryProducts, subcategories, allSubcategories]);

    const applyFilters = () => {
        let filtered = [...allCategoryProducts];

        // Filter by category/subcategory
        if (filteredState.categories && filteredState.categories !== "all") {
            // Check if it's a subcategory
            const isSubcategory = subcategories.some(sub => sub.slug === filteredState.categories);
            
            if (isSubcategory) {
                // Filter by subcategory
                filtered = filtered.filter(product => {
                    if (!product.subcategory) return false;
                    
                    // Handle both populated object and ID string
                    if (typeof product.subcategory === 'object') {
                        return product.subcategory.slug === filteredState.categories;
                    } else if (typeof product.subcategory === 'string') {
                        // If subcategory is just an ID, find the matching subcategory from our allSubcategories list
                        const matchingSubcategory = allSubcategories.find(sub => sub._id === product.subcategory);
                        return matchingSubcategory && matchingSubcategory.slug === filteredState.categories;
                    }
                    return false;
                });
            }
            // If it's not a subcategory, it's the main category, so show all products in this category
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

    // Handle category filter change by navigating to the new category
    const handleCategoryFilterChange = (newCategorySlug) => {
        if (newCategorySlug === "all") {
            // Navigate to shop page or show all products
            navigate('/shop');
        } else {
            // Check if it's a subcategory of the current category
            const isSubcategory = subcategories.some(sub => sub.slug === newCategorySlug);
            
            if (isSubcategory) {
                // Filter products by subcategory
                setFilteredState({ ...filteredState, categories: newCategorySlug });
                
                // Filter products by the selected subcategory
                const subcategoryProducts = allCategoryProducts.filter(product => {
                    if (!product.subcategory) return false;
                    
                    // Handle both populated object and ID string
                    if (typeof product.subcategory === 'object') {
                        return product.subcategory.slug === newCategorySlug;
                    } else if (typeof product.subcategory === 'string') {
                        // If subcategory is just an ID, find the matching subcategory from our allSubcategories list
                        const matchingSubcategory = allSubcategories.find(sub => sub._id === product.subcategory);
                        return matchingSubcategory && matchingSubcategory.slug === newCategorySlug;
                    }
                    return false;
                });
                setFilteredProducts(subcategoryProducts);
            } else if (newCategorySlug !== category) {
                // Navigate to the new category page
                navigate(`/categories/${newCategorySlug}`);
            } else {
                // Same category, reset to show all products in this category
                setFilteredState({ ...filteredState, categories: newCategorySlug });
                setFilteredProducts(allCategoryProducts);
            }
        }
    };

    const clearFilters = () => {
        setFilteredState({
            categories: category || "all",
            priceRange: "",
            colors: "all",
        });
        // Reset to current category products
        setFilteredProducts(allCategoryProducts);
    };

    useEffect(() => {
        window.scrollTo(0,0)
    },[category]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                Error: {error}
            </div>
        );
    }

  return (
    <>
     <section className='section__container bg-primary-light' >
        <div className="mb-4">
          <BackButton fallbackPath="/shop" text="Back to Shop" />
        </div>
        
        {/* Breadcrumb Navigation */}
        {categoryInfo?.parent && (
            <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <button 
                            onClick={() => navigate('/shop')}
                            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary"
                        >
                            <i className="ri-home-line mr-2"></i>
                            Shop
                        </button>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <i className="ri-arrow-right-s-line text-gray-400 mx-1"></i>
                            <button 
                                onClick={() => navigate(`/categories/${categoryInfo.parent.slug}`)}
                                className="ml-1 text-sm font-medium text-gray-700 hover:text-primary"
                            >
                                {categoryInfo.parent.name}
                            </button>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <i className="ri-arrow-right-s-line text-gray-400 mx-1"></i>
                            <span className="ml-1 text-sm font-medium text-gray-500">
                                {categoryInfo?.name || category}
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>
        )}
        
        <h2 className='section__header capitalize'>{categoryInfo?.name || category}</h2>
        <p className='section__subheader'>
            {categoryInfo?.description || `Explore our curated collection of ${categoryInfo?.name || category} items. Find the perfect pieces to enhance your style and express your personality.`}
        </p>
        
     </section>

     <div className='section__container'>
        <div className="flex flex-col md:flex-row md:gap-12 gap-8">
          {/* Left Filter Bar */}
          <ShopFiltering
            filters={dynamicFilters}
            filteredState={filteredState}
            setFilteredState={setFilteredState}
            clearFilters={clearFilters}
            allCategories={allCategories}
            currentCategory={category}
            onCategoryChange={handleCategoryFilterChange}
            subcategories={subcategories}
          />

          {/* Right Products Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">
                {filteredProducts.length} Products Found
              </h3>
            </div>
            <div className="mt-6">
              {filteredProducts.length > 0 ? (
                <ProductCards products={filteredProducts} />
              ) : (
                <EmptyState 
                    type="category"
                    message={`No products in ${categoryInfo?.name || category}`}
                    subMessage={allCategoryProducts.length === 0 
                        ? "This category is currently empty. Explore other categories." 
                        : "No products match your current filters. Try adjusting your filters."
                    }
                    actionText={allCategoryProducts.length === 0 ? "View All Categories" : "Clear Filters"}
                    onAction={allCategoryProducts.length === 0 
                        ? () => navigate('/shop')
                        : clearFilters
                    }
                />
              )}
            </div>
          </div>
        </div>
     </div>
    </>
  );
}

export default CategoryPage;
