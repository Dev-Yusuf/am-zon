import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, isAuthenticated } = useAuth();

  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect === 'checkout' ? '/checkout' : redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      const result = signIn(email, password);
      
      if (result.success) {
        navigate(redirect === 'checkout' ? '/checkout' : redirect);
      } else {
        setError('Invalid email or password');
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
          <h1>Sign in</h1>

          {error && (
            <div className="auth__error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-amazon auth__submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="auth__terms">
            By continuing, you agree to Amazon Clone's{' '}
            <Link to="/conditions">Conditions of Use</Link> and{' '}
            <Link to="/privacy">Privacy Notice</Link>.
          </p>

          <div className="auth__help">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        </div>

        <div className="auth__divider">
          <span>New to Amazon Clone?</span>
        </div>

        <Link to="/signup" className="btn btn-secondary auth__create">
          Create your Amazon Clone account
        </Link>
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

export default SignIn;
