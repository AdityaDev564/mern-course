import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: "Employee"
    }],
    active: {
        type: Boolean,
        default: true
    }
})

const User = new mongoose.model("User", userSchema);
export default User;