import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    stash: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stash'
        }
    ],
    refinements: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Refinements'  
            },
            status: {
                type: String,
                enum: ['accepted', 'pending'],
                default: 'pending'  
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
