import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const handleAddAccount = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
        setPrivateKey(''); // Clearing the privateKey state for safety
    };
  return (
    <div className="home-container">
            <header>
                <h1>My Blockchain Wallet</h1>
                <p>Managing your blockchain assets, made simple.</p>
            </header>

            {showModal && (
                <div className="modal">
                <h2>Enter Private Key</h2>
                <input
                    type="text" 
                    id='privatekey-input'
                    placeholder="Enter Private Key"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                />
                <button className="btn" onClick={handleCloseModal}>Submit</button>
                <button className="btn" onClick={handleCloseModal}>Close</button>
                </div>
            )}
            
            <main>
                <section className="overview">
                    <h2>Welcome</h2>
                    <p>Welcome to My Blockchain Wallet, the easiest way to manage and track your blockchain assets.</p>
                    
                    <div className="stats">
                        <div className="stat">
                            <h3>Total Addresses</h3>
                            <p>5</p> {/* This is just a placeholder value */}
                        </div>
                        <div className="stat">
                            <h3>Recent Transactions</h3>
                            <ul>
                                <li>Transaction 1</li>
                                <li>Transaction 2</li>
                                <li>Transaction 3</li>
                            </ul>
                        </div>
                        <div className="stat">
                            <h3>Total Wallet Balance</h3>
                            <p>10 ETH</p> {/* This is just a placeholder value */}
                        </div>
                    </div>
                </section>

                <section className="actions">
                    <h2>Quick Actions</h2>
                    <Link to="/addresses">
                        <button className="btn">Make a Transaction</button>
                    </Link>
                    <button className="btn" onClick={handleAddAccount}>
                        Add New Account
                    </button>
                </section>

                <section className="tutorial">
                    <h2>Getting Started</h2>
                    <ol>
                        <li>How to add a new address.</li>
                        <li>How to view transactions.</li>
                        <li>Understanding the wallet interface.</li>
                    </ol>
                </section>
            </main>

            <footer>
                <p>About: This project is designed for college to demonstrate understanding in blockchain and React.</p>
                <p>Contact: sufiyanworkspace@gmail.com</p>
            </footer>
        </div>
  )
}

export default Home