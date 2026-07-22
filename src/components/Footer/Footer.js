import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <button className="footer__back-to-top" onClick={scrollToTop}>
        Back to top
      </button>

      <div className="footer__links">
        <div className="footer__links-container">
          <div className="footer__column">
            <h4 className="footer__column-title">Get to Know Us</h4>
            <Link to="/about" className="footer__link">Careers</Link>
            <Link to="/about" className="footer__link">Blog</Link>
            <Link to="/about" className="footer__link">About us</Link>
            <Link to="/about" className="footer__link">Investor Relations</Link>
            <Link to="/about" className="footer__link">Design notes</Link>
          </div>

          <div className="footer__column">
            <h4 className="footer__column-title">Make Money with Us</h4>
            <Link to="/sell" className="footer__link">Marketplace opportunities</Link>
            <Link to="/sell" className="footer__link">Safety standards</Link>
            <Link to="/sell" className="footer__link">Accessibility</Link>
            <Link to="/sell" className="footer__link">Become an Affiliate</Link>
            <Link to="/sell" className="footer__link">Advertise Your Products</Link>
          </div>


          <div className="footer__column">
            <h4 className="footer__column-title">Let Us Help You</h4>
            <Link to="/account" className="footer__link">Your Account</Link>
            <Link to="/orders" className="footer__link">Your Orders</Link>
            <Link to="/shipping" className="footer__link">Shipping Rates & Policies</Link>
            <Link to="/returns" className="footer__link">Returns & Replacements</Link>
            <Link to="/help" className="footer__link">Help</Link>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__logo">
          <span className="footer__logo-text">Shadow Syndicate</span>
        </div>
        <p className="footer__copyright">
          © 2026 Shadow Syndicate.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
