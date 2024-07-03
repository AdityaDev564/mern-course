import express from 'express';
import { getAllUsers, createNewUser, updateUser, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/addUser', createNewUser);
router.patch('/updateUser', updateUser);
router.delete('/deleteUser', deleteUser);

export default router;