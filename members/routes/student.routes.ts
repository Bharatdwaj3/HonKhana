import { firebaseAuth } from '../middleware/fireauth.middleware.ts';
import { requireRole } from '../middleware/role.middleware.ts';
import {Router} from 'express';
const router=Router();

import {
  listStudent,
  getStudent,
  registerStudent,
  updateStudent,
  removeStudent,
} from '../controller/student.controller.ts';



router.get('/',
    requireRole(['admin','faculty','student']),
    listStudent);

router.get('/profile/:id',
    firebaseAuth, 
    requireRole(['faculty','student','admin']), 
    getStudent);

router.post('/',
    firebaseAuth,
    requireRole(['faculty','admin']),
    registerStudent);

router.put('/profile/:id',
    firebaseAuth, 
    requireRole(['admin']), 
    updateStudent);

router.delete('/profile/:id',
    firebaseAuth, 
    requireRole(['admin']), 
    removeStudent);

export default router;