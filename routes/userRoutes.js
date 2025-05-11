import express from 'express';
import { getUser, updateUser } from '../controllers/userControllers.js';
import authenticateUser from '../middlewares/authUser.js';


const router=express.Router();

router.put('/:id',authenticateUser,updateUser);
router.get('/:username',getUser);

export default router;