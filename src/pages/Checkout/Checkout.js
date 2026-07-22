import React from 'react';
import { Link } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  return (
    <div className="checkout container">
      <div className="checkout__section active">
        <div className="section__header">
          <span className="section__number">!</span>
          <h1>Checkout is disabled</h1>
        </div>
        <div className="section__content">
          <h2>Educational demonstration only</h2>
          <p>
            Shadow Syndicate does not accept orders, collect shipping information,
            display real wallet addresses, or process cryptocurrency payments.
          </p>
          <p>No cart contents have been submitted and no transaction has been created.</p>
          <Link to="/" className="btn btn-amazon">Return to the demonstration</Link>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
