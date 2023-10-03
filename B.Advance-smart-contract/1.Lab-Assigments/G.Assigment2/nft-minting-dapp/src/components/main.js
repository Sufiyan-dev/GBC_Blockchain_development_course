import React from 'react';
import './main.css';
import contractInstance from '../utils/getUsersNft';
import { useState, useEffect } from 'react';
import Nft from './nft';
import axios from 'axios';

const Main = ({userInfo, updateUserInfo}) => {

const [value, setValue] = useState("");
const [disable , setDisable] = useState(false);

let nftdata;
let textvalue = '';

const getNftData = async (uri) => {
    const info = await axios.get(uri);
    console.log("nft data ", info.data);
    return info.data
}

  const getUsersNft = async () => {
    try {

        // setLoading(true);

        const instance = await contractInstance();
        const instanceName = await instance.name();
        console.log(instanceName);

        if(userInfo.address !== ""){
            const noOfNfts = Number(await instance.balanceOf(userInfo.address));
            console.log("no of nfts ",noOfNfts);

            if(noOfNfts > 0){
                const lastTokenId = Number(await instance.getCounter());
                console.log("token id ",lastTokenId);

                let usersNftData = [];
                if(lastTokenId > 0){
                    for(let i = 0; i < lastTokenId; i++){
                        const ownerOFNft = String(await instance.ownerOf(i)).toLowerCase();
                        // console.log("owner of nft ", ownerOFNft)
                        console.log("currnet address ", userInfo.address, ownerOFNft === userInfo.address)

                        if(ownerOFNft === userInfo.address){
                            // console.log("founded token ",i)

                            const nftUri = await instance.tokenURI(i);
                            // console.log("token uri", nftUri);

                            const fetchNftMetaData = await getNftData(nftUri);

                            let nftData = {
                                tokenId: i,
                                uri: nftUri,
                                metadata: fetchNftMetaData
                            }

                            usersNftData.push(nftData);
                        }
                    }

                    // console.log("users nft data ", usersNftData)

                    updateUserInfo(prevState => ({
                        ...prevState,
                        nftsOwned: usersNftData,
                        hashFetchNft: true
                    }))
                }


            }
        }

        // setLoading(false);

    } catch (err) {
        console.log("get users nfts error",err);
    }
  }

  if(userInfo.address !== "" &&  userInfo.hashFetchNft === false){
    // setLoading(true)
    getUsersNft();

    console.log("nft data ",nftdata)

  }

  const onSubmit = async (event) => {
    // console.log("event submit ", event)
    console.log(event.target[0].value);
    event.preventDefault();
    setDisable(true)
    
    // signing message 
    const instance = await contractInstance();

    const txn = await instance.safeMint(userInfo.address, value);
    console.log("singed txn ",txn);

    // Wait for transaction receipt
    const receipt = await txn.wait();

    if (receipt && receipt.status === 1) {
        getUsersNft()
    } else {
        window.alert("minting failed")
    }   



    setDisable(false);
  }

  const onChange = (event) => {
    console.log(event.target.value)
    setValue(event.target.value);
    return;
  }

  return (
    <div className='mainarea-main'>
        <div className='main-nftarea-wrapper' >
            {userInfo.nftsOwned.length === 0 ? "No NFT yet" : userInfo.nftsOwned.map((nft, i) => {
                return <Nft key={i} uri={nft.metadata.image} tokenId={nft.tokenId} nftName={nft.metadata.name} nftDescription={nft.metadata.description} />
            })}
        </div>
        <div className='main-mintarea-wrapper'>
            <div className='mint-section'>
                <h2>Mint new NFT</h2>
                <form onSubmit={onSubmit} >
                    <input value={value} disabled={disable} placeholder='ipfs metadata url' type='url' onChange={onChange} />
                </form>
                
            </div>
        </div>
    </div>
  )
}

export default Main