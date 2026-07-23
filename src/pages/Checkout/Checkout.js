import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../lib/orderService';
import { formatPrice } from '../../lib/productService';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const { whole, fraction } = formatPrice(subtotal);

  const startSimulation = () => {
    if (items.length === 0) return;

    const order = createOrder({
      items: items.map(item => ({
        productId: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.images?.[0] || ''
      })),
      totals: { subtotal, shipping: 0, tax: 0, total: subtotal },
      shippingAddress: {
        name: 'Demo Customer', street: 'Not collected', city: 'Simulation',
        state: 'Demo', zip: '00000', country: 'Educational demo'
      },
      payment: { method: 'simulated_btc', status: 'demo_pending' }
    });

    navigate(`/payment?orderId=${order.id}`);
  };

  return (
    <div className="checkout container">
      <div className="checkout__section active">
        <div className="section__header">
          <span className="section__number">1</span>
          <h1>Review simulated order</h1>
        </div>
        <div className="section__content">
          <div className="payment-notice">
            <p><strong>Educational simulation:</strong> No shipping details, wallet address, funds, or real order will be submitted.</p>
          </div>
          {items.length === 0 ? (
            <div className="checkout__empty">
              <p>Your demo cart is empty.</p>
              <Link to="/" className="btn btn-amazon">Return home</Link>
            </div>
          ) : (
            <>
              <div className="checkout__summary card">
                <h2>Demo order summary</h2>
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="checkout__item">
                    <span>{item.title}</span>
                    <span>${(item.price * item.quantity).toFixed(2)} <span className="checkout__qty">({item.quantity})</span></span>
                  </div>
                ))}
                <div className="checkout__total">
                  <span>Simulated total</span>
                  <span><span className="price-symbol">$</span><span className="price-whole">{whole}</span><span className="price-fraction">{fraction}</span></span>
                </div>
              </div>
              <div className="checkout__actions">
                <button className="btn btn-amazon" onClick={startSimulation}>Continue to payment simulation</button>
                <Link to="/cart" className="btn btn-secondary">Edit demo cart</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
