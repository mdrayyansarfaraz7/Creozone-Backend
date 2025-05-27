import Outlook from "../models/outlook.js";
import Refinement from "../models/refinement.js";
import User from "../models/user.js";
import Creation from "../models/creation.js";

export const createOutlook = async (req, res) => {
  const { id } = req.params;
  const { author, feedback } = req.body;
  try {
    const existingCreation = await Creation.findById(id);
    if (!existingCreation) {
      return res.status(400).json({ message: "No creation found by such Id!" });
    }
    if (!author || !feedback) {
      return res.status(400).json({ message: "Credentials required" });
    }
    const proposer = await User.findOne({ username: author });
    if (!proposer) {
      return res.status(404).json({ message: "Author not found" });
    }
    let newRefinement = null;
    if (req.file && req.file.path) {
      newRefinement = await Refinement.create({
        proposer: proposer._id,
        ImgUrl: req.file.path,
        status: "pending"
      });
    }
    const newOutlook = await Outlook.create({
      author: proposer._id,
      feedback,
      creation: id,
      refinementRequest: newRefinement ? [newRefinement._id] : []
    });

    await User.findByIdAndUpdate(proposer._id, {
      $push: {
        outlooks: newOutlook._id,
        ...(newRefinement && { refinements: { id: newRefinement._id } })
      }
    });

    await Creation.findByIdAndUpdate(id, {
      $push: {
        outlooks: newOutlook._id
      }
    });

    res.status(201).json({
      message: "Outlook created successfully",
      outlook: newOutlook,
      refinement: newRefinement || null
    });

  } catch (error) {
    console.error("Error in createOutlook:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};


export const findOutlooksForCreation = async (req, res) => {
  const { id } = req.params;
  try {
    const existingCreation = await Creation.findById(id);
    if (!existingCreation) {
      return res.status(400).json({ message: "No creation found by such Id!" });
    }
    const outlooks = await Outlook.find({ creation: id })
      .populate("author", "username avatar")
      .populate("refinementRequest");

    res.status(200).json({ outlooks });
  } catch (error) {
    console.error("Error fetching outlooks:", error);
    res.status(500).json({ message: "Server error while fetching outlooks." });
  }
};

export const findOutlooksForUpdation = async (req, res) => {
  const { id } = req.params;
  try {
    const { userId } = req.body;
    let RefinementURL = null;

    if (req.file && req.file.path) {
      RefinementURL = req.file.path;
    }

    if (!userId || !RefinementURL) {
      return res.status(400).json({ message: "Credentials and image are required." });
    }

    const newRefinement = await Refinement.create({
      proposer: userId,
      ImgUrl: RefinementURL,
      status: "pending"
    });

    await Outlook.findByIdAndUpdate(id, {
      $push: {
        refinementRequest: newRefinement._id
      }
    });

    res.status(200).json({ message: "Outlook updated with new refinement request." });
  } catch (error) {
    console.error("Error updating outlook:", error);
    res.status(500).json({ message: "Server error while updating outlook." });
  }
};


