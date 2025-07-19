import React,{useState,useEffect} from 'react';
import products from '../../data/products.json';
import { useParams } from 'react-router-dom';  
import ProductCards from '../shop/ProductCards';

const CategoryPage = () => {
    const {category} = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    console.log(category)

    useEffect(() => {       
        const filtered = products.filter((product) => product.category === category.toLowerCase());
        setFilteredProducts(filtered)
    },[category])

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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium">
            {filteredProducts.length} Products Found
          </h3>
        </div>
        <div className="mt-10">
          <ProductCards products={filteredProducts} />
        </div>
     </div>
    </>
  );
}

export default CategoryPage;
