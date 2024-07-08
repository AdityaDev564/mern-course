import express from 'express';
import { getAllNotes, createNewNote, updateNote, deleteNote } from '../controllers/note.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router.use(verifyJWT);

router.get('/', getAllNotes);
router.post('/addNote', createNewNote);
router.patch('/updateNote', updateNote);
router.delete('/deleteNote', deleteNote);

export default router;