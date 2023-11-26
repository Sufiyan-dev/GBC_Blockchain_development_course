// Modal.js
import React from 'react';
import './Modal.css'

const Modal = ({ isOpen, onClose, onSubmit, checkExist }) => {
  const [newId, setNewId] = React.useState('');
  const [newDescription, setNewDescription] = React.useState('');

  const handleSubmit = () => {
    if(isNaN(Number(newId))){ // if it is not an number
        return alert("Invalid id")
    }
    if(checkExist(newId)){
        return alert("id already exist")
    }
    onSubmit(newId, newDescription);
    onClose();
    setNewId('');
    setNewDescription('')
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className='modal-content'>
        <span className='close' onClick={onClose}>&times;</span>
        <label>ID:</label>
        <input type='text' value={newId} onChange={(e) => setNewId(e.target.value)} />
        <label>Description:</label>
        <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Modal;
