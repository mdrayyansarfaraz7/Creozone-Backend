import creation from "../models/creation.js";
import stash from "../models/stash.js";
import user from "../models/user.js";

export const createCreation = async (req, res) => {
  const { id } = req.params;
  const { userId, tags, category } = req.body;

  if (!userId || !tags || !category) {
    return res.status(400).send({ message: "All fields (userId, tags, category) are required" });
  }

  try {
    const creationURL = req.file?.path;
    if (!creationURL) {
      return res.status(400).send({ message: "Creation design missing" });
    }

    const newCreation = await creation.create({
      author: userId,
      url: creationURL,
      category,
      tags,
      stash: id
    });

    await stash.findByIdAndUpdate(id, {
      $push: { creations: newCreation._id }
    });

    await user.findByIdAndUpdate(userId, {
      $push: { creations: newCreation._id }
    });
    
    return res.status(201).send({ message: "Creation created", newCreation });
  } catch (error) {
    console.error("Creation error:", error);
    return res.status(500).send({ message: "Internal server error", error: error.message });
  }
};

export const findCreation = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const creationDetails = await creation.findById(id).populate({ path: 'author', select: 'username email avatar _id' }).populate({ path: 'stash', select: 'title' }).populate('outlooks');
    console.log(creationDetails);
    if (!creationDetails) {
      res.status(401).send({ message: "Creation Not  found" });
    }
    else {
      res.send({ message: "Creaton found", creationDetails });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Something went wrong" });
  }
}
export const findCategoryCreation = async (req, res) => {
  const { category } = req.params;

  if (!category) {
    return res.status(400).send({ message: "Category is necessary" });
  }

  try {
    const categoryCreations = await creation.find({ category });

    if (categoryCreations.length === 0) {
      return res.status(404).send({ message: "No creations found in this category." });
    }

    res.status(200).send({
      message: "All creations of category",
      creations: categoryCreations,
    });
  } catch (error) {
    console.error("Error in findCategoryCreation:", error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const likeCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const creationDetails = await creation.findById(id);
    if (!creationDetails) {
      return res.status(404).json({ message: "No creation found!" });
    }

    if (creationDetails.likes.includes(userId)) {
      return res.status(400).json({ message: "Already liked by this user." });
    }

    creationDetails.likes.push(userId);
    await creationDetails.save();

    res.status(200).json({ message: `Like added by user ID: ${userId}` });
  } catch (err) {
    console.error("Error liking creation:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unlikeCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const creationDetails = await creation.findById(id);
    if (!creationDetails) {
      return res.status(404).json({ message: "No creation found!" });
    }

    if (!creationDetails.likes.includes(userId)) {
      return res.status(400).json({ message: "You never liked this creation." });
    }
    creationDetails.likes = creationDetails.likes.filter(
      (likeId) => likeId.toString() !== userId
    );

    await creationDetails.save();

    res.status(200).json({ message: `Unliked by user ID: ${userId}` });
  } catch (err) {
    console.error("Error unliking creation:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


