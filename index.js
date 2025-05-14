import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authrouter from './routes/authRoutes.js';
import userrouter from './routes/userRoutes.js';
import stashrouter from './routes/stashRouts.js';
import creationrouter from './routes/creationsRouth.js'
import cors from 'cors';
import user from './models/user.js';
import creation from './models/creation.js';
import stash from './models/stash.js';

dotenv.config();

connectDB();

const app=express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true               
  }));

app.use(express.json());

app.use(cookieParser());

app.use('/api/auth',authrouter);
app.use('/api/user',userrouter);
app.use('/api/stash',stashrouter);
app.use('/api/creation',creationrouter);



app.listen(8080,()=>{
    console.log('Listining to port 8080.')
})