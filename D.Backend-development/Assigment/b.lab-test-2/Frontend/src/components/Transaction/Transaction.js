import React from 'react'
import './Transaction.css'

const Transaction = (props) => {
  const {receiptHash, status, createdAt, source, destination, amount, gasUsed} = props.txn;
  return (
    <div className='txn-wrapper'>
        <div className='sub-element'><b>Transaction Hash : </b>{receiptHash}</div>
        <div className='sub-element'><b>Status : </b>{status ? "Success" : "Failed"}</div>
        <div className='sub-element'><b>Timestamp : </b>{createdAt}</div>
        <div className='sub-element'><b>From : </b>{source}</div>
        <div className='sub-element'><b>To : </b>{destination}</div>
        <div className='sub-element'><b>Value : </b>{amount}<b> ETH</b></div>
        <div className='sub-element'><b>Gas Used : </b>{gasUsed}</div>
    </div>
  )
}

export default Transaction