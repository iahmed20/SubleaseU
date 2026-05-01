import React, { useState } from 'react';
import axios from "axios";
import { useAuth } from './AuthContext.js';


function Listing(props) {
  const { user } = useAuth();
  const [deleted, setDeleted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isUser = (user?.uid === props.uid)
  const [editing, setEditing] = useState(false);
const [editData, setEditData] = useState({
  address: props.address,
  rent: props.rent,
  description: props.description,
  bedrooms: props.bedrooms,
  bathrooms: props.bathrooms,
});

const handleSave = () => {
  axios.put(`http://localhost:8000/edit-listing/${props.custom_id}`, editData)
    .then(() => setEditing(false))
    .catch(err => console.error(err));
};

  const handleDelete = () => {

    if (isUser) {

    if (!confirmDelete) {
      setConfirmDelete(true);
    }

    axios.delete(`http://localhost:8000/delete-listing/${props.custom_id}`)
      .then(() => {
        setDeleted(true);
        if (props.onDelete) props.onDelete(props.custom_id);
      })
      .catch(error => {
        console.error('Error deleting listing:', error);
      });}
  };

  if (deleted) return null;

  const cardStyle = {
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '1.25rem',
    display: 'flex',
    flexDirection: 'row',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const imgStyle = {
    width: '260px',
    minWidth: '260px',
    height: '200px',
    objectFit: 'cover',
    backgroundColor: '#2a2a2a',
  };

  const imgPlaceholderStyle = {
    ...imgStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.2)',
    fontSize: '0.8rem',
  };

  const bodyStyle = {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  };

  const rentStyle = {
    color: '#ff6b35',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: "'Georgia', serif",
    marginBottom: '2px',
  };

  const addressStyle = {
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '8px',
  };

  const badgeRowStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '10px',
    flexWrap: 'wrap',
  };

  const badgeStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.7)',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '500',
  };

  const descStyle = {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    marginBottom: '12px',
    flex: 1,
  };

  const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  };

  const emailBtnStyle = {
    background: 'rgba(255,107,53,0.15)',
    border: '1px solid rgba(255,107,53,0.3)',
    color: '#ff6b35',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: '500',
  };

  const deleteBtnStyle = {
    background: confirmDelete ? 'rgba(220,38,38,0.2)' : 'transparent',
    border: confirmDelete ? '1px solid rgba(220,38,38,0.5)' : '1px solid rgba(255,255,255,0.1)',
    color: confirmDelete ? '#f87171' : 'rgba(255,255,255,0.3)',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s',
  };

  return (
    <div style={cardStyle}>
      {props.img_address ? (
        <img src={props.img_address} alt={props.address} style={imgStyle} />
      ) : (
        <div style={imgPlaceholderStyle}>No image</div>
      )}
      <div style={bodyStyle}>
        <div>
          {editing ? (
                  <div>
                    <input value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} />
                    <input value={editData.rent} onChange={(e) => setEditData({...editData, rent: e.target.value})} />
                    <input value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} />
                  </div>
                ) : (
                  <div>
                    <div style={rentStyle}>${props.rent}/mo</div>
                    <div style={addressStyle}>{props.address}</div>
                    <div style={descStyle}>{props.description}</div>
                  </div>
                )}
        </div>
        <div style={footerStyle}>
          <a href={`mailto:${props.email}`} style={emailBtnStyle}>✉ {props.email}</a>
         
          <button style={deleteBtnStyle} onClick={handleDelete}>
            {confirmDelete ? 'Confirm delete?' : 'Delete'}
          </button>
          {isUser && (
            editing ? (
              <>
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}>Edit</button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Listing;