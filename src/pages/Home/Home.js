import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getDealProducts, getFeaturedProducts, getAllCategories } from '../../lib/productService';
import './Home.css';

function Home() {
  const deals = getDealProducts(8);
  const featured = getFeaturedProducts(8);
  const categories = getAllCategories();

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="home__hero">
        <div className="home__hero-content">
          <h1>Welcome to Shadow Syndicate</h1>
          <p>A fictional storefront interface for design and safety education</p>
          <Link to="/search" className="btn btn-amazon">Explore Demo Catalog</Link>
        </div>
      </div>

      <section className="home__awareness container" aria-labelledby="awareness-title">
        <img
          src="/images/substance-awareness-exhibit.jpeg"
          alt="Controlled-substance awareness exhibit"
          className="home__awareness-image"
        />
        <div className="home__awareness-content">
          <span className="home__awareness-label">EDUCATIONAL EXHIBIT — NOT FOR SALE</span>
          <h2 id="awareness-title">Controlled-Substance Awareness</h2>
          <p>
            This sample image demonstrates content moderation, risk labeling, and
            safe marketplace design. It cannot be added to a cart or purchased.
          </p>
          <button className="btn btn-secondary" type="button" disabled>
            Purchasing disabled
          </button>
        </div>
      </section>

      {/* Used Electronics Banner - Prominent Navigation */}
      <div className="home__used-banner container">
        <Link to="/used-electronics" className="used-banner">
          <div className="used-banner__badge">HOT DEALS</div>
          <div className="used-banner__content">
            <div className="used-banner__icon">📷</div>
            <div className="used-banner__text">
              <h2>Used Electronics</h2>
              <p>Quality Pre-Owned Cameras & Tripods at Great Prices!</p>
              <span className="used-banner__cta">Shop Now - Save Up to 60% →</span>
            </div>
          </div>
          <div className="used-banner__items">
            <span>Digital Cameras</span>
            <span>•</span>
            <span>Tripods</span>
            <span>•</span>
            <span>Sony</span>
            <span>•</span>
            <span>Canon</span>
            <span>•</span>
            <span>Nikon</span>
          </div>
        </Link>
      </div>

      {/* Category Cards */}
      <div className="home__categories container">
        <div className="home__categories-grid">
          {categories.slice(0, 4).map(category => (
            <div key={category.id} className="category-card">
              <h3 className="category-card__title">{category.name}</h3>
              <Link to={`/search?category=${category.id}`} className="category-card__image-link">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="category-card__image"
                />
              </Link>
              <div className="category-card__links">
                {category.subcategories.slice(0, 4).map(sub => (
                  <Link 
                    key={sub.id} 
                    to={`/search?category=${sub.id}`}
                    className="category-card__link"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
              <Link to={`/search?category=${category.id}`} className="category-card__see-more">
                See more
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Deals */}
      <section className="home__section container">
        <div className="home__section-header">
          <h2 className="home__section-title">Today's Deals</h2>
          <Link to="/search?deal=true" className="home__section-link">See all deals</Link>
        </div>
        <div className="home__products-scroll">
          {deals.map(product => (
            <div key={product.id} className="home__product-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Sign In Banner */}
      <div className="home__signin-banner container">
        <div className="card">
          <h3>Sign in for the best experience</h3>
          <Link to="/signin" className="btn btn-amazon">Sign in securely</Link>
        </div>
      </div>

      {/* More Categories */}
      <div className="home__categories container">
        <div className="home__categories-grid">
          {categories.slice(4).map(category => (
            <div key={category.id} className="category-card">
              <h3 className="category-card__title">{category.name}</h3>
              <Link to={`/search?category=${category.id}`} className="category-card__image-link">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="category-card__image"
                />
              </Link>
              <Link to={`/search?category=${category.id}`} className="category-card__see-more">
                Shop now
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <section className="home__section container">
        <div className="home__section-header">
          <h2 className="home__section-title">Best Sellers</h2>
          <Link to="/search?sortBy=reviews" className="home__section-link">See more</Link>
        </div>
        <div className="home__products-scroll">
          {featured.map(product => (
            <div key={product.id} className="home__product-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Crypto Payment Banner */}
      <div className="home__crypto-banner container">
        <div className="crypto-banner">
          <div className="crypto-banner__content">
            <h3>Payment Simulation Disabled</h3>
            <p>No wallet address, blockchain transfer, or real order is used in this educational demo.</p>
            <Link to="/payment" className="btn btn-orange">View Safety Notice</Link>
          </div>
          <div className="crypto-banner__icon">
            ₿
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
