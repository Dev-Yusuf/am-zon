import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { getCartCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
    }
  };

  const categories = [
    { value: 'all', label: 'All Departments' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'computers', label: 'Computers' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Kitchen' },
    { value: 'books', label: 'Books' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'sports', label: 'Sports & Outdoors' },
  ];

  return (
    <header className="header">
      {/* Top Navigation */}
      <div className="header__top">
        <Link to="/" className="header__logo">
          <span className="header__logo-text">amazon</span>
        </Link>

        <div className="header__delivery">
          <span className="header__delivery-icon">📍</span>
          <div className="header__delivery-text">
            <span className="header__delivery-label">Deliver to</span>
            <span className="header__delivery-location">United States</span>
          </div>
        </div>

        <form className="header__search" onSubmit={handleSearch}>
          <select
            className="header__search-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <input
            type="text"
            className="header__search-input"
            placeholder="Search Amazon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="header__search-button">
            🔍
          </button>
        </form>

        <div className="header__nav">
          <Link to="/account" className="header__nav-item">
            <span className="header__nav-line1">
              Hello, {isAuthenticated && user ? user.name : 'Guest'}
            </span>
            <span className="header__nav-line2">Account & Lists</span>
          </Link>

          <Link to="/orders" className="header__nav-item">
            <span className="header__nav-line1">Returns</span>
            <span className="header__nav-line2">& Orders</span>
          </Link>

          <Link to="/cart" className="header__cart">
            <div className="header__cart-icon">
              🛒
              <span className="header__cart-count">{getCartCount()}</span>
            </div>
            <span className="header__cart-text">Cart</span>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="header__bottom">
        <div className="header__bottom-content">
          <button className="header__menu-button">
            ☰ All
          </button>
          <div className="header__links">
            <Link to="/search?category=electronics" className="header__link">Electronics</Link>
            <Link to="/search?category=computers" className="header__link">Computers</Link>
            <Link to="/search?category=fashion" className="header__link">Fashion</Link>
            <Link to="/search?category=home" className="header__link">Home & Kitchen</Link>
            <Link to="/search?category=books" className="header__link">Books</Link>
            <Link to="/search?deal=true" className="header__link">Today's Deals</Link>
            <Link to="/search?category=toys" className="header__link hide-mobile">Toys & Games</Link>
            <Link to="/search?category=sports" className="header__link hide-mobile">Sports</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
