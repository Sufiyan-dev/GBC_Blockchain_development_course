const express = require('express');
const cors = require('cors');

// Routes
const addressesRoute = require('./src/api/routes/addresses.route');
const transactionRoute = require("./src/api/routes/transaction.route");
const invalidRoute = require('./src/api/routes/invalid.route');

const app = express();

app.get('/', (req,res) => {
    res.send("Hello!");
})

app.use(cors());
app.use(express.json())

app.use(addressesRoute);
app.use(transactionRoute)
app.use(invalidRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})