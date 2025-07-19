import React from 'react';

const ShopFiltering = ({filters,filteredState,setFilteredState,clearFilters}) => {
  return (
    <div className='space-y-5 flex-shrink-0'>
        <h3>Filters</h3>

        {/* category */}

        <div className=' flex flex-col space-y-2'>
            <h4 className='font-medium text-lg'>Category</h4>
            <hr></hr>
            {
                filters.categories.map((category) => (
                    <label key={category} className='capitalize cursor-pointer'>
                       <input className='text-black' type="radio" name="category" id="category" value={category} checked={filteredState.categories===category}
                          onChange={(e)=>setFilteredState({...filteredState,categories:e.target.value})}
                       ></input>
                       <span className='ml-1'>{category}</span>

                 
                    </label>
                ))
            }
        </div>

{/* colors */}
           <div className=' flex flex-col space-y-2'>
            <h4 className='font-medium text-lg'>Colors</h4>
            <hr></hr>
            {
                filters.colors.filter(color => color !== "all").map((color) => (
                    <label key={color} className='capitalize cursor-pointer'>
                       <input className='text-black' type="radio" name="color" id="color" value={color} checked={filteredState.colors===color}
                          onChange={(e)=>setFilteredState({...filteredState,colors:e.target.value})}
                       ></input>
                       <span className='ml-1'>{color}</span>

                 
                    </label>
                ))
            }
            <label className='capitalize cursor-pointer'>
               <input className='text-black' type="radio" name="color" id="color" value="all" checked={filteredState.colors==="all"}
                  onChange={(e)=>setFilteredState({...filteredState,colors:e.target.value})}
               ></input>
               <span className='ml-1'>All Colors</span>
            </label>
        </div>

{/* price */}
            <div className=' flex flex-col space-y-2'>
            <h4 className='font-medium text-lg'>Price range</h4>
            <hr></hr>
            {
                filters.priceRanges.map((range) => (
                    <label key={range.label} className='capitalize cursor-pointer'>
                       <input className='text-black' type="radio" name="priceRange" id="priceRange" value={`${range.min} - ${range.max}`} checked={filteredState.priceRange===`${range.min} - ${range.max}`}    
                          onChange={(e)=>setFilteredState({...filteredState,priceRange:e.target.value})}
                       ></input>
                       <span className='ml-1'>{range.label}</span>

                 
                    </label>
                ))
            }
        </div>


        <button onClick={clearFilters} className='bg-primary py-1 px-4 text-white rounded'>Clear All Filters</button>
      
    </div>
  );
}

export default ShopFiltering;
