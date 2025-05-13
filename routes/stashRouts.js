import express from 'express';
import upload from '../utils/upload.js';
import authenticateUser from '../middlewares/authUser.js';
import { createStash } from '../controllers/creationControllers.js';

const router=express.Router();

router.post('/create-stash/:id',authenticateUser,upload.fields([{name:'images'},{name:'thumbnail',maxCount:1}]),createStash);

export default router;