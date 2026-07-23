import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getDealProducts, getFeaturedProducts, getAllCategories, getHomepageProductWall } from '../../lib/productService';
import './Home.css';

function Home() {
  const deals = getDealProducts(8);
  const featured = getFeaturedProducts(8);
  const homepageWall = getHomepageProductWall(12);
  const categories = getAllCategories();

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="home__hero">
        <div className="home__hero-content">
          <h1>Welcome to White Bloom</h1>
          <p>Discover elevated cannabis, wellness, and lifestyle essentials curated for modern routines.</p>
          <Link to="/search" className="btn btn-amazon">Shop the collection</Link>
        </div>
      </div>

      <section className="home__awareness container" aria-labelledby="awareness-title">
        <img
          src="/images/substance-awareness-exhibit.jpeg"
          alt="Luxury cannabis lifestyle storefront"
          className="home__awareness-image"
        />
        <div className="home__awareness-content">
          <span className="home__awareness-label">CURATED WELLNESS COLLECTION</span>
          <h2 id="awareness-title">White Bloom Essentials</h2>
          <p>
            Discover premium flower, refined accessories, and everyday wellness picks in a clean,
            elevated retail experience.
          </p>
        </div>
      </section>

      {/* White Bloom Brand Banner */}
      <div className="home__used-banner container">
        <Link to="/search" className="used-banner">
          <div className="used-banner__badge">CURATED PICKS</div>
          <div className="used-banner__content">
            <div className="used-banner__icon">🌿</div>
            <div className="used-banner__text">
              <h2>White Bloom Essentials</h2>
              <p>Elevated routines, refined accessories, and wellness favorites for the modern lifestyle.</p>
              <span className="used-banner__cta">Shop the collection →</span>
            </div>
          </div>
          <div className="used-banner__items">
            <span>Wellness Rituals</span>
            <span>•</span>
            <span>Refined Accessories</span>
            <span>•</span>
            <span>Premium Essentials</span>
          </div>
        </Link>
      </div>

      {/* Product Wall */}
      <section className="home__product-wall container">
        <div className="home__section-header">
          <h2 className="home__section-title">Fresh picks</h2>
          <Link to="/search" className="home__section-link">Browse all</Link>
        </div>
        <div className="home__product-wall-grid">
          {homepageWall.map(product => (
            <div key={product.id} className="home__product-wall-item">
              <ProductCard product={product} compact />
            </div>
          ))}
        </div>
      </section>

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

    </div>
  );
}

export default Home;
