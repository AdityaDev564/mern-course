import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import User from '../models/User.model.js'
import Note from '../models/Note.model.js';

// @desc Get all users
// @route GET /users
// @acess Private
const getAllUsers = asyncHandler( async(req, res) => {
    const users = await User.find().select('-password').lean();
    if(!users?.length){
        return res.status(400).json({message: "No users found"});
    }
    return res.json(users);
});

// @desc Create new user
// @route POST /users/addUser
// @acess Private
const createNewUser = asyncHandler( async(req, res) => {
    const { username, password, roles } = req.body;

    // Confirm data
    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message: "All fields are necessary"});
    }

    // Check for duplicates
    const duplicate = await User.findOne({username}).lean().exec();

    if(duplicate){
        return res.status(409).json({message: "Duplicate username"});
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    const userObject = { username, password: hashedPwd, roles };

    // Create and store new user
    const user = await User.create(userObject);

    if(user){
        return res.status(201).json({message: `New user ${username} created`});
    }
    else{
        return res.status(400).json({message: "Invalid user data received"});
    }
});

// @desc Update a user
// @route PATCh /users/updateUser
// @acess Private
const updateUser = asyncHandler( async(req, res) => {
    const { id, username, roles, active, password } = req.body;

    // Confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({message: "All fields are necessary"});
    }

    const user = await User.findById(id).exec();

    if(!user){
        return res.status(400).json({message: "User not found"});
    }

    // Check for duplicates
    const duplicate = await User.findOne({username}).lean().exec();
    // If the user is not the same as the one being updated
    // and the username is already present in the database
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: "Duplicate username"});
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if(password){
        // Hash password
        user.password = await bcrypt.hash(password, 10); // salt rounds
    }

    const updatedUser = await user.save();

    if(updatedUser){
        return res.status(200).json({message: `User ${username} updated`});
    }
    else{
        return res.status(400).json({message: "Invalid user data received"});
    }
});

// @desc Delete a user
// @route DELETE /users/deleteUser
// @acess Private
const deleteUser = asyncHandler( async(req, res) => {
    const { id } = req.body;

    if(!id){
        return res.status(400).json({message: "User ID required"});
    }

    const note = await Note.findOne({user: id}).lean().exec();
    if(note?.length){
        return res.status(400).json({message: "User has assigned notes. Cannot delete"});
    }

    const user = await User.findById(id).exec();

    if(!user){
        return res.status(400).json({message: "User not found"});
    }

    const deletedUser = await user.deleteOne();

    const reply = `Username: ${deletedUser.username} with ID: ${deletedUser._id} deleted`;

    res.json(reply);
});

export { getAllUsers, createNewUser, updateUser, deleteUser };