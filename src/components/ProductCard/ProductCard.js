import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, calculateSavings } from '../../lib/productService';
import './ProductCard.css';

function ProductCard({ product, compact = false }) {
  const { whole, fraction } = formatPrice(product.price);
  const savings = calculateSavings(product.price, product.originalPrice);
  const displayTitle = product.displayTitle || product.title;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="star empty">☆</span>);
    }
    return stars;
  };

  if (compact) {
    return (
      <Link to={`/product/${product.id}`} className="product-card product-card--compact">
        <div className="product-card__image-container">
          <img src={product.images[0]} alt={displayTitle} className="product-card__image" />
        </div>
        <div className="product-card__info">
          <h3 className="product-card__title">{displayTitle}</h3>
          <div className="product-card__price">
            <span className="price-symbol">$</span>
            <span className="price-whole">{whole}</span>
            <span className="price-fraction">{fraction}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image-container">
        {product.deal && <span className="product-card__badge">Deal</span>}
        <img src={product.images[0]} alt={product.title} className="product-card__image" />
      </div>
      
      <div className="product-card__info">
        <h3 className="product-card__title">{displayTitle}</h3>
        
        <div className="product-card__rating">
          <div className="stars">
            {renderStars(product.rating)}
          </div>
          <span className="rating-count">{product.reviewCount.toLocaleString()}</span>
        </div>

        <div className="product-card__price-section">
          {savings && (
            <div className="product-card__savings">
              <span className="savings-badge">{savings.percentage}% off</span>
              <span className="limited-deal">Limited time deal</span>
            </div>
          )}
          
          <div className="product-card__price">
            <span className="price-symbol">$</span>
            <span className="price-whole">{whole}</span>
            <span className="price-fraction">{fraction}</span>
          </div>
          
          {product.originalPrice && (
            <div className="product-card__original-price">
              List: <span className="strikethrough">${product.originalPrice.toFixed(2)}</span>
            </div>
          )}
        </div>

        {product.prime && (
          <div className="product-card__prime">
            <span className="prime-badge">White Bloom</span>
            <span className="prime-delivery">Dispatch in {product.deliveryDays <= 2 ? '24 hours' : `${product.deliveryDays} days`}</span>
          </div>
        )}

        {product.freeShipping && !product.prime && (
          <div className="product-card__shipping">
            White Bloom shipping
          </div>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
