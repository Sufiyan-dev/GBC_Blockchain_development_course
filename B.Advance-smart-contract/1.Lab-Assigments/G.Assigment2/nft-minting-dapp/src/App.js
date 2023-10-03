import './App.css';
import Footer from './components/footer';
import Main from './components/main';
import Navbar from './components/navbar';
import { useState, useEffect } from 'react';

function App() {

  const [userInfo, setUserInfo] = useState({
    address: "",
    EthBalance: "",
    nftsOwned: [],
    hashFetchNft: false
  });

  useEffect(() => {
    if(window.ethereum) {
      // window.ethereum.on('chainChanged', () => {
      //   window.location.reload();
      // })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
    }
  })

  return (
    <div className="App">
      <Navbar Address={userInfo} updateAddress={setUserInfo} />
      <Main userInfo={userInfo} updateUserInfo={setUserInfo} />
      <Footer/>
    </div>
  );
}

export default App;
