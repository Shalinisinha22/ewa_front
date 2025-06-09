import React from 'react';
import instaImg1 from '../assets/instagram-1.jpg';
import instaImg2 from '../assets/instagram-2.jpg';   
import instaImg3 from '../assets/instagram-3.jpg';
import instaImg4 from '../assets/instagram-4.jpg';
import instaImg5 from '../assets/instagram-5.jpg';
import instaImg6 from '../assets/instagram-6.jpg';
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
        <h4>INSTAGRAM</h4>
  <div className='instagram__grid'>
    <img src={instaImg1} alt='insta1' />
    <img src={instaImg2} alt='insta2' />
    <img src={instaImg3} alt='insta3' />
    <img src={instaImg4} alt='insta4' />
    <img src={instaImg5} alt='insta5' />
    <img src={instaImg6} alt='insta6' />

  </div>
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
