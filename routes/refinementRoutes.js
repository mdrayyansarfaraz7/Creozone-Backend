import express from 'express';

import authenticateUser from '../middlewares/authUser.js';
import { acceptRefinement } from '../controllers/RefinementControllers.js';

const router=express.Router();

router.post('/accept/:id',authenticateUser,acceptRefinement);

export default router;