import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder, BTC_WALLET_ADDRESS } from '../../lib/orderService';
import { formatPrice } from '../../lib/productService';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal } = useCart();
  const total = getCartTotal();
  const { whole, fraction } = formatPrice(total);

  const handleContinueToPayment = () => {
    if (items.length === 0) return;

    const order = createOrder({
      items: items.map(item => ({
        productId: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.images?.[0] || ''
      })),
      totals: {
        subtotal: total,
        shipping: 0,
        total
      },
      shippingAddress: {
        name: 'Guest Customer',
        street: '1 White Bloom Way',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'United States'
      },
      payment: {
        method: 'btc',
        walletAddress: BTC_WALLET_ADDRESS,
        status: 'pending'
      }
    });

    navigate(`/payment?orderId=${order.id}`);
  };

  return (
    <div className="checkout container">
      <div className="checkout__section active">
        <div className="section__header">
          <span className="section__number">!</span>
          <h1>Checkout</h1>
        </div>

        <div className="section__content">
          {items.length === 0 ? (
            <div className="checkout__empty">
              <p>Your cart is empty. Add a product to continue.</p>
              <Link to="/" className="btn btn-amazon">Return home</Link>
            </div>
          ) : (
            <>
              <div className="checkout__summary card">
                <h2>Order summary</h2>

                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="checkout__item">
                    <span>{item.title}</span>
                    <span>
                      <span className="price-symbol">$</span>
                      <span className="price-whole">{formatPrice(item.price).whole}</span>
                      <span className="price-fraction">{formatPrice(item.price).fraction}</span>
                      <span className="checkout__qty"> x {item.quantity}</span>
                    </span>
                  </div>
                ))}

                <div className="checkout__total">
                  <span>Total</span>
                  <span>
                    <span className="price-symbol">$</span>
                    <span className="price-whole">{whole}</span>
                    <span className="price-fraction">{fraction}</span>
                  </span>
                </div>
              </div>

              <div className="checkout__actions">
                <button className="btn btn-amazon" onClick={handleContinueToPayment}>
                  Continue to Bitcoin payment
                </button>
                <Link to="/" className="btn btn-secondary">Return home</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
