import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById, getRelatedProducts, formatPrice, calculateSavings } from '../../lib/productService';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const foundProduct = getProductById(id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(0);
      setSelectedVariants({});
      setQuantity(1);
      setAddedToCart(false);
      setRelatedProducts(getRelatedProducts(id, 6));
    }
  }, [id]);

  if (!product) {
    return (
      <div className="product-detail container">
        <div className="product-detail__not-found">
          <h2>Product not found</h2>
          <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
      </div>
    );
  }

  const { whole, fraction } = formatPrice(product.price);
  const savings = calculateSavings(product.price, product.originalPrice);

  const handleVariantChange = (type, value) => {
    setSelectedVariants(prev => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariants, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariants, quantity);
    navigate('/cart');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star filled">★</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="star">☆</span>);
    }
    return stars;
  };

  return (
    <div className="product-detail container">
      <div className="product-detail__main">
        {/* Image Gallery */}
        <div className="product-detail__gallery">
          <div className="gallery__thumbnails">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`gallery__thumbnail ${selectedImage === index ? 'active' : ''}`}
                onMouseEnter={() => setSelectedImage(index)}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.title} - ${index + 1}`} />
              </button>
            ))}
          </div>
          <div className="gallery__main">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="gallery__main-image"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="product-detail__info">
          <h1 className="product-detail__title">{product.title}</h1>
          
          <div className="product-detail__brand">
            Visit the <Link to={`/search?q=${product.brand}`} className="brand-link">{product.brand} Store</Link>
          </div>

          <div className="product-detail__rating">
            <span className="rating-value">{product.rating}</span>
            <div className="stars">{renderStars(product.rating)}</div>
            <Link to="#reviews" className="rating-count">
              {product.reviewCount.toLocaleString()} ratings
            </Link>
          </div>

          <div className="product-detail__divider"></div>

          {/* Price Section */}
          <div className="product-detail__price-section">
            {savings && (
              <div className="price-deal">
                <span className="deal-badge">{savings.percentage}% off</span>
                <span className="deal-text">Limited time deal</span>
              </div>
            )}
            
            <div className="price-main">
              <span className="price-symbol">$</span>
              <span className="price-whole">{whole}</span>
              <span className="price-fraction">{fraction}</span>
            </div>

            {product.originalPrice && (
              <div className="price-original">
                List Price: <span className="strikethrough">${product.originalPrice.toFixed(2)}</span>
                {savings && <span className="savings-text"> Save {savings.formatted}</span>}
              </div>
            )}
          </div>

          {/* Variants */}
          {product.variations && product.variations.length > 0 && (
            <div className="product-detail__variants">
              {product.variations.map(variant => (
                <div key={variant.type} className="variant-group">
                  <label className="variant-label">
                    <span className="variant-type">{variant.type}:</span>
                    <span className="variant-selected">
                      {selectedVariants[variant.type] || variant.options[0]}
                    </span>
                  </label>
                  <div className="variant-options">
                    {variant.options.map(option => (
                      <button
                        key={option}
                        className={`variant-option ${
                          (selectedVariants[variant.type] || variant.options[0]) === option 
                            ? 'selected' 
                            : ''
                        }`}
                        onClick={() => handleVariantChange(variant.type, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Features */}
          <div className="product-detail__features">
            <h3>About this item</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Buy Box */}
        <div className="product-detail__buybox">
          <div className="buybox card">
            <div className="buybox__price">
              <span className="price-symbol">$</span>
              <span className="price-whole">{whole}</span>
              <span className="price-fraction">{fraction}</span>
            </div>

            {product.prime && (
              <div className="buybox__prime">
                <span className="prime-badge">prime</span>
                <span className="prime-text">FREE delivery</span>
              </div>
            )}

            <div className="buybox__delivery">
              <span className="delivery-date">
                {product.deliveryDays <= 1 
                  ? 'Tomorrow' 
                  : product.deliveryDays <= 2 
                    ? 'in 2 days'
                    : `in ${product.deliveryDays} days`
                }
              </span>
              <span className="delivery-text">Order within 12 hrs</span>
            </div>

            <div className="buybox__stock">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <>
                <div className="buybox__quantity">
                  <label>Qty:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  >
                    {[...Array(Math.min(10, product.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <button 
                  className="btn btn-amazon buybox__add"
                  onClick={handleAddToCart}
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>

                <button 
                  className="btn btn-orange buybox__buy"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </>
            )}

            <div className="buybox__info">
              <div className="buybox__info-row">
                <span>Ships from</span>
                <span>Amazon</span>
              </div>
              <div className="buybox__info-row">
                <span>Sold by</span>
                <span>{product.brand}</span>
              </div>
              <div className="buybox__info-row">
                <span>Payment</span>
                <span className="btc-payment">BTC Accepted ₿</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="product-detail__related">
          <h2>Customers also viewed</h2>
          <div className="related-products-grid">
            {relatedProducts.map(relProduct => (
              <ProductCard key={relProduct.id} product={relProduct} compact />
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      <section className="product-detail__description">
        <h2>Product Description</h2>
        <p>{product.description}</p>
      </section>
    </div>
  );
}

export default ProductDetail;
