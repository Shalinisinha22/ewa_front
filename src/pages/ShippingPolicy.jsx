import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Policy</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <p className="mb-4">
            We are committed to delivering your orders quickly and safely. Please review our 
            shipping policy below for detailed information about delivery times, costs, and procedures.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping Methods & Delivery Times</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3">Standard Shipping (5-7 Business Days)</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Free shipping on orders over $75</li>
              <li>$5.99 shipping fee for orders under $75</li>
              <li>Available for all domestic addresses</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3">Express Shipping (2-3 Business Days)</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>$12.99 shipping fee</li>
              <li>Available for most domestic addresses</li>
              <li>Order by 2 PM for same-day processing</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3">Overnight Shipping (1 Business Day)</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>$24.99 shipping fee</li>
              <li>Available for select areas only</li>
              <li>Order by 12 PM for next-day delivery</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
          <p className="mb-4">
            We currently ship to select international destinations. International shipping 
            costs vary by location and are calculated at checkout. Delivery times range 
            from 7-21 business days depending on the destination.
          </p>
          <p className="mb-4">
            Please note that international orders may be subject to customs duties and 
            taxes, which are the responsibility of the customer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Order Processing</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Orders are processed Monday through Friday, excluding holidays</li>
            <li>Orders placed after 2 PM will be processed the next business day</li>
            <li>You will receive a confirmation email once your order ships</li>
            <li>Tracking information will be provided via email</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping Restrictions</h2>
          <p className="mb-4">
            We cannot ship to P.O. boxes for express or overnight delivery. Some items 
            may have shipping restrictions due to size, weight, or destination. Any 
            restrictions will be noted on the product page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Damaged or Lost Packages</h2>
          <p className="mb-4">
            If your package arrives damaged or is lost in transit, please contact our 
            customer service team within 48 hours of the expected delivery date. We will 
            work with the shipping carrier to resolve the issue and ensure you receive 
            your order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-4">
            For questions about shipping or to track your order, please contact us:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Email: support@ewa.com</li>
            <li>Phone: (+91) 9999999999</li>
            <li>Hours: Monday-Friday, 9 AM - 6 PM IST</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;