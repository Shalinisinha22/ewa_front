import React from 'react';
import c1 from "../../assets/category-1.jpg"
import c2 from "../../assets/category-2.jpg"
import c3 from "../../assets/category-3.jpg"
import c4 from "../../assets/category-4.jpg"
import { Link } from 'react-router-dom';

const Categories = () => {

    const categories=[
        {    id:1,
            name:"Accessories",
            path:"accessories",
            image:c1
        },
        {    id:2,
            name:"Dress Collection",
            path:"dress",
            image:c2
        },
        {    id:3,
            name:"Jewellery",
            path:"jewellery",
            image:c3
        },
        {    id:4,
            name:"Cosmetics",
            path:"cosmetics",
            image:c4
        }
    ]
  return (
    <>
    <div className='product__grid'>
        {
            categories.map((category)=>(
                <Link key={category.id} className='categories__card' to={`/categories/${category.path}`}>
                    <img src={category.image} alt={category.name}></img>
                    <h4>{category.name}</h4>
                </Link>
            ))
        }
        </div>  
    </>
  );
}

export default Categories;
