import mongoose from 'mongoose';

const stashSchema = mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    creations: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Creation'
        }
    ],
    tags: [String],
    theme: { type: String },
    styleChain: [
        {
            designer: {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            },
            role: {
                type: String,
                enum: ['creator', 'contributor'],
                default: 'creator'
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model('Stash', stashSchema);
