import React, {useState, useEffect} from "react";
import axios from "axios";
//import logo from './logo.svg';
import "./App.css";
import Listing from "./Listing.js";
import NavigationBar from "./Navbar.js";
import PostListing from "./PostListing.js";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

function Home() {
  // 1. Remove the hardcoded initial listings (they'll be replaced by MongoDB data)
const [data, setdata] = useState({ listings: [] });

// 2. Set a more reasonable default max rent
const [min, setMin] = useState(0);
const [max, setMax] = useState(9999); // was 400 — this was filtering everything out!

// 3. Add [min, max] dependency array to useEffect so it only refetches when filter changes
useEffect(() => {
  axios({
    method: "GET",
    url: `http://localhost:8000/listings/${min}/${max}`, // use full URL to be safe
  })
    .then((response) => {
      const res = response.data;
      console.log(res);
      setdata({ listings: res });
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
      }
    });
}, [min, max]); 

  const handleMinChange = (event) => {
    setMin(parseInt(event.target.value));
  };

  const handleMaxChange = (event) => {
    setMax(parseInt(event.target.value));
  };

  const callListingsApi = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="Home"
      style={{background: "linear-gradient(130deg,#13294b,#a33b00)"}}
    >
      {/* Display the data from Flask API here */}
      {/* <h1 style={{ color: "white" }}>{data1.message}</h1> */}
      <NavigationBar />
      <form onSubmit={callListingsApi} style={{ color: 'white' }}>
        <label>
          Min Rent:
          <input type="number" value={min} onChange={handleMinChange} />      
        </label>
        <label>
          Max Rent:
          <input type="number" value={max} onChange={handleMaxChange} />
        </label>
        <br />
        {<button onClick = {callListingsApi} type="submit">Filter</button>}
      </form>
      {/* {listingDataItems} */}
      {data.listings.map((listing) => (
          <Listing
            key={listing.id_}
            rent={listing.rent}
            address={listing.address}
            description={listing.description}
            email={listing.email}
            img_address={listing.img_address}
            custom_id={listing.custom_id}
          />
        ))}
    </div>
  );
}

export default Home;
