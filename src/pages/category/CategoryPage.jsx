import React,{useState,useEffect} from 'react';
import products from '../../data/products.json';
import { useParams } from 'react-router-dom';  
import ProductCards from '../shop/ProductCards';
import ShopFiltering from '../shop/ShopFiltering';

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
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allCategoryProducts, setAllCategoryProducts] = useState([]);
    const [filteredState, setFilteredState] = useState({
        categories: category || "all",
        priceRange: "",
        colors: "all",
    });

    useEffect(() => {       
        const filtered = products.filter((product) => product.category === category.toLowerCase());
        setAllCategoryProducts(filtered);
        setFilteredProducts(filtered);
    },[category]);

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

  return (
    <>
     <section className='section__container bg-primary-light' >
        <h2 className='section__header capitalize'>{category}</h2>
        <p className='section__subheader'>Explore our curated collection of {category} items. Find the perfect pieces to enhance your style and express your personality.</p>
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
