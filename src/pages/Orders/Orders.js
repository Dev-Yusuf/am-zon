import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, getOrderStatusLabel, getOrderStatusColor } from '../../lib/orderService';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const allOrders = getOrders();
    setOrders(allOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'processing') return ['pending_payment', 'payment_submitted', 'confirmed', 'processing'].includes(order.status);
    if (filter === 'shipped') return ['shipped', 'out_for_delivery'].includes(order.status);
    if (filter === 'delivered') return order.status === 'delivered';
    if (filter === 'cancelled') return ['cancelled', 'refunded'].includes(order.status);
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="orders container">
      <h1 className="orders__title">Your Orders</h1>

      {/* Filter Tabs */}
      <div className="orders__filters">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button 
          className={`filter-tab ${filter === 'processing' ? 'active' : ''}`}
          onClick={() => setFilter('processing')}
        >
          Processing
        </button>
        <button 
          className={`filter-tab ${filter === 'shipped' ? 'active' : ''}`}
          onClick={() => setFilter('shipped')}
        >
          Shipped
        </button>
        <button 
          className={`filter-tab ${filter === 'delivered' ? 'active' : ''}`}
          onClick={() => setFilter('delivered')}
        >
          Delivered
        </button>
        <button 
          className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="orders__empty card">
          <h2>No orders found</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-amazon">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders__list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card card">
              <div className="order-card__header">
                <div className="order-info">
                  <div className="order-info__item">
                    <span className="label">ORDER PLACED</span>
                    <span className="value">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-info__item">
                    <span className="label">TOTAL</span>
                    <span className="value">${order.totals.total.toFixed(2)}</span>
                  </div>
                  <div className="order-info__item">
                    <span className="label">SHIP TO</span>
                    <span className="value">{order.shippingAddress.name}</span>
                  </div>
                </div>
                <div className="order-id">
                  <span className="label">ORDER # {order.id}</span>
                  <Link to={`/orders/${order.id}`} className="order-details-link">
                    View order details
                  </Link>
                </div>
              </div>

              <div className="order-card__body">
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getOrderStatusColor(order.status) }}
                  >
                    {getOrderStatusLabel(order.status)}
                  </span>
                  {order.tracking && (
                    <span className="delivery-date">
                      Expected delivery: {formatDate(order.tracking.estimatedDelivery)}
                    </span>
                  )}
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image} alt={item.title} />
                      <div className="order-item__details">
                        <Link to={`/product/${item.productId}`} className="order-item__title">
                          {item.title}
                        </Link>
                        <span className="order-item__qty">Qty: {item.quantity}</span>
                        <span className="order-item__price">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="order-item__actions">
                        <Link to={`/product/${item.productId}`} className="btn btn-secondary btn-sm">
                          Buy it again
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-card__footer">
                {order.payment?.method === 'btc' && (
                  <span className="payment-method">
                    <span className="btc-icon">₿</span>
                    Paid with Bitcoin
                  </span>
                )}
                <Link to={`/orders/${order.id}`} className="btn btn-secondary">
                  Track Package
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
