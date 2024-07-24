require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

// create the connection to the app
const app = express()

// allow web to access data with cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/', require('./index'));

// create the connection to the port
const PORT = process.env.PORT || 3000;

app_server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
}); 


// create the connection to mongodb
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING
);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});


function closeServer() {
    app_server.close()
}


module.exports = {closeServer}
