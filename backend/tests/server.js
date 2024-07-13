const express = require('express');
const mongoose = require('mongoose');

async function openServer(port) {
    // create the connection to the app
    const app = express()

    app.use('/', require('../index'));

    app_server = app.listen(port, () => {
        console.log(`Server listening on port ${port}...`)
    })

    // create the connection to mongodb
    await mongoose.connect(
        "mongodb+srv://harders:admin@recipes.fvmleot.mongodb.net/"
    );

    const db = mongoose.connection;

    db.once("open", () => {
        console.log("Successfully connected to MongoDB using Mongoose!");
    });

    const closeServer = () => {
        mongoose.connection.close()
        app_server.close()
    }

    return closeServer
}

module.exports = {openServer}