import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js';

function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navStyle = {
    backgroundColor: '#0a0a0a',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '0 2rem',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(12px)',
  };

  const brandStyle = {
    color: '#ff6b35',
    fontFamily: "'Georgia', serif",
    fontSize: '1.4rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#ff6b35' : 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: location.pathname === path ? 'rgba(255,107,53,0.12)' : 'transparent',
    border: location.pathname === path ? '1px solid rgba(255,107,53,0.3)' : '1px solid transparent',
    transition: 'all 0.2s ease',
  });

  const postButtonStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
    padding: '8px 20px',
    borderRadius: '6px',
    backgroundColor: '#ff6b35',
    border: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>SubleaseU</Link>
      <div style={navLinksStyle}>
        <Link to="/" style={linkStyle('/')}>View Listings</Link>
        <Link to="/messages" style={linkStyle('/messages')}>Messages</Link>
        <Link to="/post-listing" style={postButtonStyle}>+ Post Listing</Link>

        {user && (
          <div style={{display:'flex',alignItems:'center',gap:'10px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'6px 12px'}}>
            <span style={{color:'rgba(255,255,255,0.5)',fontSize:'0.78rem',maxWidth:'180px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {user.email}
            </span>
            <button onClick={handleLogout} style={{background:'transparent',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.4)',padding:'4px 10px',borderRadius:'5px',fontSize:'0.75rem',cursor:'pointer'}}>
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;