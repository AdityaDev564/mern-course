import Note from '../models/Note.model.js';
import User from '../models/User.model.js';
import asyncHandler from 'express-async-handler';

// @desc Get all notes
// @route GET /notes
// @acess Private
const getAllNotes = asyncHandler(async (req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().lean()

    // If no notes 
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
});



// @desc Create new note
// @route POST /notes/addNote
// @acess Private
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    // Confirm data
    if(!user || !title || !text){
        return res.status(400).json({message: "All fields are necessary"});
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();

    if(duplicate){
        return res.status(409).json({message: "Duplicate note title"});
    }

    // Create and store new note
    const note = await Note.create({ user, title, text });

    if(note){ // Create
        return res.status(201).json({ message: `New note ${title} created` });    
    }
    else{ // Error
        return res.status(400).json({ message: "Invalid note data received" });
    }
});

// @desc Update a note
// @route PATCH /notes/updateNote
// @acess Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    // Confirm data
    if(!id || !user || !title || !text || typeof completed !== 'boolean'){
        return res.status(400).json({message: "All fields are necessary"});
    }

    // Confirm note exists to update
    const note = await Note.findById(id).exec();

    if(!note){
        return res.status(400).json({message: "Note not found"});
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({title}).exec();

    // Allow renaming of the original note
    if(duplicate && duplicate._id !== id){
        return res.status(409).json({message: "Duplicate note title"});
    }

    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    // Save the updated note
    const updatedNote = await note.save();

    return res.json(`Note ${title} updated`);
});

// @desc Delete a note
// @route DELETE /notes/deleteNote
// @acess Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if(!id){
        return res.status(400).json({ message: "Note ID required" });
    }

    // Confirm note exists to delete
    const note = await Note.findById(id).exec();

    if(!note){
        return res.status(400).json({ message: "Note not found" });
    }

    // Delete the note
    const deletedNote = await note.deleteOne();

    const reply = `Note: ${deletedNote.title} with ID ${deletedNote._id} deleted`;

    res.json(reply);
});

export { getAllNotes, createNewNote, updateNote, deleteNote };
