import React from 'react'
import './Transaction.css'

const Transaction = (props) => {
  return (
    <div className='txn-wrapper'>
        <div className='sub-element'><b>Transaction Hash : </b>{props.txn.receiptHash}</div>
        <div className='sub-element'><b>Status : </b>{props.txn.status}</div>
        <div className='sub-element'><b>Timestamp : </b>{props.txn.createdAt}</div>
        <div className='sub-element'><b>From : </b>{props.txn.source}</div>
        <div className='sub-element'><b>To : </b>{props.txn.destination}</div>
        <div className='sub-element'><b>Value : </b>{props.txn.amount}<b> ETH</b></div>
        <div className='sub-element'><b>Gas Used : </b>{props.txn.gasUsed}</div>
    </div>
  )
}

export default Transaction