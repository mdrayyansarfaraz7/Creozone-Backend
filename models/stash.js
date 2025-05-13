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
    ],
    Resculpt: [
        {
            resculpter: {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            },
            imgUrl: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model('Stash', stashSchema);
