import express from 'express'
import { findCategoryCreation, findCreation,likeCreation, unlikeCreation } from '../controllers/creationController.js';
import authenticateUser from '../middlewares/authUser.js';

const router=express.Router();

router.get('/:id',findCreation);
router.get('/categorycreations/:category',findCategoryCreation);
router.post('/like/:id',authenticateUser,likeCreation);
router.post('/unlike/:id',authenticateUser,unlikeCreation);
export default router;