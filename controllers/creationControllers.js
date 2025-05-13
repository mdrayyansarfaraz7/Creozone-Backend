import mongoose from "mongoose";
import creation from "../models/creation.js";
import stash from "../models/stash.js";
import user from "../models/user.js";

export const createStash = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid user ID');
  }

  const { title, desc } = req.body;

  try {
    const thumbnail = req.files?.['thumbnail']?.[0]?.path;
    const images = req.files?.['images'] || [];
    const styleChain = [{ designer: id, role: "creator" }];
    const newStash = await stash.create({
      title,
      desc,
      thumbnail,
      owner: id,
      styleChain
    });
    await user.findByIdAndUpdate(id, {
      $push: { stash: newStash._id }
    });

    const thumbnailCreation = await creation.create({
      author: id,
      url: thumbnail,
      stash: newStash._id
    });

    newStash.creations.push(thumbnailCreation._id);

    await user.findByIdAndUpdate(id, {
      $push: { creations: thumbnailCreation._id }
    });
    const imageCreations = await Promise.all(
      images.map(async (obj) => {
        const cre = await creation.create({
          author: id,
          url: obj.path,
          stash: newStash._id
        });
        newStash.creations.push(cre._id);
        await user.findByIdAndUpdate(id, {
          $push: { creations: cre._id }
        });

        return cre;
      })
    );
    await newStash.save();

    res.status(201).json({
      message: 'Stash and creations saved',
      stash: newStash,
      creations: [thumbnailCreation, ...imageCreations]
    });

  } catch (error) {
    console.error('Error during upload:', error);
    res.status(500).send('Upload failed');
  }
};
