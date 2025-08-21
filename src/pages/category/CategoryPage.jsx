import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';  
import ProductCards from '../shop/ProductCards';
import ShopFiltering from '../shop/ShopFiltering';
import { useStore } from '../../context/StoreContext';
import API from '../../../api';

const filters = {
  categories: ["all", "jewellery", "dress", "accessories", "cosmetics"],
  priceRanges: [
    { label: "Under $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $200", min: 100, max: 200 },
    { label: "$200 - $300", min: 200, max: 300 },
    { label: "$300 and above", min: 300, max: Infinity },
  ],
  colors: [
    "all",
    "red",
    "blue",
    "green",
    "yellow",
    "black",
    "white",
    "silver",
    "beige",
    "gold",
    "orange",
  ],
};

const CategoryPage = () => {
    const {category} = useParams();
    const { currentStore } = useStore();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allCategoryProducts, setAllCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [filteredState, setFilteredState] = useState({
        categories: category || "all",
        priceRange: "",
        colors: "all",
    });

    useEffect(() => {
        if (currentStore) {
            fetchCategoryProducts();
        }
    }, [category, currentStore]);

    const fetchCategoryProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // First, get the category info to find the category ID
            const categoriesResponse = await API.request(`${API.endpoints.publicCategories}?store=${currentStore.name}`);
            const categories = categoriesResponse.categories || categoriesResponse || [];
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
                // Remove any JSON-like content that might be embedded in the description
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
            
            // Then fetch products for this category using the correct endpoint
            const productsResponse = await API.request(`${API.endpoints.publicProductsByCategory}/${categoryData._id}?store=${currentStore.name}`);
            const products = productsResponse.products || productsResponse || [];
            
            // Process products to add image URLs and fix data structure
            const processedProducts = products.map(product => {
                // Fix stringified arrays
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
                    // Fix attributes
                    attributes: product.attributes ? {
                        ...product.attributes,
                        size: processArrayField(product.attributes.size),
                        color: product.attributes.color
                    } : {},
                    // Fix SEO keywords
                    seo: product.seo ? {
                        ...product.seo,
                        keywords: processArrayField(product.seo.keywords)
                    } : {},
                    // Fix tags
                    tags: processArrayField(product.tags || []),
                    // Ensure category is properly handled
                    category: product.category?.name || product.category
                };
            });
            
            setAllCategoryProducts(processedProducts);
            setFilteredProducts(processedProducts);
        } catch (error) {
            console.error('Error fetching category products:', error);
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [filteredState, allCategoryProducts]);

    const applyFilters = () => {
        let filtered = [...allCategoryProducts];

        // filter by price range
        if (filteredState.priceRange !== "") {
            const [min, max] = filteredState.priceRange.split("-").map(Number);
            filtered = filtered.filter((product) => {
                const price = Number(product.price);
                return price >= min && price <= max;
            });
        }

        // filter by color
        if (filteredState.colors !== "all") {
            filtered = filtered.filter(
                (product) => product.color === filteredState.colors
            );
        }

        setFilteredProducts(filtered);
    };

    const clearFilters = () => {
        setFilteredState({
            categories: category || "all",
            priceRange: "",
            colors: "all",
        });
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
        <h2 className='section__header capitalize'>{categoryInfo?.name || category}</h2>
        <p className='section__subheader'>
            {categoryInfo?.description || `Explore our curated collection of ${categoryInfo?.name || category} items. Find the perfect pieces to enhance your style and express your personality.`}
        </p>
     </section>

     <div className='section__container'>
        <div className="flex flex-col md:flex-row md:gap-12 gap-8">
          {/* Left Filter Bar */}
          <ShopFiltering
            filters={filters}
            filteredState={filteredState}
            setFilteredState={setFilteredState}
            clearFilters={clearFilters}
          />

          {/* Right Products Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">
                {filteredProducts.length} Products Found
              </h3>
            </div>
            <div className="mt-6">
              <ProductCards products={filteredProducts} />
            </div>
          </div>
        </div>
     </div>
    </>
  );
}

export default CategoryPage;
