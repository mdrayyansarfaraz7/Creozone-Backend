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

const allowedOrigins = [
  'http://localhost:5173',             // local dev
  'https://creozone.vercel.app'       // deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser requests like Postman
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.use(express.json());

app.use(cookieParser());

app.use('/api/auth',authrouter);
app.use('/api/user',userrouter);
app.use('/api/stash',stashrouter);
app.use('/api/creation',creationrouter);
app.use('/api/outlook',outlookrouter);
app.use('/api/refinement',refinementrouter);



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));