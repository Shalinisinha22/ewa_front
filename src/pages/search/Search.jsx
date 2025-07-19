import React, { useEffect } from 'react';
import productsData from "../../data/products.json"
import ProductCards from '../shop/ProductCards';
const Search = () => {
    const [searchQuery, setSearchQuery] = React.useState('');   
    const [filteredProducts, setFilteredProducts] = React.useState([]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        console.log(searchQuery)
        const query = event.target.value.toLowerCase();
        const filtered = productsData.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.category.toLowerCase().includes(query) 
            || product.description.toLowerCase().includes(query)

        );
        setFilteredProducts(filtered);
    }

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredProducts([]);
        }
    }, [searchQuery]);
  return (
    <>
         <section className='section__container bg-primary-light' >
        <h2 className='section__header capitalize'>Search Products</h2>
        <p className='section__subheader'>Find exactly what you're looking for from our extensive collection of fashion items and accessories.</p>
     </section>

     <section className='section__container'>
        <div className='w-full mb-12 flex flex-col md:flex-row items-center gap-4 justify-center'>
            <input 
                type="text" 
                placeholder="Search for products..." 
                value={searchQuery} 
                onChange={(e)=>handleSearch(e)} 
                
                className="search-bar w-full max-w-4xl p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            <button onClick={handleSearch} className='search-button w-full md:w-auto py-3 px-8 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium'>Search</button>
        </div>
   
   {searchQuery && (
     <div className="mb-6">
       <h3 className="text-xl font-medium">
         {filteredProducts.length} Results for "{searchQuery}"
       </h3>
     </div>
   )}

   <div className="mt-6">
     <ProductCards products={filteredProducts} />
   </div>

     </section>
    </>
  );
}

export default Search;
