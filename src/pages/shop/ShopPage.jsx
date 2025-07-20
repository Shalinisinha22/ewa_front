import React, { useState } from "react";
import productsData from "../../data/products.json";
import { useEffect } from "react";
import ProductCard from "./ProductCards";
import ShopFiltering from "./ShopFiltering";
const filters = {
  categories: ["all", "jewellery", "dress", "accessories", "cosmetics"],
  priceRanges: [
    { label: "Under $50", min: 0, max: 50 },
    { label: "Under $50 - $100", min: 50, max: 100 },
    { label: "Under $100 -$200", min: 100, max: 200 },
    { label: "Under $200 - $300", min: 200, max: 300 },
    { label: "Under $300 and above", min: 300, max: Infinity },
  ],
  // brands:['all','brand1','brand2','brand3'],
  colors: [
    "red",
    "blue",
    "green",
    "yellow",
    "black",
    "white",
    "silver",
    "beige",
    "green",
    "orange",
  ],
  sizes: ["s", "m", "l", "xl", "xxl"],
};

const ShopPage = () => {
  const [products, setProducts] = useState(productsData);
  const [filteredState, setFilteredState] = useState({
    categories: "all",
    priceRange: "",
    colors: "all",
  });

  const appyFilters = () => {
    let filteredProducts = productsData;

    // filter by category
    if (filteredState.categories !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === filteredState.categories
      );
    }

    // filter by price range
    if (filteredState.priceRange !== "") {
      const [min, max] = filteredState.priceRange.split("-").map(Number);
      filteredProducts = filteredProducts.filter((product) => {
        const price = Number(product.price);
        return price >= min && price <= max;
      });
    }

    // filter by color
    if (filteredState.colors !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.color === filteredState.colors
      );
    }

    setProducts(filteredProducts);
  };
  useEffect(() => {
    appyFilters();
  }, [filteredState]);

  const clearFilters = () => {
    setFilteredState({
      categories: "all",
      priceRange: "",
      colors: "all",
    });
  };
    useEffect(() => {
      window.scrollTo(0,0)
      },[filteredState]);
  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">Shop Products</h2>
        <p className="section__subheader">
          Discover our complete collection of fashion items. Use filters to find exactly what you're looking for.
        </p>
      </section>

      <section className="section__container">
        <div className="flex flex-col md:flex-row md:gap-12 gap-8">
          {/* left */}
          <ShopFiltering
            filters={filters}
            filteredState={filteredState}
            setFilteredState={setFilteredState}
            clearFilters={clearFilters}
          ></ShopFiltering>

          {/* right */}
          <div>
            <h3 className="text-xl font-medium mb-4">
              {products.length} Products Available
            </h3>
            <div className="mt-6">
              <ProductCards products={products} />
            </div>
          </div>hb 
        </div>
      </section>
    </>
  );
};

export default ShopPage;
