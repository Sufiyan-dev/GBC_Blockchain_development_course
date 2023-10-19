import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';


function App() {

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <Routes>
          <Route path='/' exact element={<Home/>}/>
          <Route path='/about' exact element={<About/>}/>
          <Route path='/contact' exact element={<Contact/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
