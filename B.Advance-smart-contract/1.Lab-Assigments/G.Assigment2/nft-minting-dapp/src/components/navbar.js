import React from 'react'
import './navbar.css';
import getBalance from '../utils/getBalance';
import config from '../config.json'

const Navbar = ({Address, updateAddress}) => {

    const env = config['current-env'];

    const btnHandler = () => {

        if(window.ethereum){

            window.ethereum.request({ method: 'eth_chainId' }).then((chainId) => {
                console.log("chainid ",chainId, Number(chainId))
                if(Number(chainId) !== config.env[env].chainId){ // 80001
                    console.log("invalid chain id")
                    
                    window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: config.env[env].chainIdHex }]  // 0x13881
                    }).then(() => {
                        console.log("Switch to mumbai : ");

                        window.ethereum
                        .request({method: "eth_requestAccounts"})
                        .then((res) => accountChangeHandler(res[0]));


                    }).catch((err) => {
                        console.log("error ",err);
                        if(err.code === 4902){
                            console.log("adding chain id");
                             window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                              chainName: 'Polygon Mainnet',
                              chainId: '0x89',
                              nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                              rpcUrls: ['https://polygon-rpc.com/']
                            }]
                          })
                        } else {
                            window.alert("Unable to add chain");
                        }
                    })
                    
                } else {
                    window.ethereum
                    .request({method: "eth_requestAccounts"})
                    .then((res) => accountChangeHandler(res[0]));
                }

                
            })


        }else {
            alert("install metamask!!");
        }
    }

    const btnDisconnect = () => {
        updateAddress(prevState => ({
            ...prevState,
            address: "",
            EthBalance: 0
        }));
    }

      // Function for getting handling all events
  const accountChangeHandler = (account) => {
    // Setting an address data
    updateAddress({
        address: account,
        EthBalance: "",
        nftsOwned: [],
        hashFetchNft: false
    });

    getBalanceOfUser(account);
  };

  const getBalanceOfUser = async (account) => {
    const result = await getBalance(account);
    console.log("result ",result)

    if(result){
        // console.log("if")
        updateAddress(prevState => ({
            ...prevState,
            EthBalance: result
        }))

        console.log("info",Address);
    }
  }


  return (
    <div className="header-main">
            <div className='main-left'>
                <h3>NFT DAPP</h3>
            </div>
            <div className='main-right'>
                <div>Balance : {Address.EthBalance ? (Address.EthBalance / 10**18).toFixed(2) + " ETH"  : 0}</div>
                <button className='btn-connect' onClick={Address.address === "" ? btnHandler : btnDisconnect }>{Address.address === "" ? "Connect" : Address.address.substring(0,6)+"...."+Address.address.substring(Address.address.length-6)}</button>
            </div>
    </div>
  )
}

export default Navbar