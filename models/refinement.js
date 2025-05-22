import mongoose from "mongoose";

const refinementSchema = mongoose.Schema({
  proposer: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ImgUrl: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('Refinement', refinementSchema);
