import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Transactions.css'
import Transaction from '../Transaction/Transaction'

const Transactions = () => {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/transaction/history');
        if(response.status === 200) {
          setTxns(response.data.result);
        } else {
           setTxns(false)
        }

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
      <h1>Transaction History</h1>
      <div className='txns-wrapper'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            { !txns? (
              <p>Failed to retrieve txns history</p>
            ) : txns.length > 0 ? (
              txns.map((txn, i) => (
                <Transaction key={i} txn={txn} />
              ))
            ) : (
              <p>No txns history!</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Transactions;