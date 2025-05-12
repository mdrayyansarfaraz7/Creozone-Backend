import express from 'express';
import { getUser, updateUser } from '../controllers/userControllers.js';
import authenticateUser from '../middlewares/authUser.js';
import upload from '../utils/upload.js'


const router=express.Router();

router.put('/:id',authenticateUser,upload.single('image'),updateUser);
router.get('/:username',getUser);

export default router;