import mongoose from "mongoose";
import creation from "../models/creation.js";
import stash from "../models/stash.js";
import user from "../models/user.js";

export const createStash = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid user ID');
  }
  const { title, desc, category, tags } = req.body;
  if (!title || !desc || !category) {
    return res.status(400).json({ message: 'Required field missing!' });
  }
  try {
    const thumbnail = req.files?.['thumbnail']?.[0]?.path;
    const styleChain = [{ designer: id, role: "creator" }];
    
    const newStash = await stash.create({
      title,
      desc,
      thumbnail,
      owner: id,
      styleChain,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [] 
    });

    await user.findByIdAndUpdate(id, {
      $push: { stash: newStash._id }
    });

    const thumbnailCreation = await creation.create({
      author: id,
      url: thumbnail,
      stash: newStash._id,
      category,
      tags:tags
    });

    newStash.creations.push(thumbnailCreation._id);

    await user.findByIdAndUpdate(id, {
      $push: { creations: thumbnailCreation._id }
    });

    await newStash.save();

    res.status(201).json({
      message: 'Stash and creation saved',
      stash: newStash,
      creations: [thumbnailCreation]
    });
  } catch (error) {
    console.error('Error during upload:', error);
    res.status(500).send('Upload failed');
  }
};
export const findStash=async(req,res)=>{
    const {id}=req.params;
    try {
      const stashDetails = await stash
  .findById(id)
  .populate('styleChain.designer')
  .populate('owner')
  .populate({
    path: 'creations',
    populate: [
      {
        path: 'author',
        select: '_id username email avatar',
      },
      {
        path: 'outlooks',
      },
    ],
  });
      console.log(stashDetails);
      if(!stashDetails){
    res.status(401).send({message:"Stash Not found found"});
      }
      else{
    res.send({message:"Stash found",stashDetails});
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({message:"Stash Not found found"});
    }
}

export const allStashes=async(req,res)=>{
  const {username}=req.params;
  try {
  const userDetails = await user.findOne({ username });
    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }
    const allStashes = await stash.find({ owner: userDetails._id })
      .populate('creations')
      .populate('styleChain.designer');
console.log(allStashes);
       res.status(200).json({message:"Found All Stashes",allStashes});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}


