import React from 'react'
import './Wallet.css'

const Wallet = () => {
    const mockData = {
        address : "0xa5d661d968F947D7573C84d36124876fE4212F47",
        balance : "9999.9343"
    }
  return (
    <div className='wallet-wrapper'>
        <h1>My Wallet</h1>
        <div className='wallet-info-wrapper'>
            <div className='address'><b>Address : </b>{mockData.address}</div>
            <div className='amount'><b>Amount : </b>{mockData.balance} ETH</div>
        </div>
    </div>
  )
}

export default Wallet