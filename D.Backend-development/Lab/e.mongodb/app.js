const express = require('express');
const UserModel = require('./user.model');

const app = express();

app.use(express.json());

app.get('/',(req,res) => {
    res.send('Hello from express!');
})

app.post('/user/create', async (req,res) => {
    const {name, email, age} = req.body;
    
    if(!name || !email || !age){
        return res.status(404).json({
            status: false,
            result: "Expected inputs in body"
        });
    }

    let userInfo = await UserModel.create({
        name,
        email,
        age
    });

    return res.status(201).json({
        status: true,
        result: userInfo
    });

})

app.get('/user/:name', async (req,res) => {
    const username = req.params.name;

    if(!username){
        return res.status(404).json({
            status: false,
            result: "Invalid params input"
        })
    }

    const userInfo = await UserModel.findOne({name: username});

    if(!userInfo){
        return res.status(404).json({
            status: false,
            result: "No such user with that username"
        })
    }

    return res.status(201).json({
        status: true,
        result: userInfo
    })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})