import React from 'react';
import { Link } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  return (
    <div className="checkout container">
      <div className="checkout__section active">
        <div className="section__header">
          <span className="section__number">!</span>
          <h1>Checkout</h1>
        </div>
        <div className="section__content">
          <Link to="/" className="btn btn-amazon">Return home</Link>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
