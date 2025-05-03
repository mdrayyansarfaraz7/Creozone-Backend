import express from 'express';
import { login, logout, signup, verifyUser} from '../controllers/authControllers.js';


const router=express.Router();

router.get('/verify', verifyUser);

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);



export default router;