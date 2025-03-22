import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authrouter from './routes/authRoutes.js';

dotenv.config();

connectDB();

const app=express();
app.use(express.json());

app.use(cookieParser());

app.use('/api/auth',authrouter);

app.listen(8080,()=>{
    console.log('Listining to port 8080.')
})