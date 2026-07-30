import { Router } from 'express';
import { requireInternalSecret } from '../middleware/internal.middleware.ts';
import { getLoanCounts } from '../controller/internal.controller.ts';

const router = Router();

router.get('/loan-counts', requireInternalSecret, getLoanCounts);

export default router;
