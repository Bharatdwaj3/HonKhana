import { Router } from 'express';
import { authUser } from '../middleware/auth.middleware.ts';
import checkPermission from '../middleware/permission.middleware.ts';
import { requireInternalSecret } from '../middleware/internal.middleware.ts';
import { listBooks, getBook, registerBook, updateBook, removeBook, adjustCopies } from '../controller/book.controller.ts';

const router = Router();

router.get('/', listBooks);
router.get('/:id', getBook);

router.post('/', authUser, checkPermission('addBook'), registerBook);
router.put('/:id', authUser, checkPermission('editBook'), updateBook);
router.delete('/:id', authUser, checkPermission('delBook'), removeBook);
router.patch('/:id/copies', requireInternalSecret, adjustCopies);

export default router;