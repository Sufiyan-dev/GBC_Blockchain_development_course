import React from 'react'
import './Transactions.css'
import Transaction from '../Transaction/Transaction'

const Transactions = () => {
  const mockTransactions = [
    {
      source: "0x9921b1AE0c2bd557A5352EDddbBf9723f1e56Fdf",
      destination: "0xa5d661d968F947D7573C84d36124876fE4212F47",
      amount: "2400",
      status: "SUCCESS",
      gasUsed: "39000",
      receiptHash : "0x0bbb4053e99b79ed3867675144af180eaa46315aaaa00370b09a8819f73b3c3e",
      createdAt : "2023-10-10T06:10:03.432Z"
    },
    {
      source: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      destination: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      amount: "500",
      status: "SUCCESS",
      gasUsed: "33000",
      receiptHash : "0x8f5fb5a40e60445a44036e5cd7344e8bfc93167d1e5c1e48e0d8ee177ff31453",
      createdAt : "2023-08-20T04:05:33.124Z"
    },
  ]
  return (
    <div>
      <h1>Transaction History</h1>
      <div className='txns-wrapper'>
        {mockTransactions.map((txn,i) => (
          <Transaction key={i} txn={txn}/>
        ))}
      </div>
    </div>
  )
}

export default Transactions;