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
    sex: {
        type: String,
        enum: ['Male', 'Female']
    },
    avatar: {
        type: String,
    },
    tools: [{
        type: String,
        enum: [
            "Adobe Photoshop",
            "Adobe Illustrator",
            "Figma",
            "Adobe XD",
            "Canva",
            "Sketch",
            "InVision",
            "CorelDRAW",
            "Affinity Designer",
            "Blender",
            "Cinema 4D",
            "Adobe After Effects",
            "Framer",
            "Glyphs"
        ]
    }],
    designerType: {
        type: String,
        enum: [
            "Graphic Designer",
            "UI/UX Designer",
            "Product Designer",
            "Web Designer",
            "Visual Designer",
            "Interaction Designer",
            "Motion Designer",
            "Brand Designer",
            "Logo Designer",
            "Print Designer",
            "Illustrator",
            "2D Animator",
            "3D Designer",
            "3D Animator",
            "Typographer",
            "Design Strategist",
            "Creative Director",
            "Art Director",
            "Mobile App Designer"
        ]
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
    ],
    creations: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Creation'
        }
    ],
    outlooks: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Outlooks'
        }
    ],
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Creation'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
