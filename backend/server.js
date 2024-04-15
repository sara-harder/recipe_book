import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

// create the connection to the app
const app = express()

app.use('/', require('./index'));

// create the connection to the port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
}); 


// create the connection to mongodb
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});