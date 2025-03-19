import mongoose from "mongoose";

const creationSchema=mongoose.Schema({
    author:{
        type:mongoose.Types.ObjectId,
        ref: 'User',
        required:true
    },
    url:{
        type:String,
        required:true
    },
    outlooks:[
        {
            type:mongoose.Types.ObjectId,
             ref: 'Outlooks'
        }
    ]
} ,{ timestamps: true });

export default mongoose.model('Creation', creationSchema);