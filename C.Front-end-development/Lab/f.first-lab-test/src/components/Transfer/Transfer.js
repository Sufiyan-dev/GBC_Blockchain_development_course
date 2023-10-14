import React, { useState } from 'react'
import Receipt from '../Receipt/Receipt'
import './Transfer.css'

const Transfer = () => {
    const [hasSubmit, setHasSubmit] = useState(false);
    const [amount, setAmount] = useState(0);

    const handleChange = (e) => {
        setAmount(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setAmount(0);
        setHasSubmit(true);
    }

    const handleClear = () => {
        setAmount(0);
        setHasSubmit(false)
    }

    const addresses = {
        sourceAccount: "0x9921b1AE0c2bd557A5352EDddbBf9723f1e56Fdf",
        destinationAccount: "0xa5d661d968F947D7573C84d36124876fE4212F47"
    }

    const receiptData = {
        txnHash: "0x22fa3754018cff8dbddd6d5a7c7baaaf31b25d0a9d9d97c8fff6b591f522a7ae",
        blockHash: "0xb3aee9c2f48be1956b1c2c65f481b5e224a8ad7eaffb0f3d6b13e6f1e255ad3b",
        blockNumber: 15,
        from: "0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5",
        to: "0x064eb879D95eb6785dE34E2758949609B1D870cb",
        gasUsed: "20000"
    }

  return (
    <div className='transfer-main'> 
        <h1>Transfer</h1>
            <div className='form-wrapper'>
                <form className='form-main' onSubmit={handleSubmit}>
                    <div className='from-wrapper'><b>From : </b>{addresses.sourceAccount}</div>
                    <div className='to-wrapper'><b>To : </b>{addresses.destinationAccount}</div>
                    <div className='input-wrapper'><b>Amount : </b><input className='input-amount' value={amount} onChange={handleChange} type='number' /></div>  
                    <button className='submit-btn' type='submit'>Submit</button>
                </form>
            </div>
        {
            hasSubmit ? <Receipt txnObj={receiptData} /> : <div className='space-wrapper'></div>
        }
        <div className='clear-wrapper'>
            {
                hasSubmit ? <button className='btn-clear' onClick={handleClear}>Clear</button> : ""
            }
        </div>
    </div>
  )
}

export default Transfer