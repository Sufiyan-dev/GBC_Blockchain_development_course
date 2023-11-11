import { BrowserRouter as Router, Routes, Route, Link, useMatch } from 'react-router-dom';
import Transactions from './components/Transactions/Transactions';
import Addresses from './components/Addresses/Addresses';
import Wallet from './components/Wallet/Wallet';
import Home from './components/Home/Home';
import Transfer from './components/Transfer/Transfer';
import './App.css'

function NavLink({to, children}) {
  let match = useMatch(to);
  return (
    <li>
      <Link to={to} className={match ? 'active-tab' : ''}>
        {children}
      </Link>
    </li>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <div className='nav-bar-wrapper'>
          <nav className='navbar-main'>
            <ul className='nav-bar'>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/transactions">Transactions</NavLink>
              <NavLink to="/addresses">Addresses</NavLink>
              <NavLink to="/wallet">Wallet</NavLink>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/transfer/:address" element={<Transfer/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
