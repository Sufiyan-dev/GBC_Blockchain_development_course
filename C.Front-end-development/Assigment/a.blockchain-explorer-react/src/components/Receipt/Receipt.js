import React from 'react'
import './Receipt.css'

const Receipt = (props) => {
  return (
    <div className='receipt-main'>
        <h1>Receipt</h1>
        <div><b>Transaction Hash : </b>{props.txnObj.txnHash}</div>
        <div><b>Block Hash : </b>{props.txnObj.blockHash}</div>
        <div><b>Block Number : </b>{props.txnObj.blockNumber}</div>
        <div><b>From : </b>{props.txnObj.from}</div>
        <div><b>To : </b>{props.txnObj.to}</div>
        <div><b>Gas Used : </b>{props.txnObj.gasUsed}</div>  
    </div>
  )
}

export default Receipt