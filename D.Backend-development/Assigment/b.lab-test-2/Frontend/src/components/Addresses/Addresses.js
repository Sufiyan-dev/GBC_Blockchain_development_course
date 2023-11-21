import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Addresses.css'

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/account/addresses');
        setAddresses(response.data.result);
        
      } catch (error) {
        console.error('Error fetching data from the backend', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
        <h1>Blockchain Node Addresses</h1>
        {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {addresses.length > 0 ? (
            <ul>
              {addresses.map((address, index) => (
                <div key={address} className='address-wrapper'>
                  <Link to={`/transfer/${address}`}>{address}</Link>
                </div>
              ))}
            </ul>
          ) : (
            <p>Failed to retrieve addresses</p>
          )}
        </>
      )}
    </div>
  )
}

export default Addresses