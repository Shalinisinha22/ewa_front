import React from 'react';

const PromoBanner = () => {
  return (
    <div className="bg-white py-12">
      <section className="max-w-screen-2xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="banner__card group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            <span className="inline-block text-3xl text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <i className='ri-truck-line'></i>
            </span>
            <h4 className="text-lg font-semibold mb-2">Free Delivery</h4>
            <p className="text-gray-600">Offers convenience and the ability to shop from anywhere, anytime.</p>
          </div>

          <div className="banner__card group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            <span className="inline-block text-3xl text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <i className='ri-money-dollar-circle-line'></i>
            </span>
            <h4 className="text-lg font-semibold mb-2">100% Money Back Guarantee</h4>
            <p className="text-gray-600">Shop with confidence with our money-back guarantee policy.</p>
          </div>

          <div className="banner__card group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            <span className="inline-block text-3xl text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <i className='ri-user-voice-fill'></i>
            </span>
            <h4 className="text-lg font-semibold mb-2">Strong Support</h4>
            <p className="text-gray-600">24/7 customer support to assist you with any queries.</p>
          </div>

          <div className="banner__card group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            <span className="inline-block text-3xl text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <i className='ri-shield-check-line'></i>
            </span>
            <h4 className="text-lg font-semibold mb-2">Secure Payment</h4>
            <p className="text-gray-600">Ensures safe and encrypted transactions for your peace of mind.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PromoBanner;
