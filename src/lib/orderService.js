const ORDERS_STORAGE_KEY = 'amazon_clone_orders';
const PAYMENT_STORAGE_KEY = 'amazon_clone_payment';

// BTC Wallet Address (dummy)
export const BTC_WALLET_ADDRESS = 'bc1qxruruy6drkmlgq6tashf6ac6pfl2wtnfx80kuj';

// Get all orders from localStorage
export function getOrders() {
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse orders', e);
    }
  }
  return [];
}

// Get order by ID
export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
}

// Create new order
export function createOrder(orderData) {
  const orders = getOrders();
  
  const newOrder = {
    id: 'order_' + Date.now(),
    ...orderData,
    status: 'pending_payment',
    tracking: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [
      {
        status: 'pending_payment',
        timestamp: new Date().toISOString(),
        message: 'Order created, awaiting payment'
      }
    ]
  };
  
  orders.unshift(newOrder);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  
  return newOrder;
}

// Update order status
export function updateOrderStatus(orderId, status, message = '') {
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) return null;
  
  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date().toISOString();
  orders[orderIndex].statusHistory.push({
    status,
    timestamp: new Date().toISOString(),
    message
  });
  
  // Simulate tracking for confirmed orders
  if (status === 'confirmed') {
    orders[orderIndex].tracking = {
      carrier: 'Amazon Logistics',
      trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
  
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  
  return orders[orderIndex];
}

// Get payment state
export function getPaymentState(orderId) {
  const stored = localStorage.getItem(PAYMENT_STORAGE_KEY);
  if (stored) {
    try {
      const payments = JSON.parse(stored);
      return payments[orderId] || null;
    } catch (e) {
      console.error('Failed to parse payment state', e);
    }
  }
  return null;
}

// Save payment state
export function savePaymentState(orderId, paymentData) {
  let payments = {};
  const stored = localStorage.getItem(PAYMENT_STORAGE_KEY);
  
  if (stored) {
    try {
      payments = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse existing payments', e);
    }
  }
  
  payments[orderId] = {
    ...paymentData,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(payments));
  
  return payments[orderId];
}

// Record wallet address copy
export function recordWalletCopy(orderId) {
  const currentState = getPaymentState(orderId) || {};
  return savePaymentState(orderId, {
    ...currentState,
    walletAddress: BTC_WALLET_ADDRESS,
    copiedAt: new Date().toISOString()
  });
}

// Record payment confirmation ("I have paid" button clicked)
export function recordPaymentConfirmation(orderId, notes = '') {
  const currentState = getPaymentState(orderId) || {};
  const paymentState = savePaymentState(orderId, {
    ...currentState,
    paidAt: new Date().toISOString(),
    paidStatus: 'pending_verification',
    paymentNotes: notes
  });
  
  // Update order status
  updateOrderStatus(orderId, 'payment_submitted', 'Payment confirmation received, pending verification');
  
  return paymentState;
}

// Get order status label
export function getOrderStatusLabel(status) {
  const labels = {
    'pending_payment': 'Awaiting Payment',
    'payment_submitted': 'Payment Submitted',
    'confirmed': 'Order Confirmed',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded'
  };
  return labels[status] || status;
}

// Get order status color
export function getOrderStatusColor(status) {
  const colors = {
    'pending_payment': '#b12704',
    'payment_submitted': '#f0c14b',
    'confirmed': '#067d62',
    'processing': '#007185',
    'shipped': '#007185',
    'out_for_delivery': '#067d62',
    'delivered': '#067d62',
    'cancelled': '#565959',
    'refunded': '#565959'
  };
  return colors[status] || '#0f1111';
}
