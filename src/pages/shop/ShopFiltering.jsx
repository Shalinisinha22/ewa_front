import React from 'react';
import 'remixicon/fonts/remixicon.css';

// Category icon mapping
const categoryIcons = {
  all: 'apps',
  jewellery: 'sparkling-2',
  dress: 't-shirt',
  accessories: 'handbag',
  cosmetics: 'emotion-happy',
};
// Color hex mapping
const colorHex = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  black: '#000000',
  white: '#ffffff',
  silver: '#a3a3a3',
  beige: '#f5f5dc',
  gold: '#ffd700',
  orange: '#fb923c',
};

const ShopFiltering = ({filters,filteredState,setFilteredState,clearFilters}) => {
  return (
    <div className='space-y-5 flex-shrink-0 w-64 bg-white rounded-xl shadow-md p-6 sticky top-6'>
        <h3 className='text-lg font-bold mb-4'>Filters</h3>

        {/* category */}
        <div className='flex flex-col space-y-2 mb-6'>
            <h4 className='font-semibold text-sm mb-2'>Category</h4>
            <hr />
            <div className='flex flex-col gap-2 mt-2'>
            {
                filters.categories.map((category) => (
                  <button
                    key={category}
                    type='button'
                    onClick={() => setFilteredState({ ...filteredState, categories: category })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-left
                      ${filteredState.categories === category ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-100'}
                    `}
                  >
                    <i className={`ri-${categoryIcons[category] || 'apps'}-line text-lg ${filteredState.categories === category ? 'text-primary' : 'text-gray-500'}`}></i>
                    <span className={`capitalize text-sm ${filteredState.categories === category ? 'text-primary font-semibold' : 'text-gray-700'}`}>{category}</span>
                  </button>
                ))
            }
            </div>
        </div>

        {/* colors */}
        <div className='flex flex-col space-y-2 mb-6'>
            <h4 className='font-semibold text-sm mb-2'>Colors</h4>
            <hr />
            <div className='flex flex-wrap gap-2 mt-2'>
            {
                filters.colors.filter(color => color !== "all").map((color) => (
                  <button
                    key={color}
                    type='button'
                    onClick={() => setFilteredState({ ...filteredState, colors: color })}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition
                      ${filteredState.colors === color ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-primary'}
                    `}
                    style={{ backgroundColor: colorHex[color] || color, borderColor: color === 'white' ? '#d1d5db' : undefined }}
                    aria-label={color}
                  >
                    {filteredState.colors === color && (
                      <i className="ri-check-line text-white text-lg"></i>
                    )}
                  </button>
                ))
            }
            {/* All Colors option */}
            <button
              type='button'
              onClick={() => setFilteredState({ ...filteredState, colors: 'all' })}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition
                ${filteredState.colors === 'all' ? 'border-primary ring-2 ring-primary/30 bg-primary/10' : 'border-gray-200 hover:border-primary bg-gray-100'}
              `}
              aria-label='All Colors'
            >
              <i className="ri-palette-line text-lg text-gray-500"></i>
            </button>
            </div>
        </div>

        {/* price */}
        <div className='flex flex-col space-y-2 mb-6'>
            <h4 className='font-semibold text-sm mb-2'>Price range</h4>
            <hr />
            <div className='flex flex-col gap-2 mt-2'>
            {
                filters.priceRanges.map((range) => (
                  <button
                    key={range.label}
                    type='button'
                    onClick={() => setFilteredState({ ...filteredState, priceRange: `${range.min} - ${range.max}` })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-left
                      ${filteredState.priceRange === `${range.min} - ${range.max}` ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-100'}
                    `}
                  >
                    <span className={`capitalize text-sm ${filteredState.priceRange === `${range.min} - ${range.max}` ? 'text-primary font-semibold' : 'text-gray-700'}`}>{range.label}</span>
                  </button>
                ))
            }
            </div>
        </div>

        <button onClick={clearFilters} className='w-full mt-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium transition'>Clear All Filters</button>
      
    </div>
  );
}

export default ShopFiltering;
