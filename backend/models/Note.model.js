import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';

const AutoIncrementPlugin = AutoIncrement(mongoose);

const noteSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

noteSchema.plugin(AutoIncrementPlugin, { 
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500 
});

const Note = new mongoose.model("Note", noteSchema);
export default Note;