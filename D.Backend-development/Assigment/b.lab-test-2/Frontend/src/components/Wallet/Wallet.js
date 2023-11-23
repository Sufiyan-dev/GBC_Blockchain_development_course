import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Wallet.css'

const Wallet = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAdd = await axios.get(`http://localhost:4000/account/addresses`);

        if (responseAdd.status === 200) {
          setAddresses(responseAdd.data.result);
          if (responseAdd.data.result.length > 0) {
            const length = responseAdd.data.result.length - 1
            // Set the first address as the default selected address
            setSelectedAddress(responseAdd.data.result[length]);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching addresses from the backend', error);
        setAddresses([]);
        setSelectedAddress('');
        setBalance(null);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (selectedAddress !== '') {
          const response = await axios.get(`http://localhost:4000/account/balance/${selectedAddress}`);
          if (response.status === 200) {
            setBalance(response.data.result);
          }
        }
      } catch (error) {
        console.error('Error fetching balance from the backend', error);
        setBalance(null);
      }
    };

    fetchBalance();
  }, [selectedAddress]);

  return (
    <div className='wallet-wrapper'>
      <h1>My Wallet</h1>
      <div className='wallet-info-wrapper'>
        <div className='address'><b>Address : </b>
          <select className='dropdown' value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)} disabled={loading || addresses.length === 0}>
            {loading ? (
              <option value=''>Loading...</option>
            ) : addresses.length === 0 ? (
              <option value=''>No Addresses available</option>
            ) : (
              addresses.map((addr, i) => (
                <option value={addr} key={i}>{addr}</option>
              ))
            )}
          </select>
        </div>
        <div className='amount'><b>Amount : </b>{loading ? (
          'Loading...'
        ) : balance !== null ? (
          `${balance} ETH`
        ) : (
          'Failed loading balance'
        )}</div>
      </div>
    </div>
  )
}

export default Wallet