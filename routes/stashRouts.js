import express from 'express';
import upload from '../utils/upload.js';
import authenticateUser from '../middlewares/authUser.js';
import { allStashes, createStash, everyStash, findStash, searchStashes } from '../controllers/stashControllers.js';

const router=express.Router();

router.post(
  '/create-stash/:id',
  authenticateUser,
  upload.fields([{ name: 'thumbnail', maxCount: 1 }]),
  createStash
);

router.get('/all-stashes/:username', allStashes);
router.get('/all/', everyStash);
router.get('/search', searchStashes);
router.get('/:id', findStash);


export default router;