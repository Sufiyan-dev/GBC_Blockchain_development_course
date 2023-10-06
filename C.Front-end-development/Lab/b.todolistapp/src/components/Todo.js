import React from 'react'
import { useState } from 'react';

const Todo = () => {
    const [value, setValue] = useState("");
    const [todos, setTodos] = useState([]);
    // let todos = [];

    const onChange = (e) => {
        console.log("change", e.target.value);
        setValue(e.target.value)
    }

    const onSubmit = (e) => {
        console.log("submit",e.target.value);
        e.preventDefault();
        addTask(value);
        setValue("")
    }


    const addTask = (task) => {
        todos.push(task)
    }


  return (
    <div>
        <h1 style={{textAlign: 'center', color: 'darkblue'}}>My Todo List</h1>
        <div style={{textAlign: 'center'}}>
            <form>
            <input
             type='text'
             value={value}
             placeholder='Add a new task'
             style={{padding: '5px'}} 
             onChange={onChange}
             onSubmit={onSubmit}
            />
            <button
            type='submit'
                style={{
                    backgroundColor: 'darkblue',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    marginLeft: '5px'
                }}
                onClick={onSubmit}
            >
                Add
            </button>
            </form>
        </div>
        <ul style={{ listStyleType: 'circle', paddingLeft: '20px'}}>
            {todos.length > 0 ? todos.map((todo, i) => { return <li style={{textAlign: 'center'}} >{(++i)+". "+todo}</li>}) : "no todos"}
        </ul>
    </div>
  )
}

export default Todo