# Amazon - Frontend

A high-fidelity Amazon e-commerce frontend built with React and Create React App. This project demonstrates a complete e-commerce UI with shopping cart, checkout flow, and Bitcoin payment integration.

## Features

- **Home Page**: Featured products, deals, category browsing
- **Product Search**: Full-text search with filters (category, price, rating, Prime)
- **Product Detail**: Image gallery, variants, reviews, add to cart
- **Shopping Cart**: Add/remove items, quantity management, save for later
- **Checkout Flow**: Address selection, delivery options, order summary
- **Bitcoin Payment**: BTC wallet address with copy functionality, "I have paid" confirmation
- **User Authentication**: Sign in/sign up UI (localStorage-based)
- **Account Management**: Profile, addresses, payment methods
- **Order Tracking**: Order history, status timeline, tracking info

## Tech Stack

- React 18 with Create React App
- React Router v6 for routing
- React Context for state management
- localStorage for data persistence
- CSS with responsive design

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header/
│   ├── Footer/
│   └── ProductCard/
├── context/             # React Context providers
│   ├── AuthContext.js
│   └── CartContext.js
├── data/                # Mock JSON data
│   ├── products.json
│   └── categories.json
├── lib/                 # Utility functions
│   ├── productService.js
│   └── orderService.js
├── pages/               # Page components
│   ├── Home/
│   ├── SearchResults/
│   ├── ProductDetail/
│   ├── Cart/
│   ├── Checkout/
│   ├── Payment/
│   ├── Auth/
│   ├── Account/
│   └── Orders/
├── styles/              # Global styles
├── App.js               # Main app component
└── index.js             # Entry point
```

## Payment Flow

This clone demonstrates a Bitcoin payment flow:

1. User proceeds to checkout
2. Selects shipping address and delivery option
3. Continues to payment (BTC is the priority option)
4. Sees BTC wallet address with copy button
5. Sends BTC to the provided address
6. Clicks "I Have Paid" to confirm
7. Order status updates to "Payment Submitted"

**Note**: This is a demo project. The BTC wallet address is a dummy address and no actual payments are processed.

## Data Persistence

All data is stored in the browser's localStorage:

- Cart items and saved for later
- User authentication state
- User profile and addresses
- Orders and payment confirmations

## License

This project is for educational purposes only. Amazon branding and trademarks belong to Amazon.com, Inc.
