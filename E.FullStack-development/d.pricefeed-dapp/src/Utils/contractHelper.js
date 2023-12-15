import priceFetcherAbi from "./priceFetcherAbi.json";
import config from "../config";
import { ethers } from "ethers";

const erc20abi = [
    "function name() external view returns (string memory)",
    "function symbol() external view returns (string memory)"
];

const getContractInstance = async () => {
    try {
        const provder = new ethers.JsonRpcProvider(config.rpcurl);
        const contract = new ethers.Contract(config.contractAddress,priceFetcherAbi,provder);
        return contract;
    } catch(err){
        console.log("error in getting contract instance ",err.message);
        return false;
    }
}

const getTokenContractInstance = async (token) => {
    try {
        const provder = new ethers.JsonRpcProvider(config.rpcurl);
        const contract = new ethers.Contract(token,erc20abi,provder);
        return contract;
    } catch(err) {
        console.log("error in getting contract instance ",err.message);
        return false;
    }
}

const getTokens = async () => {
    try {

        let tokensData = [];

        const contract = await getContractInstance();

        if(!contract){
            throw new Error("Faliled to get contract instance");
        }

        const length = Number(await contract.getTokensArrayLength());
        console.log("lenght ",length)
        for(let i = 0; i <= length; i++){
            // console.log("i",i);
            let tokenInfoObj = {
                token: "",
                symbol: ""
            }

            const tokenAdd = await contract.getToken(i);
            // console.log("token add ",tokenAdd);

            tokenInfoObj.token = tokenAdd;
            const symbol = await getTokenSymbol(tokenAdd);
            tokenInfoObj.symbol = symbol;

            tokensData.push(tokenInfoObj)
        }

        // console.log(tokensData);
        return tokensData

    } catch(err){
        console.log("error while fetching token details ",err.message);
        return false;
    }
}

const getTokenSymbol = async (token) => {
    try {
        const contract = await getTokenContractInstance(token);
        const symbol = await contract.symbol();
        // console.log("Symbol ",symbol);
        return symbol;
    } catch(err) {
        console.log("error while fetching contract name ",err.message);
        return false;
    }
}

const getTokenPrice = async (token) => {
    try {
        const contract = await getContractInstance();
        const price = Number(await contract.getPriceOfTokenInUsd(token));
        console.log("token price ",price/1e8);
        return price/1e8
    } catch(err){
        console.log("error while fetching token price ",err.message);
        return false;
    }
}

export { getTokens, getTokenPrice };