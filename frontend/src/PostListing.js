// AddressForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NavigationBar from './/Navbar.js'
import axios from "axios";


function AddressForm() {
  const navigate = useNavigate(); 
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [img_address, setImageAddress] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [custom_id, setCustomId] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let randomWholeNumber = Math.floor(Math.random() * 1000000000);
    let id_string = randomWholeNumber.toString();
    console.log("generated id: ", id_string);
    setCustomId(id_string);
    console.log("added id: ", custom_id);
    
    const listingData = {
      address,
      rent,
      img_address,
      description,
      email,
      custom_id: id_string
    };

    try {
      const response = await axios.post('http://localhost:8000/post-listing', listingData);
      console.log('Response from server:', response.data);
      
      setAddress('');
      setRent('');
      setImageAddress('');
      setDescription('');
      setEmail('');
      setCustomId('');

      navigate('/');

    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
  

  return (
    <div>
    <NavigationBar />
    <div style={{background: 'linear-gradient(130deg, #13294B, #a33b00)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Form style={{ maxWidth: '800px', color: 'white'}} onSubmit={handleSubmit}>
        <h1>Post Listing!</h1>
      <Form.Group>
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Rent (USD)</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter rent"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Image Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter image address"
          value={img_address}
          onChange={(e) => setImageAddress(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>E-mail</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        sumbich
      </Button>
    </Form>
    </div>
    </div>
  );
}

export default AddressForm;
