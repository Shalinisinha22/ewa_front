import React, { useState, useEffect } from "react";
import ProductCards from "./ProductCards";
import EmptyState from "../../Components/EmptyState";
import { useStore } from "../../context/StoreContext";
import API from "../../api";

const TrendingProducts = () => {
    const { currentStore } = useStore();
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(8);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentStore) {
            fetchTrendingProducts();
        }
    }, [currentStore]);

    const fetchTrendingProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await API.request(
                `${API.endpoints.publicTrending}?store=${currentStore.slug}&limit=20`
            );
            
            setTrendingProducts(response || []);
        } catch (error) {
            console.error('Error fetching trending products:', error);
            setError('Failed to load trending products');
            setTrendingProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4);
    };

    return (
        <section className="section__container product__container">
            <h2 className="section__header">Trending Products</h2>
            <p className="section__subheader mb-12">
                Discover our most popular items that everyone is talking about. From fashion-forward pieces to timeless classics.
            </p>

            {/* products card */}
            <div className="mt-10">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading trending products...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                            onClick={fetchTrendingProducts}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {trendingProducts.length > 0 ? (
                            <ProductCards products={trendingProducts.slice(0, visibleProducts)} />
                        ) : (
                            <EmptyState 
                                type="trending"
                                onAction={() => window.location.href = '/shop'}
                            />
                        )}
                    </>
                )}
            </div>

            {!loading && !error && visibleProducts < trendingProducts.length && (
                <div className="text-center mt-8">
                    <button 
                        onClick={loadMoreProducts}
                        className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition-colors duration-300 font-medium"
                    >
                        Load More Products
                    </button>
                </div>
            )}
        </section>
    );
};

export default TrendingProducts;
