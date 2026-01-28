import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Account.css';

function Account() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut, updateUser, addAddress, removeAddress } = useAuth();
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [editingEmail, setEditingEmail] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });

  // Show account page for both authenticated and guest users
  // Guest users will see limited options

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleEditProfile = () => {
    if (!isAuthenticated || !user) {
      return;
    }
    setEditingName(user.name);
    setEditingEmail(user.email);
    setEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (!isAuthenticated || !user) {
      return;
    }
    updateUser({ name: editingName, email: editingEmail });
    setEditingProfile(false);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      return;
    }
    addAddress(newAddress);
    setShowAddAddress(false);
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States'
    });
  };

  const handleRemoveAddress = (addressId) => {
    if (!isAuthenticated || !user) {
      return;
    }
    if (window.confirm('Are you sure you want to remove this address?')) {
      removeAddress(addressId);
    }
  };

  const accountSections = [
    {
      icon: '📦',
      title: 'Your Orders',
      description: 'Track, return, or buy things again',
      link: '/orders'
    },
    {
      icon: '🔒',
      title: 'Login & Security',
      description: 'Edit login, name, and mobile number',
      action: handleEditProfile
    },
    {
      icon: '📍',
      title: 'Your Addresses',
      description: 'Edit addresses for orders',
      scrollTo: 'addresses'
    },
    {
      icon: '💳',
      title: 'Payment Options',
      description: 'Edit or add payment methods',
      scrollTo: 'payment'
    }
  ];

  return (
    <div className="account container">
      <h1 className="account__title">Your Account</h1>

      {/* Account Sections Grid */}
      <div className="account__grid">
        {accountSections.map((section, index) => (
          <div 
            key={index} 
            className="account__card card"
            onClick={() => {
              if (section.link) navigate(section.link);
              else if (section.action) section.action();
              else if (section.scrollTo) {
                document.getElementById(section.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <div className="account__card-icon">{section.icon}</div>
            <div className="account__card-content">
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Section */}
      <section className="account__section" id="profile">
        <h2>Profile Information</h2>
        <div className="account__section-content card">
          {editingProfile ? (
            <div className="profile-edit">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={editingEmail}
                  onChange={(e) => setEditingEmail(e.target.value)}
                />
              </div>
              <div className="profile-edit-actions">
                <button className="btn btn-amazon" onClick={handleSaveProfile}>
                  Save Changes
                </button>
                <button className="btn btn-secondary" onClick={() => setEditingProfile(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              {isAuthenticated && user ? (
                <>
                  <div className="profile-row">
                    <span className="profile-label">Name:</span>
                    <span className="profile-value">{user.name}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Email:</span>
                    <span className="profile-value">{user.email}</span>
                  </div>
                  <button className="btn btn-secondary" onClick={handleEditProfile}>
                    Edit Profile
                  </button>
                </>
              ) : (
                <div className="profile-guest">
                  <p>You're browsing as a guest. Sign in to manage your profile and preferences.</p>
                  <Link to="/signin" className="btn btn-amazon">Sign In</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Addresses Section */}
      <section className="account__section" id="addresses">
        <h2>Your Addresses</h2>
        <div className="addresses-grid">
          {isAuthenticated && user ? (
            <>
              {/* Add Address Card */}
              <div 
                className="address-card address-card--add card"
                onClick={() => setShowAddAddress(true)}
              >
                <div className="add-icon">+</div>
                <span>Add Address</span>
              </div>

              {/* Existing Addresses */}
              {user.addresses?.map(address => (
            <div key={address.id} className="address-card card">
              {address.isDefault && <span className="default-badge">Default</span>}
              <p className="address-name">{address.name}</p>
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zip}</p>
              <p>{address.country}</p>
              <div className="address-actions">
                <button 
                  className="address-action"
                  onClick={() => handleRemoveAddress(address.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
            </>
          ) : (
            <div className="profile-guest card">
              <p>Sign in to save and manage your addresses.</p>
              <Link to="/signin" className="btn btn-amazon">Sign In</Link>
            </div>
          )}
        </div>

        {/* Add Address Form */}
        {showAddAddress && isAuthenticated && user && (
          <div className="add-address-modal">
            <div className="add-address-content card">
              <h3>Add a new address</h3>
              <form onSubmit={handleAddAddress}>
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Street address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.zip}
                      onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-amazon">Add Address</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddAddress(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-overlay" onClick={() => setShowAddAddress(false)} />
          </div>
        )}
      </section>

      {/* Payment Methods Section */}
      <section className="account__section" id="payment">
        <h2>Payment Methods</h2>
        <div className="payment-methods card">
          <div className="payment-method-item">
            <div className="payment-icon btc">₿</div>
            <div className="payment-details">
              <h4>Bitcoin (BTC)</h4>
              <p>Primary payment method</p>
            </div>
            <span className="default-badge">Default</span>
          </div>
          <p className="payment-note">
            We accept Bitcoin (BTC) as our primary payment method. You can pay using any Bitcoin wallet.
          </p>
        </div>
      </section>

      {/* Sign Out */}
      <div className="account__signout">
        <button className="btn btn-secondary" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Account;
