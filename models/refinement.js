import mongoose from "mongoose";

const refinementSchema=mongoose.Schema({
    proposer:{
        type:mongoose.Types.ObjectId,
        requied:true
    },
    ImgUrl:{
        type:String,
    }
})

export default mongoose.model('Refinement', refinementSchema);
