import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Listing from "./Listing.js";
import NavigationBar from "./Navbar.js";

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(9999);
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');

  const fetchListings = () => {
    setLoading(true);
    axios.get(`http://localhost:8000/listings`, {
      params: { min, max, bedrooms, bathrooms }
    })
      .then((response) => {
        setListings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListings();
  }, []); // fetch on mount only; user hits "Apply Filters" to re-fetch

  const handleDeleteListing = (custom_id) => {
    // Remove the deleted listing from state immediately (no need to re-fetch)
    setListings(prev => prev.filter(l => l.custom_id !== custom_id));
  };

  const pageStyle = {
    background: "linear-gradient(160deg, #0d1b2e 0%, #1a0a00 100%)",
    minHeight: "100vh",
    fontFamily: "'system-ui', -apple-system, sans-serif",
  };

  const heroStyle = {
    padding: '3rem 2rem 2rem',
    textAlign: 'center',
  };

  const heroTitleStyle = {
    color: 'white',
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontFamily: "'Georgia', serif",
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    letterSpacing: '-1px',
  };

  const heroSubStyle = {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1rem',
    marginBottom: '2rem',
  };

  const filterCardStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '1.5rem',
    maxWidth: '860px',
    margin: '0 auto 2rem',
  };

  const filterRowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'flex-end',
  };

  const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1',
    minWidth: '120px',
  };

  const labelStyle = {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: 'white',
    padding: '10px 12px',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const applyButtonStyle = {
    background: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    alignSelf: 'flex-end',
  };

  const listingsGridStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 1rem 3rem',
  };

  const countStyle = {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    paddingLeft: '4px',
  };

  const emptyStyle = {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    padding: '4rem 2rem',
    fontSize: '1rem',
  };

  return (
    <div style={pageStyle}>
      <NavigationBar />

      <div style={heroStyle}>
        <h1 style={heroTitleStyle}>Find Your Next Sublease</h1>
        <p style={heroSubStyle}>Listings from Illinois students, for Illinois students</p>

        {/* Filter Panel */}
        <div style={filterCardStyle}>
          <div style={filterRowStyle}>
            <div style={filterGroupStyle}>
              <label style={labelStyle}>Min Rent</label>
              <input
                type="number"
                style={inputStyle}
                value={min}
                onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                placeholder="$0"
              />
            </div>
            <div style={filterGroupStyle}>
              <label style={labelStyle}>Max Rent</label>
              <input
                type="number"
                style={inputStyle}
                value={max}
                onChange={(e) => setMax(parseInt(e.target.value) || 9999)}
                placeholder="$9999"
              />
            </div>
            <div style={filterGroupStyle}>
              <label style={labelStyle}>Bedrooms</label>
              <select style={selectStyle} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                <option value="any">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div style={filterGroupStyle}>
              <label style={labelStyle}>Bathrooms</label>
              <select style={selectStyle} value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}>
                <option value="any">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </div>
            <button style={applyButtonStyle} onClick={fetchListings}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div style={listingsGridStyle}>
        {loading ? (
          <p style={emptyStyle}>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p style={emptyStyle}>No listings match your filters.</p>
        ) : (
          <>
            <p style={countStyle}>{listings.length} listing{listings.length !== 1 ? 's' : ''} found</p>
            {listings.map((listing) => (
              <Listing
                key={listing.custom_id}
                rent={listing.rent}
                address={listing.address}
                description={listing.description}
                email={listing.email}
                img_address={listing.img_address}
                custom_id={listing.custom_id}
                bedrooms={listing.bedrooms}
                bathrooms={listing.bathrooms}
                onDelete={handleDeleteListing}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;