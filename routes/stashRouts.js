import express from 'express';
import upload from '../utils/upload.js';
import authenticateUser from '../middlewares/authUser.js';
import { allStashes, createStash, findStash } from '../controllers/stashControllers.js';

const router=express.Router();

router.post('/create-stash/:id',authenticateUser,upload.fields([{name:'thumbnail',maxCount:1}]),createStash);

router.get('/:id',findStash);

router.get('/all-stashes/:username',allStashes);

export default router;