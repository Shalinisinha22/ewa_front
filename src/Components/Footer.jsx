import React, { useState, useEffect } from 'react';
import API from '../api';
import { getCurrentStoreName, getCurrentStoreId } from '../utils/storeUtils';

const Footer = () => {
  const [footerData, setFooterData] = useState({
    contactInfo: {
      address: 'Kankarbagh, Patna, Bihar',
      email: 'support@ewa.com',
      phone: '(+91) 9999999999'
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      pinterest: ''
    },
    mapSettings: {
      embedCode: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.8974!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f29937c52d4f05%3A0x831a0e05f607b270!2sKankarbagh%2C%20Patna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin',
      showMap: true
    },
    copyright: {
      text: 'Copyright © 2025 EWA. All rights reserved.',
      year: new Date().getFullYear()
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const storeId = getCurrentStoreId();
      const storeName = getCurrentStoreName();

      let endpoint = API.endpoints.publicFooter;

      if (storeId) {
        endpoint += `?storeId=${encodeURIComponent(storeId)}`;
      } else if (storeName) {
        endpoint += `?store=${encodeURIComponent(storeName)}`;
      } else {
        endpoint += `?store=ewa-luxe`;
      }

      const data = await API.request(endpoint);
      
      // Only update the dynamic parts
      setFooterData({
        contactInfo: data.contactInfo || footerData.contactInfo,
        socialLinks: data.socialLinks || footerData.socialLinks,
        mapSettings: data.mapSettings || footerData.mapSettings,
        copyright: data.copyright || footerData.copyright
      });
    } catch (error) {
      console.error('Error fetching footer data:', error);
      // Keep default data on error
    } finally {
      setLoading(false);
    }
  };

  const renderSocialLink = (url, iconClass) => {
    if (!url) return null;
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <i className={iconClass}></i>
      </a>
    );
  };

  if (loading) {
    return (
      <footer className='section__container footer__container'>
        <div className='flex justify-center items-center h-32'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500'></div>
        </div>
      </footer>
    );
  }

  return (
    <>
       <footer className='section__container footer__container'>
    <div className='footer__col'>
        <h4>CONTACT INFO</h4>
        <p>
            <span><i className='ri-map-pin-2-fill'></i></span>
              {footerData.contactInfo.address}
        </p>
        <p>
            <span><i className='ri-mail-fill'></i></span>
              {footerData.contactInfo.email}
        </p>
        <p>
            <span><i className='ri-phone-fill'></i></span>
            {footerData.contactInfo.phone}
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
        <a href='/orders'>Track your order</a>
        <a href='/shop?category=men'>Men</a>
        <a href='/shop?category=women'>Women</a>
        <a href='/shop?category=dresses'>Dresses</a>
    </div>

    <div className='footer__col'>
        <h4>SITEMAP</h4>
        {footerData.mapSettings.showMap && (
          <div className='mb-4'>
            <iframe 
                src={footerData.mapSettings.embedCode} 
                width="100%" 
                height="150" 
                style={{border: 0, borderRadius: '8px'}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
            ></iframe>
          </div>
        )}
    </div>
    </footer>
    <div className='footer__bar'>
        <p>{footerData.copyright.text.replace('2025', footerData.copyright.year)}</p>
        <div className='footer__socials'>
            {renderSocialLink(footerData.socialLinks.facebook, 'ri-facebook-fill')}
            {renderSocialLink(footerData.socialLinks.instagram, 'ri-instagram-fill')}
            {renderSocialLink(footerData.socialLinks.twitter, 'ri-twitter-fill')}
            {renderSocialLink(footerData.socialLinks.pinterest, 'ri-pinterest-fill')}
        </div>

    </div>
    </>


  );
};

export default Footer;