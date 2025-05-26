import mongoose from 'mongoose';
const outlookSchema=mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    creation:{
        type:mongoose.Types.ObjectId,
        ref: 'Creation'
    },
    refinementRequest: 
    [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Refinement' 
        }
    ]
}, { timestamps: true });

export default mongoose.model('Outlooks', outlookSchema);