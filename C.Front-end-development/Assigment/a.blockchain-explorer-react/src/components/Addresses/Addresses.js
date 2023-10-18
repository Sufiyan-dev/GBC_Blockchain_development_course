import React from 'react'
import { Link } from 'react-router-dom';
import './Addresses.css'

const Addresses = () => {
    const addresses = [
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0xa5d661d968F947D7573C84d36124876fE4212F47",
        "0x9921b1AE0c2bd557A5352EDddbBf9723f1e56Fdf"
    ]
  return (
    <div>
        <h1>Blockchain Node Addresses</h1>
        {addresses.map(address => (
                <div key={address} className='address-wrapper'>
                    <Link to={`/transfer/${address}`}>{address}</Link>
                </div>
        ))}
    </div>
  )
}

export default Addresses