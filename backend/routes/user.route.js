import express from 'express';
import { getAllUsers, createNewUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router.use(verifyJWT);

router.get('/', getAllUsers);
router.post('/addUser', createNewUser);
router.patch('/updateUser', updateUser);
router.delete('/deleteUser', deleteUser);

export default router;