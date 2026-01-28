import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function SignUp() {
  const navigate = useNavigate();
  const { signUp, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      const result = signUp(name, email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError('Failed to create account');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <Link to="/" className="auth__logo">
          <span className="auth__logo-text">amazon</span>
          <span className="auth__logo-suffix">.clone</span>
        </Link>

        <div className="auth__box card">
          <h1>Create account</h1>

          {error && (
            <div className="auth__error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your name</label>
              <input
                type="text"
                className="form-input"
                placeholder="First and last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="form-hint">
                <span className="hint-icon">ℹ️</span>
                Passwords must be at least 6 characters.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Re-enter password</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-amazon auth__submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create your Amazon Clone account'}
            </button>
          </form>

          <p className="auth__terms">
            By creating an account, you agree to Amazon Clone's{' '}
            <Link to="/conditions">Conditions of Use</Link> and{' '}
            <Link to="/privacy">Privacy Notice</Link>.
          </p>

          <div className="auth__divider-small">
            <span>Already have an account?</span>
          </div>

          <Link to="/signin" className="auth__signin-link">
            Sign in →
          </Link>
        </div>
      </div>

      <div className="auth__footer">
        <div className="auth__footer-links">
          <Link to="/conditions">Conditions of Use</Link>
          <Link to="/privacy">Privacy Notice</Link>
          <Link to="/help">Help</Link>
        </div>
        <p>© 2024, Amazon Clone - Demo Project</p>
      </div>
    </div>
  );
}

export default SignUp;
