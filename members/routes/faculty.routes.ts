import {Router} from 'express';
import { firebaseAuth } from '../middleware/fireauth.middleware.ts';
import { requireRole } from '../middleware/role.middleware.ts';

const router=Router();


import {
listFaculty,
  getFaculty,
  registerFaculty,
  updateFaculty,
  removeFaculty,
    
} from "../controller/faculty.controller.ts";





router.get('/',
    requireRole(['admin','seller','customer']),
    listFaculty);
    
router.post('/',
    firebaseAuth,
    requireRole(['admin']),
    registerFaculty);

router.get('/:id',
    firebaseAuth, 
    requireRole(['student','admin', 'faculty']), 
    getFaculty);

router.put('/profile/:id',
    firebaseAuth, 
    requireRole(['admin','faculty']), 
    updateFaculty);

router.delete('/:id',
    requireRole(['admin', 'faculty']), 
    removeFaculty);


export default router;