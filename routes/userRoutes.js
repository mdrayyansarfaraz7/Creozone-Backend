import express from 'express';
import { updateUser } from '../controllers/userControllers.js';
import authenticateUser from '../middlewares/authUser.js';


const router=express.Router();

router.put('/:id',authenticateUser,updateUser);

export default router;