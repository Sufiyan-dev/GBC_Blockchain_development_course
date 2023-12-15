import { useEffect, useState } from 'react';
import './App.css';
import contractAbi from './contract/abi.json';
import { ethers } from 'ethers';
import axios from 'axios'

// change the contract address after each deployment
const contractAddress = '0xD2A9E6427474c4e5e041941bD9C879bfB133fE70';
// console.log(JSON.stringify(contract.abi));

function App() {
    const [message, setMessage] = useState('');
    const [currentAccount, setCurrentAccount] = useState(null);
    const [nfts, setNfts] = useState([]);

    const getNftData = async (uri) => {
        const info = await axios.get(uri);
        console.log("nft data ", info.data);
        return info.data
    }

    useEffect(() => {
        const fetchNfts = async () => {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.BrowserProvider(ethereum);
                const signer = await provider.getSigner();
                console.log("signer ", signer)
                const nftContract = new ethers.Contract(contractAddress, contractAbi, signer);

                const tokenId = await nftContract.nextTokenId();
                console.log("token id", tokenId)

                let nftData = [];

                for (let i = 0; i < tokenId; i++) {
                    const nftUri = await nftContract.tokenURI(i);
                    console.log("uri ", i, nftUri, "https://gateway.pinata.cloud/")

                    let url = `https://gateway.pinata.cloud/${nftUri}`;

                    const json = await getNftData(url);
                    console.log("data ", json)
                    let obj = {
                        name: json.name,
                        tokenId: i,
                        image: json.image
                    }
                    nftData.push(obj);
                }

                setNfts(nftData)
            } else {
                setMessage('❌ Ethereum object does not exist');
            }
        }
        fetchNfts();
    }, [message]);



    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log('🦊 Install the Metamask browser extension.');
            return;
        } else {
            setMessage('✅ Wallet exists.');
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        // console.log(accounts);

        if (accounts.length !== 0) {
            const account = accounts[0];
            setMessage('1️⃣ Using first account in wallet as default.');
            setCurrentAccount(account);
        } else {
            setMessage('❗ No authorized account found.');
        }
    };

    const connectWalletHandler = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            setMessage('🦊 Install the Metamask browser extension.');
        }

        try {
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            setMessage('1️⃣ Using first account in wallet: ', accounts[0]);
            setCurrentAccount(accounts[0]);
            // setWalletAddress(accounts[0]);
        } catch (err) {
            console.log(err);
        }
    };

    const mintNftHandler = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.BrowserProvider(ethereum);
                const signer = await provider.getSigner();
                console.log("signer ", signer)
                const nftContract = new ethers.Contract(contractAddress, contractAbi, signer);

                setMessage('💰 ➡ Authorize payment to mint NFT.');
                let nftTxn = await nftContract.safeBatchMint(signer.address, 1, {
                    value: ethers.parseEther('0.001'),
                });

                setMessage('🔄 Validating...');
                await nftTxn.wait();

                setMessage(
                    `🔎 Etherscan: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
                );
            } else {
                setMessage('❌ Ethereum object does not exist');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const connectWalletButton = () => {
        return (
            <div>
                <button
                    onClick={connectWalletHandler}
                    className='cta-button connect-wallet-button'>
                    Connect Wallet
                </button>
            </div>
        );
    };

    const mintNftButton = () => {
        return (
            <div>
                <h3 className='text-style'>🦊 Account Address: {currentAccount}</h3>
                <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
                    Mint NFT
                </button>
            </div>
        );
    };

    useEffect(() => {
        checkWalletIsConnected();
    }, []);
    return (
        <div className='card'>
            <div className='header'>
                <h3 className='text-color'>Sepolia Testnet 🔹 NFT Minter</h3>
            </div>
            <hr></hr>
            <div className='container'>
                {currentAccount ? mintNftButton() : connectWalletButton()}
            </div>
            <div>
                <hr></hr>
                <h4>{message}</h4>
            </div>
            <h3 className='nft-title'>Your NFTs</h3>
            <div className='nft-collection'>
                {nfts.length > 0 ? nfts.map((nft) => (
                    <div className='nft-cover'>
                        <div className='tokeinfo-wrapper'>
                        <div className='tokeid-wrapper'>{nft.tokenId}</div>
                        <div className='name-wrapper'>{nft.name}</div>
                        </div>
                        <img src={nft.image} className='image-wrapper' />
                    </div>
                )) : <div>No NFTS</div>}
                        </div>
                    </div>
                );
}

                export default App;