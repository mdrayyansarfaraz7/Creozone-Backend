import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authrouter from './routes/authRoutes.js';
import userrouter from './routes/userRoutes.js';
import stashrouter from './routes/stashRouts.js';
import creationrouter from './routes/creationsRouth.js';
import outlookrouter from './routes/outlooksRoutes.js';
import refinementrouter from './routes/refinementRoutes.js';
import cors from 'cors';
import user from './models/user.js';
import creation from './models/creation.js';
import stash from './models/stash.js';
import outlook from './models/outlook.js';
import refinement from './models/refinement.js';



dotenv.config();

connectDB();

const app=express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true               
  }));

app.use(express.json());

app.use(cookieParser());
app.delete('/delete-all',async(req,res)=>{
  try {
    await user.deleteMany({});
    await creation.deleteMany({});
    await stash.deleteMany({});
    await outlook.deleteMany({});
    await refinement.deleteMany({});
    res.send({message:"Cleared"});
  } catch (error) {
    console.log(error);
  }
})
app.use('/api/auth',authrouter);
app.use('/api/user',userrouter);
app.use('/api/stash',stashrouter);
app.use('/api/creation',creationrouter);
app.use('/api/outlook',outlookrouter);
app.use('/api/refinement',refinementrouter);



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));