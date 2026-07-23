import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getOrderById, recordPaymentConfirmation } from '../../lib/orderService';
import { formatPrice } from '../../lib/productService';
import './Payment.css';

const DEMO_BTC_RATE = 70000;

function Payment() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const order = orderId ? getOrderById(orderId) : null;

  if (!order) {
    return (
      <div className="payment container">
        <div className="payment__btc-section card">
          <h1>No demo order found</h1>
          <p>Return to the cart and start the simulation again.</p>
          <Link to="/cart" className="btn btn-amazon">Return to cart</Link>
        </div>
      </div>
    );
  }

  const total = order.totals.total;
  const { whole, fraction } = formatPrice(total);
  const demoBtcAmount = `${(total / DEMO_BTC_RATE).toFixed(8)} demo BTC`;

  const completeSimulation = () => {
    recordPaymentConfirmation(order.id, `Simulated amount: ${demoBtcAmount}`);
    clearCart();
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="payment container">
        <div className="payment__content">
          <div className="payment__btc-section card payment__success">
            <div className="btc-header">
              <div className="btc-logo">✓</div>
              <div className="btc-title"><h1>Simulation complete</h1><p>No funds were sent and no real payment was recorded.</p></div>
            </div>
            <div className="confirmation-actions">
              <Link to={`/orders/${order.id}`} className="btn btn-amazon">View demo order</Link>
              <Link to="/" className="btn btn-secondary">Return home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment container">
      <div className="payment__content">
        <div className="payment__btc-section card">
          <div className="btc-header">
            <div className="btc-logo">D</div>
            <div className="btc-title"><h1>Simulated Bitcoin payment</h1><p>Interface demonstration only. This page cannot receive cryptocurrency.</p></div>
          </div>
          <div className="btc-amount-section">
            <div className="amount-row">
              <span className="amount-label">Demo order total</span>
              <span className="amount-usd"><span className="price-symbol">$</span><span className="price-whole">{whole}</span><span className="price-fraction">{fraction}</span></span>
            </div>
            <div className="amount-row btc-row"><span className="amount-label">Illustrative conversion</span><span className="amount-btc">{demoBtcAmount}</span></div>
            <div className="rate-note">Fixed fictional rate for UI testing: 1 demo BTC = $70,000.</div>
          </div>
          <div className="btc-wallet-section">
            <h3>Wallet disabled</h3>
            <div className="wallet-address-container">
              <div className="wallet-address">NO-REAL-WALLET-EDUCATIONAL-DEMO</div>
              <button className="copy-btn" type="button" disabled>Copy unavailable</button>
            </div>
          </div>
          <div className="btc-warning"><span className="warning-icon">⚠</span><div className="warning-text">Do not send funds. Completing this step changes local demo state only.</div></div>
          <div className="confirmation-actions">
            <button className="btn btn-amazon confirm-payment-btn" onClick={completeSimulation}>Complete simulation</button>
            <Link to="/cart" className="btn btn-secondary">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
