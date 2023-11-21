import React from 'react'
import './Receipt.css'

const Receipt = (props) => {
  const {receiptHash, blockHash, blockNumber, from, to, gasUsed} = props.txnObj
  return (
    <div className='receipt-main'>
        <h1>Receipt</h1>
        <div><b>Transaction Hash : </b>{receiptHash}</div>
        <div><b>Block Hash : </b>{blockHash}</div>
        <div><b>Block Number : </b>{blockNumber}</div>
        <div><b>From : </b>{from}</div>
        <div><b>To : </b>{to}</div>
        <div><b>Gas Used : </b>{gasUsed}</div>  
    </div>
  )
}

export default Receipt