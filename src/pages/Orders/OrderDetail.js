import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getOrderById, getOrderStatusLabel, getOrderStatusColor, getPaymentState } from '../../lib/orderService';
import './Orders.css';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [paymentState, setPaymentState] = useState(null);

  useEffect(() => {
    const foundOrder = getOrderById(id);
    if (!foundOrder) {
      navigate('/orders');
      return;
    }

    setOrder(foundOrder);
    setPaymentState(getPaymentState(id));
  }, [id, navigate]);

  if (!order) {
    return (
      <div className="order-detail container">
        <div className="spinner"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="order-detail container">
      <div className="order-detail__header">
        <Link to="/orders" className="back-link">← Back to Orders</Link>
        <h1>Order Details</h1>
        <p className="order-number">Order #{order.id}</p>
        <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
      </div>

      <div className="order-detail__content">
        <div className="order-detail__main">
          {/* Status Section */}
          <div className="detail-section card">
            <h2>Order Status</h2>
            <div className="status-display">
              <span 
                className="status-badge large"
                style={{ backgroundColor: getOrderStatusColor(order.status) }}
              >
                {getOrderStatusLabel(order.status)}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="status-timeline">
              {order.statusHistory.map((entry, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <span className="timeline-status">{getOrderStatusLabel(entry.status)}</span>
                    <span className="timeline-date">{formatDate(entry.timestamp)}</span>
                    {entry.message && (
                      <span className="timeline-message">{entry.message}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Section */}
          {order.tracking && (
            <div className="detail-section card">
              <h2>Tracking Information</h2>
              <div className="tracking-info">
                <div className="tracking-row">
                  <span className="label">Carrier:</span>
                  <span className="value">{order.tracking.carrier}</span>
                </div>
                <div className="tracking-row">
                  <span className="label">Tracking Number:</span>
                  <span className="value tracking-number">{order.tracking.trackingNumber}</span>
                </div>
                <div className="tracking-row">
                  <span className="label">Expected Delivery:</span>
                  <span className="value">{formatShortDate(order.tracking.estimatedDelivery)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Items Section */}
          <div className="detail-section card">
            <h2>Items Ordered</h2>
            <div className="detail-items">
              {order.items.map((item, index) => (
                <div key={index} className="detail-item">
                  <img src={item.image} alt={item.title} />
                  <div className="detail-item__info">
                    <Link to={`/product/${item.productId}`} className="detail-item__title">
                      {item.title}
                    </Link>
                    {item.selectedVariant && Object.keys(item.selectedVariant).length > 0 && (
                      <div className="detail-item__variants">
                        {Object.entries(item.selectedVariant).map(([key, value]) => (
                          <span key={key}>{key}: {value}</span>
                        ))}
                      </div>
                    )}
                    <div className="detail-item__meta">
                      <span>Qty: {item.quantity}</span>
                      <span>${item.price.toFixed(2)} each</span>
                    </div>
                  </div>
                  <div className="detail-item__price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="order-detail__sidebar">
          {/* Payment Information */}
          <div className="detail-section card">
            <h3>Payment Information</h3>
            <div className="payment-info">
              <div className="payment-method-display">
                <span className="btc-icon large">₿</span>
                <span>Bitcoin (BTC)</span>
              </div>
              {paymentState && (
                <div className="payment-details">
                  {paymentState.copiedAt && (
                    <div className="payment-row">
                      <span>Address Copied:</span>
                      <span>{formatShortDate(paymentState.copiedAt)}</span>
                    </div>
                  )}
                  {paymentState.paidAt && (
                    <div className="payment-row">
                      <span>Payment Confirmed:</span>
                      <span>{formatShortDate(paymentState.paidAt)}</span>
                    </div>
                  )}
                  {paymentState.paymentNotes && (
                    <div className="payment-notes">
                      <span>Notes:</span>
                      <p>{paymentState.paymentNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="detail-section card">
            <h3>Shipping Address</h3>
            <div className="address-display">
              <p><strong>{order.shippingAddress.name}</strong></p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="detail-section card">
            <h3>Order Summary</h3>
            <div className="summary-rows">
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
              <div className="summary-row total">
                <span>Order Total:</span>
                <span>${order.totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <Link to="/" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default OrderDetail;
