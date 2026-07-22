import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const [copied, setCopied] = useState(false);
  const btcAmount = '0.00027500 BTC';
  const walletAddress = 'bc1qjykuv8htjgvx70y5g3je7n8ymfak40le28g93d';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy wallet address', error);
    }
  };

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
                <span className="price-whole">89</span>
                <span className="price-fraction">.24</span>
              </span>
            </div>
            <div className="amount-row btc-row">
              <span className="amount-label">Bitcoin amount</span>
              <span className="amount-btc">{btcAmount}</span>
            </div>
            <div className="rate-note">Estimated rate shown for demo checkout purposes.</div>
          </div>

          <div className="btc-wallet-section">
            <h3>Send BTC to this wallet</h3>
            <div className="wallet-address-container">
              <div className="wallet-address">{walletAddress}</div>
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
              <button className="btn btn-amazon confirm-payment-btn">I have paid</button>
              <Link to="/" className="btn btn-secondary">Return home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
