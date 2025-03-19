import mongoose from 'mongoose';

const outlookCreation=mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    refinementRequest: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Refinements' 
        }
    ]
}, { timestamps: true });

export default mongoose.model('Outlooks', outlookSchema);