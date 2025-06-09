import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us, including your name,
            email address, shipping address, and payment information when you make a purchase.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>To process your orders and payments</li>
            <li>To communicate with you about your orders</li>
            <li>To send you marketing communications (with your consent)</li>
            <li>To improve our services and website</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;