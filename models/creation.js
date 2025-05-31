import mongoose from "mongoose";

const creationSchema = mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  outlooks: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Outlooks'
    }
  ],
  stash: {
    type: mongoose.Types.ObjectId,
    ref: 'Stash'
  },
  category: {
    type: String,
    enum: [
      'logos',
      'card-designs',
      'branding',
      'graphics',
      'iconography',
      'ui-ux-design',
      'mocups',
      'print-design',
      'packaging',
      'news-letter'
    ]
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true
    }
  ],
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true });


export default mongoose.model('Creation', creationSchema);