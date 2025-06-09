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
        <p className='section__subheader'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse odit alias eaque incidunt possimus laudantium optio rerum quasi voluptates eos!</p>
     </section>

     <section className='section__container'>
        <div className='w-full mb-12 flex flex-col md:flex-row items-center gap-4 justify-center'>
            <input 
                type="text" 
                placeholder="Search for products..." 
                value={searchQuery} 
                onChange={(e)=>handleSearch(e)} 
                
                className="search-bar w-full max-w-4xl p-2 border rounded"
            />
            <button onClick={handleSearch} className='search-button w-full md:w-auto py-2 px-8 bg-primary text-white rounded'>Search</button>
        </div>
   
   <ProductCards products={filteredProducts} />

     </section>
    </>
  );
}

export default Search;
