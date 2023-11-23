import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Receipt from '../Receipt/Receipt';
import './Transfer.css'


const Transfer = (props) => {
    const [hasSubmit, setHasSubmit] = useState(false);
    const [amount, setAmount] = useState(0);
    const [receipt, setReceipt] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const response = (await axios.post('http://localhost:4000/transaction/send', {
                from: defaultAddress,
                to: address,
                amount: amount
            }));
            if(response.status === 200) {
                setReceipt(response.data.result);
            }
    
          } catch (error) {
            console.error('Error fetching data from the backend', error);
            setReceipt(false)
          } finally {
            setLoading(false);
            setAmount(0);
          }
        };
    
        if(hasSubmit === true) {
            fetchData()
        }
      }, [hasSubmit]);

    const navigate = useNavigate();
    
    const { address } = useParams();

    const location = useLocation();
    const { defaultAddress } = location.state;

    const handleChangeAmount = (e) => {
        setAmount(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(amount > 0) {
            setHasSubmit(true);
        } else {
            alert("Invalid amount provided")
        }
       
    }

    const handleClear = (e) => {
        e.preventDefault()
        setAmount(0);
        setHasSubmit(false)
    }

    const goBack = () => {
        navigate(-1)
    };

  return (
    <div className='transfer-main'> 
        <div className='header-wrapper'>
            <button onClick={goBack}>Back</button>
            <h1>Transfer</h1>
        </div>
            <div className='form-wrapper'>
                <form className='form-main'onSubmit={hasSubmit ? handleClear : handleSubmit}>
                    <div className='from-wrapper'><b>From : </b>{defaultAddress}</div>
                    <div className='to-wrapper'><b>To : </b>{address}</div>
                    <div className='input-wrapper'><b>Amount : </b><input className='input-amount' id='input-amount' value={amount} onChange={handleChangeAmount} type='number' /></div>  
                    <button className='submit-btn' type='submit'>{hasSubmit ? 'Clear' : 'Submit'}</button>
                </form>
            </div>
        {
            hasSubmit ? loading ? <div className='space-wrapper'>Loading....</div> : receipt ? <Receipt txnObj={receipt} /> : <div className='space-wrapper'>Failed to send txn!</div> : <div className='space-wrapper'></div>
        }
    </div>
    
  )
}

export default Transfer