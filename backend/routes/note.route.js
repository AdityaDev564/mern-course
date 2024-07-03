import express from 'express';
import { getAllNotes, createNewNote, updateNote, deleteNote } from '../controllers/note.controller.js';

const router = express.Router();

router.get('/', getAllNotes);
router.post('/addNote', createNewNote);
router.patch('/updateNote', updateNote);
router.delete('/deleteNote', deleteNote);

export default router;