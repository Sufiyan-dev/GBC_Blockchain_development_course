import { useEffect, useState } from 'react';
import './App.css';
import { getTokenPrice, getTokens } from "./Utils/contractHelper";

function App() {
  const [tokens, setTokens] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);

  const uncheckOthers = (i) => {
    // console.log("checkbox ",i)
    setSelected(i);
  }

  const formSubmit = async (e) => {
    e.preventDefault();
    // console.log("submit",selected)
    // perform price fetch here
    const tokenAdd = tokens[selected].token;
    const symbol = tokens[selected].symbol;
    setTokenSymbol(symbol);
    // console.log("token add ",tokenAdd);
    const result = await getTokenPrice(tokenAdd);
    // console.log("result ",result)
    setTokenPrice(result)
  }

  useEffect(() =>{
    const getData = async () => {
      const data = await getTokens();
      if(data){
        // console.log("data ",data)
        setTokens(data);
      } else {
        console.log("unable to get token data");
      }
    }
    getData()
  },[])
  return (
    <div className="App">
      <div className='title'>
        <h1>Chainlink Pair Conversion</h1>
      </div>
      <div className='main'>
        <form className='form-main' onSubmit={formSubmit}>
          {tokens.length > 0 ? tokens.map((token,i) => (
            <label className='token-info' key={i}><input type='checkbox' name='token' checked={selected === i ? true : false} onClick={() => uncheckOthers(i)}/>{token.symbol+" / USD"}</label>
          )) : <label>No tokens</label>}
          <button type="submit">submit</button>
        </form>
      </div>
      <div className='price-wrapper'>
        {tokenPrice ? <div>
          <h2>Price of {tokenSymbol} is : </h2>{tokenPrice} $
        </div> : <div>Select token to get the price</div>}
      </div>
    </div>
  );
}

export default App;
