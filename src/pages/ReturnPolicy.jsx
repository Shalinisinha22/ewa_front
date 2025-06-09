import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Return & Refund Policy</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
          <p className="mb-4">
            We accept returns within 30 days of purchase. Items must be unused and in 
            their original packaging with all tags attached.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
          <p className="mb-4">
            Refunds will be processed within 5-7 business days after we receive your return.
            The refund will be issued to the original payment method used for the purchase.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicy;