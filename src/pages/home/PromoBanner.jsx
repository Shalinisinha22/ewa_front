import React from 'react';

const PromoBanner = () => {
  return (
    <div>
      <section className='section__container banner__container'>
        <div className='banner__card'>
            <span><i className='ri-truck-line'></i></span>
            <h4> Free Delivery</h4>
            <p>Offers convemience and the ability to shop from anywhere,anytime.</p>

        </div>
        <div className='banner__card'>
            <span><i className='ri-money-dollar-circle-line'></i></span>
            <h4>100% Money Back gurranty</h4>
            <p>Offers convemience and the ability to shop from anywhere,anytime.</p>

        </div>
        <div className='banner__card'>
            <span><i className='ri-user-voice-fill'></i></span>
            <h4>Strong Support</h4>
            <p>Offers convemience and the ability to shop from anywhere,anytime.</p>

        </div>
      </section>
    </div>
  );
}

export default PromoBanner;
