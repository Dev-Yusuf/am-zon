import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'amazon_clone_auth';
const USER_STORAGE_KEY = 'amazon_clone_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    
    if (savedAuth === 'true' && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    setLoading(false);
  }, []);

  const signIn = (email, password) => {
    // Simulate sign in - in a real app this would call an API
    const mockUser = {
      id: 'user_' + Date.now(),
      email,
      name: email.split('@')[0],
      addresses: [
        {
          id: 'addr_1',
          name: 'John Doe',
          street: '123 Main Street',
          city: 'Seattle',
          state: 'WA',
          zip: '98101',
          country: 'United States',
          isDefault: true
        }
      ],
      paymentMethods: [
        {
          id: 'pm_1',
          type: 'btc',
          label: 'Bitcoin (BTC)',
          isDefault: true
        }
      ]
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
    
    return { success: true };
  };

  const signUp = (name, email, password) => {
    // Simulate sign up
    const newUser = {
      id: 'user_' + Date.now(),
      email,
      name,
      addresses: [],
      paymentMethods: [
        {
          id: 'pm_1',
          type: 'btc',
          label: 'Bitcoin (BTC)',
          isDefault: true
        }
      ]
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: 'addr_' + Date.now()
    };
    const updatedAddresses = [...(user.addresses || []), newAddress];
    updateUser({ addresses: updatedAddresses });
    return newAddress;
  };

  const updateAddress = (addressId, updates) => {
    const updatedAddresses = user.addresses.map(addr =>
      addr.id === addressId ? { ...addr, ...updates } : addr
    );
    updateUser({ addresses: updatedAddresses });
  };

  const removeAddress = (addressId) => {
    const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
    updateUser({ addresses: updatedAddresses });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      signIn,
      signUp,
      signOut,
      updateUser,
      addAddress,
      updateAddress,
      removeAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
