import React from 'react'
import "./Navbar.css"
import BugImg from "../images/bug.svg"
import ethers from "ethers";

const Navbar = ({Address, updateAddress}) => {
    
    const chainId = {
        number: 11155111,
        hex: '0xaa36a7'
    };

    const btnHandler = async () => {

        if (window.ethereum) {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((res) => accountChangeHandler(res[0]));

                const chainIdOfUser = await window.ethereum.request({ method: 'eth_chainId' });

                if (chainIdOfUser !== chainId.hex) {
                    try {
                      await window.ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [
                          { chainId: chainId.hex },
                        ],
                      });
                    } catch (err) {
                      console.log("err of network switch", err.message, err.code);
                      // This error code indicates that the chain has not been added to MetaMask
                      if (err.code === 4902) {
                        alert("chain does not exist !");
                      }
                    }
                }    
        } else {
            alert("install metamask!!");
        }
    }

    const btnDisconnect = () => {
        updateAddress(prevState => ({
            ...prevState,
            address: ""
        }));
    }

    // Function for getting handling all events
    const accountChangeHandler = (account) => {
        // Setting an address data
        updateAddress({
            address: account
        });
    };

    return (
        <div className='top-wrapper'>
            <div className='nav-left'></div>
            <div className='nav-main'><img src={BugImg} className='Bug-image' alt='Bug' /><h1 className='header-name'>Bug Tracker</h1></div>
            <div className='nav-right'><button className='connect-btn' onClick={Address === "" ? btnHandler : btnDisconnect }>{Address === "" ? "Connect" : Address.substring(0,6)+"...."+Address.substring(Address.length-6)}</button></div>
        </div>
    )
}

export default Navbar