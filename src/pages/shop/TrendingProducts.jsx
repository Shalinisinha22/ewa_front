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
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem sapiente
        cumque error deleniti minima minus doloribus optio quisquam explicabo?
      </p>

      {/* products card */}
      <ProductCards  products={products}>
      </ProductCards>


    </section>
  );
};

export default TrendingProducts;
