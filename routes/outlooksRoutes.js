import express from 'express';
import upload from '../utils/upload.js';
import { createOutlook, findOutlooksForCreation } from '../controllers/outlookControllers.js';
import authenticateUser from '../middlewares/authUser.js';

const router=express.Router();

router.post('/create-outlook/:id',authenticateUser,upload.single('refinement'),createOutlook);
router.get('/:id',findOutlooksForCreation);

export default router;