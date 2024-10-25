import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import authRoutes from './routes/auth.js';



const port = 8080;
const app = express();
const mongoURI = 'mongodb://localhost:27017/users';

app.use(express.json())


// Use routes
app.use('/', authRoutes);

await mongoose.connect('mongodb://localhost:27017/users');

app.listen(port, ()=>{
    console.log(`server is starting at port ${port}`);
});
