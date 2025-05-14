import express from 'express'
import { findCreation } from '../controllers/creationController.js';

const router=express.Router();

router.get('/:id',findCreation);

export default router;