import express from 'express';
import { follow, getUser, unfollow, updateUser } from '../controllers/userControllers.js';
import authenticateUser from '../middlewares/authUser.js';
import upload from '../utils/upload.js'


const router=express.Router();

router.put('/:id',authenticateUser,upload.single('image'),updateUser);
router.get('/:username',getUser);
router.post('/follow/:username',authenticateUser,follow);
router.post('/unfollow/:username',authenticateUser,unfollow);
export default router;