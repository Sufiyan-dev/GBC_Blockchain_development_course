import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Addresses.css'

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [defaultAdd, setDefaultAdd] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/account/addresses');
        let addresses = response.data.result
        const defaultAddress = addresses.pop();
        setDefaultAdd(defaultAddress);
        setAddresses(addresses);
        
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
                  <Link to={`/transfer/${address}`} state={{defaultAddress: defaultAdd}}>{address}</Link>
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