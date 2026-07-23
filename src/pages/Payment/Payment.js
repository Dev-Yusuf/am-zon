import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { BTC_WALLET_ADDRESS, getOrderById, recordWalletCopy, recordPaymentConfirmation } from '../../lib/orderService';
import { formatPrice } from '../../lib/productService';
import './Payment.css';

function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { items, getCartTotal, clearCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const order = orderId ? getOrderById(orderId) : null;
  const total = order?.totals?.total ?? getCartTotal();
  const { whole, fraction } = formatPrice(total);
  const btcAmount = (total / 70000).toFixed(8).replace(/0+$/, '').replace(/\.$/, '') + ' BTC';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(BTC_WALLET_ADDRESS);
      recordWalletCopy(orderId || 'checkout-session');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy wallet address', error);
    }
  };

  const handlePaymentConfirmation = () => {
    if (items.length === 0) return;
    recordPaymentConfirmation(orderId || 'checkout-session', `Paid ${btcAmount} to ${BTC_WALLET_ADDRESS}`);
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
              <div className="btc-title">
                <h1>Payment submitted</h1>
                <p>Your Bitcoin payment has been confirmed to the checkout team.</p>
              </div>
            </div>

            <div className="btc-amount-section">
              <div className="amount-row">
                <span className="amount-label">Order ID</span>
                <span className="amount-usd">{orderId || 'checkout-session'}</span>
              </div>
              <div className="amount-row btc-row">
                <span className="amount-label">Paid amount</span>
                <span className="amount-btc">{btcAmount}</span>
              </div>
            </div>

            <div className="confirmation-actions">
              <Link to={orderId ? `/orders/${orderId}` : '/orders'} className="btn btn-amazon">
                View order status
              </Link>
              <Link to="/" className="btn btn-secondary">Continue shopping</Link>
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
            <div className="btc-logo">₿</div>
            <div className="btc-title">
              <h1>Complete your Bitcoin payment</h1>
              <p>Send the exact amount shown below to the wallet address provided.</p>
            </div>
          </div>

          <div className="btc-amount-section">
            <div className="amount-row">
              <span className="amount-label">Order total</span>
              <span className="amount-usd">
                <span className="price-symbol">$</span>
                <span className="price-whole">{whole}</span>
                <span className="price-fraction">{fraction}</span>
              </span>
            </div>
            <div className="amount-row btc-row">
              <span className="amount-label">Bitcoin amount</span>
              <span className="amount-btc">{btcAmount}</span>
            </div>
            <div className="rate-note">Exchange rate shown for checkout reference.</div>
          </div>

          <div className="btc-wallet-section">
            <h3>Send BTC to this wallet</h3>
            <div className="wallet-address-container">
              <div className="wallet-address">{BTC_WALLET_ADDRESS}</div>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy address'}
              </button>
            </div>

            <div className="wallet-qr">
              <div className="qr-placeholder">
                <span className="qr-icon">◫</span>
                <span className="qr-text">BTC QR</span>
                <span className="qr-note">Scan to pay</span>
              </div>
            </div>
          </div>

          <div className="btc-instructions">
            <h3>How to complete payment</h3>
            <ol>
              <li>Copy the Bitcoin wallet address above.</li>
              <li>Open your wallet and send the exact BTC amount shown.</li>
              <li>Return here and confirm your payment once the transfer is sent.</li>
            </ol>
          </div>

          <div className="payment-confirmation-form">
            <h3>Payment confirmation</h3>
            <p>Once you have sent the payment, tap the button below to confirm it.</p>
            <div className="confirmation-actions">
              <button className="btn btn-amazon confirm-payment-btn" onClick={handlePaymentConfirmation}>
                {confirmed ? 'Payment confirmed' : 'I have paid'}
              </button>
              <Link to="/" className="btn btn-secondary">Return home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
