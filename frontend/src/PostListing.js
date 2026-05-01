import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js';
import NavigationBar from './Navbar.js';
import axios from "axios";


function AddressForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [img_address, setImageAddress] = useState('');
  const uid = user?.uid || ''
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const email = user?.email || '';

  const validate = () => {
    const newErrors = {};
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!rent) {
      newErrors.rent = 'Rent is required';
    } else if (isNaN(rent) || Number(rent) <= 0) {
      newErrors.rent = 'Rent must be a positive number';
    }
    if (!bedrooms) newErrors.bedrooms = 'Select number of bedrooms';
    if (!bathrooms) newErrors.bathrooms = 'Select number of bathrooms';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const custom_id = Math.floor(Math.random() * 1000000000).toString();
    const listingData = { address, rent, img_address, description, email, bedrooms, bathrooms, custom_id, uid};

    try {
      await axios.post('http://localhost:8000/post-listing', listingData);
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.error || 'Something went wrong. Please try again.';
      setServerError(msg);
      setSubmitting(false);
    }
  };

  const pageStyle = {
    background: 'linear-gradient(160deg, #0d1b2e 0%, #1a0a00 100%)',
    minHeight: '100vh',
    fontFamily: "'system-ui', -apple-system, sans-serif",
  };
  const formWrapStyle = { maxWidth: '580px', margin: '0 auto', padding: '2rem 1.5rem 4rem' };
  const titleStyle = { color: 'white', fontFamily: "'Georgia', serif", fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' };
  const subtitleStyle = { color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '2rem' };
  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' };
  const groupStyle = { marginBottom: '1.25rem' };
  const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' };
  const inputStyle = (hasError) => ({ width: '100%', background: 'rgba(255,255,255,0.07)', border: hasError ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'white', padding: '11px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' });
  const lockedInputStyle = { ...inputStyle(false), color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed' };
  const errorStyle = { color: '#f87171', fontSize: '0.78rem', marginTop: '4px' };
  const rowStyle = { display: 'flex', gap: '1rem' };
  const submitStyle = { width: '100%', background: submitting ? '#555' : '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '1rem', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer', marginTop: '0.5rem' };
  const serverErrorStyle = { background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', borderRadius: '8px', padding: '12px', fontSize: '0.875rem', marginBottom: '1rem' };

  return (
    <div style={pageStyle}>
      <NavigationBar />
      <div style={formWrapStyle}>
        <h1 style={titleStyle}>Post a Listing</h1>
        <p style={subtitleStyle}>Posting as {email}</p>

        <div style={cardStyle}>
          {serverError && <div style={serverErrorStyle}>⚠ {serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
             
            {/* Locked email field - auto-filled from Firebase */}
            <div style={groupStyle}>
              <label style={labelStyle}>Contact Email (your account)</label>
              <input type="email" style={lockedInputStyle} value={email} readOnly />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Address *</label>
              <input type="text" style={inputStyle(errors.address)} placeholder="e.g. 309 E Green St, Champaign, IL" value={address} onChange={(e) => setAddress(e.target.value)} />
              {errors.address && <div style={errorStyle}>{errors.address}</div>}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Monthly Rent (USD) *</label>
              <input type="number" style={inputStyle(errors.rent)} placeholder="e.g. 850" value={rent} onChange={(e) => setRent(e.target.value)} min="1" />
              {errors.rent && <div style={errorStyle}>{errors.rent}</div>}
            </div>

            <div style={{ ...rowStyle, marginBottom: '1.25rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Bedrooms *</label>
                <select style={inputStyle(errors.bedrooms)} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
                {errors.bedrooms && <div style={errorStyle}>{errors.bedrooms}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Bathrooms *</label>
                <select style={inputStyle(errors.bathrooms)} value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}>
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3+</option>
                </select>
                {errors.bathrooms && <div style={errorStyle}>{errors.bathrooms}</div>}
              </div>
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Image URL</label>
              <input type="text" style={inputStyle(false)} placeholder="https://..." value={img_address} onChange={(e) => setImageAddress(e.target.value)} />
            </div>
            
            <div style={groupStyle}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle(false), resize: 'vertical', minHeight: '90px' }} placeholder="Describe the unit, amenities, lease dates..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>

            <button type="submit" style={submitStyle} disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddressForm;