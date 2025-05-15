import express from 'express'
import { findCategoryCreation, findCreation } from '../controllers/creationController.js';

const router=express.Router();

router.get('/:id',findCreation);
router.get('/categorycreations/:category',findCategoryCreation);

export default router;