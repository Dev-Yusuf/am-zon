import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/productService';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { 
    items, 
    savedForLater, 
    removeFromCart, 
    updateQuantity, 
    saveForLater,
    moveToCart,
    removeSaved,
    getCartTotal, 
    getCartCount 
  } = useCart();

  const total = getCartTotal();
  const count = getCartCount();
  const { whole, fraction } = formatPrice(total);

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="cart container">
        <div className="cart__empty card">
          <h2>Your Amazon Cart is empty</h2>
          <p>Shop today's deals</p>
          <Link to="/" className="btn btn-amazon">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart container">
      <div className="cart__main">
        {/* Cart Items */}
        <div className="cart__items card">
          <h1 className="cart__title">Shopping Cart</h1>
          <div className="cart__header">
            <span className="cart__header-price">Price</span>
          </div>

          {items.map((item, index) => {
            const { whole: itemWhole, fraction: itemFraction } = formatPrice(item.price);
            
            return (
              <div key={`${item.id}-${index}`} className="cart-item">
                <div className="cart-item__image">
                  <Link to={`/product/${item.id}`}>
                    <img src={item.images[0]} alt={item.title} />
                  </Link>
                </div>
                
                <div className="cart-item__details">
                  <Link to={`/product/${item.id}`} className="cart-item__title">
                    {item.title}
                  </Link>
                  
                  {item.stock > 0 ? (
                    <span className="cart-item__stock in-stock">In Stock</span>
                  ) : (
                    <span className="cart-item__stock out-of-stock">Out of Stock</span>
                  )}

                  {item.selectedVariant && Object.keys(item.selectedVariant).length > 0 && (
                    <div className="cart-item__variants">
                      {Object.entries(item.selectedVariant).map(([key, value]) => (
                        <span key={key} className="cart-item__variant">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.prime && (
                    <div className="cart-item__prime">
                      <span className="prime-badge">prime</span>
                      <span>FREE Delivery</span>
                    </div>
                  )}

                  <div className="cart-item__actions">
                    <div className="cart-item__quantity">
                      <label>Qty:</label>
                      <select
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <span className="action-divider">|</span>
                    <button 
                      className="cart-item__action-btn"
                      onClick={() => removeFromCart(index)}
                    >
                      Delete
                    </button>
                    <span className="action-divider">|</span>
                    <button 
                      className="cart-item__action-btn"
                      onClick={() => saveForLater(index)}
                    >
                      Save for later
                    </button>
                  </div>
                </div>

                <div className="cart-item__price">
                  <span className="price-symbol">$</span>
                  <span className="price-whole">{itemWhole}</span>
                  <span className="price-fraction">{itemFraction}</span>
                </div>
              </div>
            );
          })}

          <div className="cart__subtotal">
            Subtotal ({count} {count === 1 ? 'item' : 'items'}): 
            <span className="cart__subtotal-price">
              <span className="price-symbol">$</span>
              <span className="price-whole">{whole}</span>
              <span className="price-fraction">{fraction}</span>
            </span>
          </div>
        </div>

        {/* Saved for Later */}
        {savedForLater.length > 0 && (
          <div className="cart__saved card">
            <h2>Saved for Later ({savedForLater.length} {savedForLater.length === 1 ? 'item' : 'items'})</h2>
            
            {savedForLater.map((item, index) => {
              const { whole: itemWhole, fraction: itemFraction } = formatPrice(item.price);
              
              return (
                <div key={`saved-${item.id}-${index}`} className="cart-item">
                  <div className="cart-item__image">
                    <Link to={`/product/${item.id}`}>
                      <img src={item.images[0]} alt={item.title} />
                    </Link>
                  </div>
                  
                  <div className="cart-item__details">
                    <Link to={`/product/${item.id}`} className="cart-item__title">
                      {item.title}
                    </Link>
                    
                    <div className="cart-item__price-inline">
                      <span className="price-symbol">$</span>
                      <span className="price-whole">{itemWhole}</span>
                      <span className="price-fraction">{itemFraction}</span>
                    </div>

                    <div className="cart-item__actions">
                      <button 
                        className="cart-item__action-btn"
                        onClick={() => moveToCart(index)}
                      >
                        Move to Cart
                      </button>
                      <span className="action-divider">|</span>
                      <button 
                        className="cart-item__action-btn"
                        onClick={() => removeSaved(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Checkout Sidebar */}
      {items.length > 0 && (
        <aside className="cart__sidebar">
          <div className="cart__checkout card">
            <div className="checkout__free-shipping">
              ✓ Your order qualifies for FREE Shipping
            </div>
            
            <div className="checkout__subtotal">
              Subtotal ({count} {count === 1 ? 'item' : 'items'}): 
              <span className="checkout__price">
                <span className="price-symbol">$</span>
                <span className="price-whole">{whole}</span>
                <span className="price-fraction">{fraction}</span>
              </span>
            </div>

            <label className="checkout__gift">
              <input type="checkbox" />
              <span>This order contains a gift</span>
            </label>

            <button 
              className="btn btn-amazon checkout__btn"
              onClick={handleProceedToCheckout}
            >
              Proceed to checkout
            </button>

            <div className="checkout__btc-note">
              <span className="btc-icon">₿</span>
              <span>Pay with Bitcoin at checkout</span>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export default Cart;
