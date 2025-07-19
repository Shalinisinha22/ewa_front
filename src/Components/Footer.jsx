import React from 'react';

const Footer = () => {
  return (
    <>
       <footer className='section__container footer__container'>
    <div className='footer__col'>
        <h4>CONTACT INFO</h4>
        <p>
            <span><i className='ri-map-pin-2-fill'></i></span>
              Kankarbagh,Patna,Bihar
        </p>
        <p>
            <span><i className='ri-mail-fill'></i></span>
              support@ewa.com
        </p>
        <p>
            <span><i className='ri-phone-fill'></i></span>
            (+91) 9999999999
        </p>
    </div>



    <div className='footer__col'>
        <h4>COMPANY</h4>
        <a href='/'>Home</a>
        <a href='/about'>About Us</a>
        <a href='/privacy-policy'>Privacy Policy</a>
        <a href='/terms-conditions'>Terms & Conditions</a>
        <a href='/return-policy'>Return & Refund Policy</a>
        <a href='/shipping-policy'>Shipping Policy</a>
    </div>



    <div className='footer__col'>
        <h4>USEFUL_LINK</h4>
        <a href='/contact'>Help</a>
        <a href='/'>Track your order</a>
        <a href='/shop'>Men</a>
        <a href='/shop'>Women</a>
        <a href='/shop'>Dresses</a>
    </div>

    <div className='footer__col'>
        <h4>SITEMAP</h4>
        <div className='mb-4'>
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.8974!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f29937c52d4f05%3A0x831a0e05f607b270!2sKankarbagh%2C%20Patna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin" 
                width="100%" 
                height="150" 
                style={{border: 0, borderRadius: '8px'}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
            ></iframe>
        </div>
{/*         <a href='/'>Home</a>
        <a href='/shop'>Shop</a>
        <a href='/categories/accessories'>Accessories</a>
        <a href='/categories/dress'>Dresses</a>
        <a href='/categories/jewellery'>Jewellery</a>
        <a href='/categories/cosmetics'>Cosmetics</a>
        <a href='/blog'>Blog</a>
        <a href='/contact'>Contact</a> */}
    </div>
    </footer>
    <div className='footer__bar'>
        <p>Copyright &copy; 2025 EWA. All rights reserved.</p>
        <div className='footer__socials'>
            <a href='/'>
                <i className='ri-facebook-fill'></i>
            </a>
            <a href='/'>
                <i className='ri-instagram-fill'></i>
            </a>
            <a href='/'>
                <i className='ri-twitter-fill'></i>
            </a>
            <a href='/'>
                <i className='ri-pinterest-fill'></i>
            </a>
        </div>

    </div>
    </>


  );
}

export default Footer;
