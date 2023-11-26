import { useEffect, useState } from 'react';
import './App.css';
import Footer from './components/Footer';
import Main from './components/Main';
import Navbar from './components/Navbar';

function App() {
  const [userInfo, setUserInfo] = useState({
    address: "",
    EthBalance: ""
  });

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
    }
  })


  return (
    <div className="App">
      <Navbar Address={userInfo.address} updateAddress={setUserInfo} />
      <Main Address={userInfo.address}/>
      <Footer/>
    </div>
  );
}

export default App;
