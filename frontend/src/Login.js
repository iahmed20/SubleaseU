import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Illinois-only gate
    if (!email.endsWith('@illinois.edu')) {
      setError('Only @illinois.edu email addresses are allowed.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/'); // go to listings after login
    } catch (err) {
      // Convert Firebase error codes to readable messages
      const messages = {
        'auth/user-not-found': 'No account found with that email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
        'auth/invalid-credential': 'Incorrect email or password.',
      };
      setError(messages[err.code] || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ---- Styles ----
  const pageStyle = {
    background: 'linear-gradient(160deg, #0d1b2e 0%, #1a0a00 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'system-ui', -apple-system, sans-serif",
    padding: '1rem',
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
  };

  const brandStyle = {
    color: '#ff6b35',
    fontFamily: "'Georgia', serif",
    fontSize: '1.6rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '0.25rem',
  };

  const subtitleStyle = {
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    fontSize: '0.85rem',
    marginBottom: '2rem',
  };

  const tabRowStyle = {
    display: 'flex',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '4px',
    marginBottom: '1.5rem',
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: '8px',
    border: 'none',
    borderRadius: '6px',
    background: active ? 'rgba(255,107,53,0.2)' : 'transparent',
    color: active ? '#ff6b35' : 'rgba(255,255,255,0.4)',
    fontWeight: active ? '600' : '400',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const groupStyle = { marginBottom: '1rem' };

  const labelStyle = {
    display: 'block',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '6px',
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: 'white',
    padding: '11px 14px',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const errorStyle = {
    background: 'rgba(220,38,38,0.15)',
    border: '1px solid rgba(220,38,38,0.3)',
    color: '#f87171',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  };

  const submitStyle = {
    width: '100%',
    background: loading ? '#555' : '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '13px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '0.5rem',
  };

  const illinoisBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(19,41,75,0.5)',
    border: '1px solid rgba(19,41,75,0.8)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.8rem',
    marginBottom: '1.5rem',
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={brandStyle}>SubleaseU</div>
        <div style={subtitleStyle}>Subleases for Illinois students</div>

        <div style={tabRowStyle}>
          <button style={tabStyle(mode === 'login')} onClick={() => { setMode('login'); setError(''); }}>
            Log In
          </button>
          <button style={tabStyle(mode === 'signup')} onClick={() => { setMode('signup'); setError(''); }}>
            Sign Up
          </button>
        </div>

        <div style={illinoisBadgeStyle}>
          🔒 Illinois students only — requires @illinois.edu email
        </div>

        {error && <div style={errorStyle}>⚠ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={groupStyle}>
            <label style={labelStyle}>Illinois Email</label>
            <input
              type="email"
              style={inputStyle}
              placeholder="yournetid@illinois.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={groupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              style={inputStyle}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'signup' && (
            <div style={groupStyle}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                style={inputStyle}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" style={submitStyle} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
