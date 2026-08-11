import { Router } from 'express';
import { requireInternalSecret } from '../middleware/internal.middleware.ts';
import { getUserContact, getUserByEmail } from '../controller/internal.controller.ts';

const router = Router();

router.get('/user/:id', requireInternalSecret, getUserContact);
router.get('/user/by-email/:email', requireInternalSecret, getUserByEmail);

export default router;
