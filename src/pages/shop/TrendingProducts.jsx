import React, { useState } from "react";
import ProductCards from "./ProductCards";
import products from "../../data/products.json"

const TrendingProducts = () => {
    const [visibleProducts,setVisibleProducts]= useState(8)

    const loadMoreProducts=()=>{
        setVisibleProducts(prevCount=> prevCount + 4)
    }
  return (
    <section className="section__container product__container">
      <h2 className="section__header">Trending Products</h2>
      <p className="section__subheader mb-12">
        Discover our most popular items that everyone is talking about. From fashion-forward pieces to timeless classics.
      </p>

      {/* products card */}
      <div className="mt-10">
        <ProductCards products={products.slice(0, visibleProducts)} />
      </div>

      {visibleProducts < products.length && (
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
