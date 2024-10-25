import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

// Now you can access your secrets
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

app.use(express.json())


// Use routes
app.use('/', authRoutes);

await mongoose.connect(mongoURI);

app.listen(port, ()=>{
    console.log(`server is starting at port ${port}`);
});
