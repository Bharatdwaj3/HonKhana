import { Router } from 'express';
import { requireInternalSecret } from '../middleware/internal.middleware.ts';
import { getUserContact } from '../controller/internal.controller.ts';

const router = Router();

router.get('/user/:id', requireInternalSecret, getUserContact);

export default router;
