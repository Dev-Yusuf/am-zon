import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../lib/productService';
import { createOrder, BTC_WALLET_ADDRESS, recordWalletCopy, recordPaymentConfirmation } from '../../lib/orderService';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal, getCartCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: ''
  });
  const [orderId, setOrderId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const total = getCartTotal();
  const count = getCartCount();
  const shippingCost = 0; // Free shipping
  const taxRate = 0.08;
  const tax = total * taxRate;
  const orderTotal = total + shippingCost + tax;

  const { whole, fraction } = formatPrice(orderTotal);

  // BTC conversion rate (mock)
  const btcRate = 0.000023; // 1 USD = 0.000023 BTC (example rate)
  const btcAmount = (orderTotal * btcRate).toFixed(8);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    // Pre-fill address if user is logged in
    if (isAuthenticated && user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setShippingAddress({
        name: defaultAddr.name,
        street: defaultAddr.street,
        city: defaultAddr.city,
        state: defaultAddr.state,
        zip: defaultAddr.zip,
        country: defaultAddr.country || 'United States',
        phone: defaultAddr.phone || ''
      });
    }
  }, [items.length, navigate, isAuthenticated, user]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    
    // Create order
    const order = createOrder({
      userId: user?.id || 'guest',
      items: items.map(item => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.images[0],
        selectedVariant: item.selectedVariant
      })),
      shippingAddress: shippingAddress,
      deliveryOption: 'standard',
      totals: {
        subtotal: total,
        shipping: shippingCost,
        tax: tax,
        total: orderTotal
      },
      payment: {
        method: 'btc',
        status: 'pending'
      }
    });

    setOrderId(order.id);
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(BTC_WALLET_ADDRESS);
    setCopied(true);
    recordWalletCopy(orderId);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePaymentConfirm = () => {
    recordPaymentConfirmation(orderId);
    setPaymentConfirmed(true);
    clearCart();
    
    // Redirect to orders page after a brief delay
    setTimeout(() => {
      navigate(`/orders/${orderId}`);
    }, 2000);
  };

  return (
    <div className="checkout container">
      <h1 className="checkout__title">Checkout</h1>

      <div className="checkout__content">
        <div className="checkout__main">
          {!orderId ? (
            // Step 1: Shipping Address Form
            <div className="checkout__section active">
              <div className="section__header">
                <span className="section__number">1</span>
                <h2>Enter Shipping Address</h2>
              </div>

              <div className="section__content">
                <form className="address-form" onSubmit={handleAddressSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Phone number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street address *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ZIP Code *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={shippingAddress.zip}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-amazon section__continue">
                    Continue to Payment
                  </button>
                </form>
              </div>
            </div>
          ) : (
            // Step 2: BTC Payment
            <div className="checkout__section active">
              <div className="section__header">
                <span className="section__number">2</span>
                <h2>Complete Payment with Bitcoin</h2>
              </div>

              <div className="section__content">
                {!paymentConfirmed ? (
                  <div className="btc-payment-section">
                    <div className="payment-instructions">
                      <h3>Payment Instructions</h3>
                      <ol>
                        <li>Send exactly <strong>{btcAmount} BTC</strong> (${orderTotal.toFixed(2)} USD) to the wallet address below</li>
                        <li>Copy the wallet address by clicking the copy button</li>
                        <li>Complete the payment in your Bitcoin wallet</li>
                        <li>Click "I Have Paid" button once payment is sent</li>
                      </ol>
                    </div>

                    <div className="btc-amount-display">
                      <div className="amount-label">Amount to Pay:</div>
                      <div className="amount-btc">{btcAmount} BTC</div>
                      <div className="amount-usd">(${orderTotal.toFixed(2)} USD)</div>
                    </div>

                    <div className="wallet-address-section">
                      <label className="wallet-label">Bitcoin Wallet Address:</label>
                      <div className="wallet-display">
                        <code className="wallet-address">{BTC_WALLET_ADDRESS}</code>
                        <button 
                          className={`btn-copy ${copied ? 'copied' : ''}`}
                          onClick={handleCopyWallet}
                        >
                          {copied ? '✓ Copied!' : 'Copy Address'}
                        </button>
                      </div>
                    </div>

                    <div className="qr-placeholder">
                      <div className="qr-code-box">
                        <div className="qr-icon">📱</div>
                        <p>Scan QR Code</p>
                        <div className="qr-note">QR code for wallet address</div>
                      </div>
                    </div>

                    <button 
                      className="btn btn-confirm-payment"
                      onClick={handlePaymentConfirm}
                    >
                      I Have Paid
                    </button>

                    <div className="payment-notice">
                      <p><strong>Note:</strong> Your order will be processed once we confirm your payment on the blockchain. This typically takes 10-30 minutes.</p>
                    </div>
                  </div>
                ) : (
                  <div className="payment-confirmed">
                    <div className="success-icon">✓</div>
                    <h3>Payment Confirmed!</h3>
                    <p>Thank you for your order. We've received your payment confirmation.</p>
                    <p>Redirecting to your order details...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="checkout__sidebar">
          <div className="order-summary card">
            <h3>Order Summary</h3>

            <div className="summary__row">
              <span>Items ({count}):</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="summary__row">
              <span>Shipping & handling:</span>
              <span>FREE</span>
            </div>

            <div className="summary__row">
              <span>Estimated tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="summary__divider"></div>

            <div className="summary__total">
              <span>Order total:</span>
              <span className="total-price">
                <span className="price-symbol">$</span>
                <span className="price-whole">{whole}</span>
                <span className="price-fraction">{fraction}</span>
              </span>
            </div>

            {orderId && (
              <div className="btc-total">
                <span>BTC Amount:</span>
                <span className="btc-value">{btcAmount} BTC</span>
              </div>
            )}
          </div>

          {/* Items Preview */}
          <div className="items-preview card">
            <h4>Items in your order</h4>
            <div className="items-list">
              {items.map((item, index) => (
                <div key={index} className="item-preview">
                  <img src={item.images[0]} alt={item.title} />
                  <div className="item-info">
                    <span className="item-title">{item.title}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
