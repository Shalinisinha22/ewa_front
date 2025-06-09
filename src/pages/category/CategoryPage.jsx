import React,{useState,useEffect} from 'react';
import products from '../../data/products.json';
import { useParams } from 'react-router-dom';  
import ProductCards from '../shop/ProductCards';

const CategoryPage = () => {
    const {category} = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
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
        <p className='section__subheader'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse odit alias eaque incidunt possimus laudantium optio rerum quasi voluptates eos!</p>
     </section>

     <div className='section__container'>
        <ProductCards products={filteredProducts}>

        </ProductCards>
     </div>
    </>
  );
}

export default CategoryPage;
