import React from 'react';

const Ratingstars = ({rating}) => {
    const stars=[]
    for(let i=1;i<=5;i++){
        stars.push(
            <span key={i} className={i<=rating ? "ri-star-fill" : "ri-star-line"}></span>
        )
    }
  return (
    <div className='product__rating'>
     {stars} 
    </div>
  );
}

export default Ratingstars;
