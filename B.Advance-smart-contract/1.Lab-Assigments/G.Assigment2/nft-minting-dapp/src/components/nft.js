import React from 'react'
import axios from 'axios'
import './nft.css'

const Nft = ({key, uri, tokenId, nftName, nftDescription}) => {

    // console.log("data recevie ", key, uri, tokenId, nftName, nftDescription)

  return (
    <div key={tokenId} className='nft-main'>
        <img className='nft-img' src={uri}/>
        <div className='wrapper-title-tokenid'>
            <h5 className='nft-title'>{nftName}</h5>
            <span className='nft-tokenid'>{tokenId}</span>
        </div>
        <p className='nft-description'>{nftDescription}</p>
    </div>
  )
} 

export default Nft