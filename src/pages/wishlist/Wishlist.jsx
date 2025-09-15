import React from 'react';
import EmptyState from '../../Components/EmptyState';

const Wishlist = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      <EmptyState 
        type="wishlist"
        onAction={() => window.location.href = '/shop'}
      />
    </div>
  );
};

export default Wishlist;