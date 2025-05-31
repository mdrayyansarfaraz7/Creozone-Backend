import express from 'express'
import { createCreation, findCategoryCreation, findCreation,likeCreation, unlikeCreation } from '../controllers/creationController.js';
import authenticateUser from '../middlewares/authUser.js';
import upload from '../utils/upload.js'
const router=express.Router();

router.get('/:id',findCreation);
router.post('/create/:id',authenticateUser,upload.single('creation'),createCreation);
router.get('/categorycreations/:category',findCategoryCreation);
router.post('/like/:id',authenticateUser,likeCreation);
router.post('/unlike/:id',authenticateUser,unlikeCreation);
export default router;