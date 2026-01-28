import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { 
  getOrderById, 
  BTC_WALLET_ADDRESS, 
  recordWalletCopy, 
  recordPaymentConfirmation,
  getPaymentState,
  getOrderStatusLabel
} from '../../lib/orderService';
import { formatPrice } from '../../lib/productService';
import './Payment.css';

function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState(null);
  const [paymentState, setPaymentState] = useState(null);
  const [copied, setCopied] = useState(false);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate('/cart');
      return;
    }

    const foundOrder = getOrderById(orderId);
    if (!foundOrder) {
      navigate('/cart');
      return;
    }

    setOrder(foundOrder);
    
    const existingPaymentState = getPaymentState(orderId);
    if (existingPaymentState) {
      setPaymentState(existingPaymentState);
      if (existingPaymentState.paidStatus) {
        setConfirmed(true);
      }
    }
  }, [orderId, navigate]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(BTC_WALLET_ADDRESS);
      setCopied(true);
      recordWalletCopy(orderId);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = BTC_WALLET_ADDRESS;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      recordWalletCopy(orderId);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePaymentConfirmation = () => {
    recordPaymentConfirmation(orderId, paymentNotes);
    setConfirmed(true);
    setShowConfirmation(false);
    clearCart();
  };

  if (!order) {
    return (
      <div className="payment container">
        <div className="payment__loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const { whole, fraction } = formatPrice(order.totals.total);

  // Convert to BTC (mock rate: 1 BTC = $42,000)
  const btcRate = 42000;
  const btcAmount = (order.totals.total / btcRate).toFixed(8);

  return (
    <div className="payment container">
      <div className="payment__content">
        {/* Success Message after confirmation */}
        {confirmed && (
          <div className="payment__success card">
            <div className="success-icon">✓</div>
            <h2>Payment Submitted!</h2>
            <p>Thank you for your order. We've received your payment confirmation.</p>
            <p className="order-number">Order #: <strong>{order.id}</strong></p>
            <p className="status-note">
              Your order status: <span className="status-badge">{getOrderStatusLabel(order.status)}</span>
            </p>
            <p className="info-text">
              We will verify your payment and update your order status. 
              This usually takes 10-30 minutes after blockchain confirmation.
            </p>
            <div className="success-actions">
              <Link to="/orders" className="btn btn-amazon">View Your Orders</Link>
              <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
            </div>
          </div>
        )}

        {/* Payment Form */}
        {!confirmed && (
          <>
            <div className="payment__header">
              <h1>Complete Your Payment</h1>
              <p className="order-info">Order #{order.id}</p>
            </div>

            <div className="payment__main">
              {/* BTC Payment Section */}
              <div className="payment__btc-section card">
                <div className="btc-header">
                  <div className="btc-logo">₿</div>
                  <div className="btc-title">
                    <h2>Pay with Bitcoin</h2>
                    <p>Send the exact amount to the wallet address below</p>
                  </div>
                </div>

                {/* Amount Section */}
                <div className="btc-amount-section">
                  <div className="amount-row">
                    <span className="amount-label">Amount in USD:</span>
                    <span className="amount-usd">
                      <span className="price-symbol">$</span>
                      <span className="price-whole">{whole}</span>
                      <span className="price-fraction">{fraction}</span>
                    </span>
                  </div>
                  <div className="amount-row btc-row">
                    <span className="amount-label">Amount in BTC:</span>
                    <span className="amount-btc">{btcAmount} BTC</span>
                  </div>
                  <p className="rate-note">
                    Exchange rate: 1 BTC = ${btcRate.toLocaleString()} USD (for demo purposes)
                  </p>
                </div>

                {/* Wallet Address Section */}
                <div className="btc-wallet-section">
                  <h3>Send BTC to this wallet address:</h3>
                  
                  <div className="wallet-address-container">
                    <div className="wallet-address">
                      <span className="address-text">{BTC_WALLET_ADDRESS}</span>
                    </div>
                    <button 
                      className={`copy-btn ${copied ? 'copied' : ''}`}
                      onClick={handleCopyAddress}
                    >
                      {copied ? '✓ Copied!' : '📋 Copy Address'}
                    </button>
                  </div>

                  <div className="wallet-qr">
                    <div className="qr-placeholder">
                      <span className="qr-icon">⬛</span>
                      <span className="qr-text">QR Code</span>
                      <span className="qr-note">(Demo - No actual QR)</span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="btc-instructions">
                  <h3>How to pay:</h3>
                  <ol>
                    <li>Copy the wallet address above</li>
                    <li>Open your Bitcoin wallet app</li>
                    <li>Send exactly <strong>{btcAmount} BTC</strong> to the address</li>
                    <li>Wait for the transaction to be broadcast</li>
                    <li>Click "I Have Paid" button below</li>
                  </ol>
                </div>

                {/* Warning */}
                <div className="btc-warning">
                  <span className="warning-icon">⚠️</span>
                  <div className="warning-text">
                    <strong>Important:</strong> Send only Bitcoin (BTC) to this address. 
                    Sending any other cryptocurrency may result in permanent loss.
                  </div>
                </div>

                {/* Payment Confirmation */}
                {!showConfirmation ? (
                  <button 
                    className="btn btn-orange confirm-payment-btn"
                    onClick={() => setShowConfirmation(true)}
                  >
                    I Have Paid
                  </button>
                ) : (
                  <div className="payment-confirmation-form">
                    <h3>Confirm Your Payment</h3>
                    <p>Please confirm that you have sent the payment to the provided wallet address.</p>
                    
                    <div className="form-group">
                      <label className="form-label">
                        Transaction ID or Notes (optional)
                      </label>
                      <textarea
                        className="form-input form-textarea"
                        placeholder="Enter your transaction ID or any additional notes..."
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="confirmation-actions">
                      <button 
                        className="btn btn-amazon"
                        onClick={handlePaymentConfirmation}
                      >
                        ✓ Confirm Payment
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setShowConfirmation(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="payment__summary card">
                <h3>Order Summary</h3>
                
                <div className="summary-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="summary-item">
                      <img src={item.image} alt={item.title} />
                      <div className="summary-item-details">
                        <span className="summary-item-title">{item.title}</span>
                        <span className="summary-item-qty">Qty: {item.quantity}</span>
                        <span className="summary-item-price">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{order.totals.shipping === 0 ? 'FREE' : `$${order.totals.shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${order.totals.tax.toFixed(2)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>Total:</span>
                  <span className="total-amount">${order.totals.total.toFixed(2)}</span>
                </div>

                <div className="summary-btc">
                  <span>BTC Amount:</span>
                  <span className="btc-amount">{btcAmount} BTC</span>
                </div>

                <div className="summary-divider"></div>

                <div className="shipping-info">
                  <h4>Shipping to:</h4>
                  <p>
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Payment;
