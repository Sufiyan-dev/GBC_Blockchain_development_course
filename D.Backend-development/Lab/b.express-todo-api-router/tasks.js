const express = require('express');
const router = express.Router();

const tasks = []; // array to store tasks

router.use((req,res,next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

router.get('/', (req,res) => {
    res.json(tasks);
})

router.post('/',(req,res) => {
    const { title, description } = req.body;
    console.log(title, description, req.body)
    const task = { title, description };
    tasks.push(task);
    res.status(200).send(task);
})

module.exports = router;