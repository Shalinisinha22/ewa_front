import React from 'react';
import 'remixicon/fonts/remixicon.css';

// Category icon mapping
const categoryIcons = {
  all: 'apps-2',
  jewellery: 'sparkling-2',
  jewelry: 'sparkling-2',
  dress: 't-shirt',
  dresses: 't-shirt',
  clothing: 't-shirt',
  accessories: 'handbag',
  bags: 'handbag',
  cosmetics: 'emotion-happy',
  beauty: 'emotion-happy',
  shoes: 'footprint',
  footwear: 'footprint',
  watches: 'time',
  electronics: 'smartphone',
  home: 'home-4',
  sports: 'basketball',
  books: 'book-open',
  toys: 'gamepad',
  men: 'user-3',
  women: 'user-3',
  mens: 'user-3',
  womens: 'user-3',
  default: 'price-tag-3'
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

const ShopFiltering = ({filters,filteredState,setFilteredState,clearFilters, allCategories = [], currentCategory, onCategoryChange, subcategories = []}) => {
    
    // Get category display name from API data
    const getCategoryDisplayName = (categorySlug) => {
        if (categorySlug === 'all') return 'All Categories';
        const category = allCategories.find(cat => cat.slug === categorySlug);
        return category?.name || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
    };

    // Get category icon based on slug or name
    const getCategoryIcon = (categorySlug) => {
        const slug = categorySlug.toLowerCase();
        return categoryIcons[slug] || categoryIcons.default;
    };
  return (
    <div className='space-y-5 flex-shrink-0 w-64 bg-white rounded-xl shadow-md p-6 sticky top-6'>
        <h3 className='text-lg font-bold mb-4'>Filters</h3>

        {/* category */}
        <div className='flex flex-col space-y-2 mb-6'>
            <h4 className='font-semibold text-sm mb-2 flex items-center gap-2'>
                <i className="ri-apps-2-line text-primary"></i>
                Categories
            </h4>
            <hr />
            <div className='flex flex-col gap-2 mt-2'>
            {
                filters.categories && filters.categories.length > 0 ? (
                    <div className="space-y-1">
                        {filters.categories.map((categorySlug) => {
                            if (categorySlug === 'all') {
                                return (
                                    <button
                                        key={categorySlug}
                                        type='button'
                                        onClick={() => onCategoryChange ? onCategoryChange(categorySlug) : setFilteredState({ ...filteredState, categories: categorySlug })}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-left w-full
                                            ${(filteredState.categories === categorySlug || categorySlug === currentCategory) ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-100'}
                                        `}
                                    >
                                        <i className={`ri-${getCategoryIcon(categorySlug)}-line text-lg ${(filteredState.categories === categorySlug || categorySlug === currentCategory) ? 'text-primary' : 'text-gray-500'}`}></i>
                                        <span className={`text-sm ${(filteredState.categories === categorySlug || categorySlug === currentCategory) ? 'text-primary font-semibold' : 'text-gray-700'}`}>
                                            {getCategoryDisplayName(categorySlug)}
                                        </span>
                                        {categorySlug === currentCategory && (
                                            <i className="ri-check-line text-xs text-green-500 ml-auto"></i>
                                        )}
                                    </button>
                                );
                            }

                            // Find the category data from allCategories
                            const categoryData = allCategories.find(cat => cat.slug === categorySlug);
                            const categorySubcategories = subcategories.filter(sub => sub.parent && sub.parent._id === categoryData?._id);

                            return (
                                <div key={categorySlug} className="space-y-1">
                                    {/* Main Category */}
                                    <button
                                        type='button'
                                        onClick={() => onCategoryChange ? onCategoryChange(categorySlug) : setFilteredState({ ...filteredState, categories: categorySlug })}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-left w-full
                                            ${(filteredState.categories === categorySlug || categorySlug === currentCategory) ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-100'}
                                        `}
                                    >
                                        <i className={`ri-${getCategoryIcon(categorySlug)}-line text-lg ${(filteredState.categories === categorySlug || categorySlug === currentCategory) ? 'text-primary' : 'text-gray-500'}`}></i>
                                        <span className={`text-sm ${(filteredState.categories === categorySlug || categorySlug === currentCategory) ? 'text-primary font-semibold' : 'text-gray-700'}`}>
                                            {getCategoryDisplayName(categorySlug)}
                                        </span>
                                        {categorySubcategories.length > 0 && (
                                            <i className={`ri-arrow-down-s-line text-xs ml-auto ${(filteredState.categories === categorySlug || categorySlug === currentCategory) ? 'text-primary' : 'text-gray-400'}`}></i>
                                        )}
                                        {categorySlug === currentCategory && (
                                            <i className="ri-check-line text-xs text-green-500"></i>
                                        )}
                                    </button>

                                    {/* Subcategories under this category - only show if this is the current category */}
                                    {currentCategory === categorySlug && categorySubcategories.map((subcategory) => (
                                        <button
                                            key={subcategory._id}
                                            type='button'
                                            onClick={() => onCategoryChange ? onCategoryChange(subcategory.slug) : setFilteredState({ ...filteredState, categories: subcategory.slug })}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-left ml-6 border-l-2 border-gray-200 w-full
                                                ${(filteredState.categories === subcategory.slug || subcategory.slug === currentCategory) ? 'bg-primary/10 border-l-primary' : 'hover:bg-gray-50'}
                                            `}
                                        >
                                            <i className={`ri-${getCategoryIcon(subcategory.slug)}-line text-sm ${(filteredState.categories === subcategory.slug || subcategory.slug === currentCategory) ? 'text-primary' : 'text-gray-400'}`}></i>
                                            <span className={`text-xs ${(filteredState.categories === subcategory.slug || subcategory.slug === currentCategory) ? 'text-primary font-semibold' : 'text-gray-600'}`}>
                                                {subcategory.name}
                                            </span>
                                            {subcategory.slug === currentCategory && (
                                                <i className="ri-check-line text-xs text-green-500 ml-auto"></i>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-sm text-gray-500 px-3 py-2">
                        Loading categories...
                    </div>
                )
            }
            </div>
        </div>

        {/* colors */}
        <div className='flex flex-col space-y-2 mb-6'>
            <h4 className='font-semibold text-sm mb-2 flex items-center gap-2'>
                <i className="ri-palette-line text-primary"></i>
                Colors
            </h4>
            <hr />
            <div className='flex flex-wrap gap-2 mt-2'>
            {/* All Colors option */}
            <button
              type='button'
              onClick={() => setFilteredState({ ...filteredState, colors: 'all' })}
              className={`w-10 h-8 rounded-lg border-2 flex items-center justify-center transition text-xs font-medium
                ${filteredState.colors === 'all' ? 'border-primary ring-2 ring-primary/30 bg-primary text-white' : 'border-gray-200 hover:border-primary bg-gray-100 text-gray-600'}
              `}
              aria-label='All Colors'
            >
              All
            </button>
            {
                filters.colors && filters.colors.filter(color => color !== "all").map((color) => {
                    const colorValue = colorHex[color.toLowerCase()] || color;
                    return (
                        <button
                            key={color}
                            type='button'
                            onClick={() => setFilteredState({ ...filteredState, colors: color })}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition relative
                              ${filteredState.colors === color ? 'border-primary ring-2 ring-primary/30' : 'border-gray-300 hover:border-primary'}
                            `}
                            style={{ 
                                backgroundColor: colorValue, 
                                borderColor: color === 'white' ? '#d1d5db' : undefined 
                            }}
                            aria-label={color}
                            title={color.charAt(0).toUpperCase() + color.slice(1)}
                        >
                            {filteredState.colors === color && (
                              <i className={`ri-check-line text-lg ${color === 'white' || color === 'yellow' ? 'text-gray-800' : 'text-white'}`}></i>
                            )}
                        </button>
                    );
                })
            }
            </div>
        </div>

        {/* price */}
        <div className='flex flex-col space-y-2 mb-6'>
            <h4 className='font-semibold text-sm mb-2 flex items-center gap-2'>
                <i className="ri-money-rupee-circle-line text-primary"></i>
                Price Range
            </h4>
            <hr />
            <div className='flex flex-col gap-2 mt-2'>
            {
                filters.priceRanges && filters.priceRanges.map((range) => (
                  <button
                    key={range.label}
                    type='button'
                    onClick={() => setFilteredState({ ...filteredState, priceRange: range.label })}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition text-left border
                      ${filteredState.priceRange === range.label ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
                    `}
                  >
                    <span className={`text-sm ${filteredState.priceRange === range.label ? 'font-semibold' : 'text-gray-700'}`}>
                        {range.label}
                    </span>
                    {filteredState.priceRange === range.label && (
                        <i className="ri-check-line text-primary"></i>
                    )}
                  </button>
                ))
            }
            </div>
        </div>

        {/* Clear Filters Button */}
        <div className="pt-4 border-t border-gray-200">
            <button 
                onClick={clearFilters} 
                className='w-full py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium transition flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900'
            >
                <i className="ri-refresh-line"></i>
                Clear All Filters
            </button>
        </div>
      
    </div>
  );
}

export default ShopFiltering;
