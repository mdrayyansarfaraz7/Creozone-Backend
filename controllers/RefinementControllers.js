import creation from "../models/creation.js";
import refinement from "../models/refinement.js";
import stash from "../models/stash.js";
export const acceptRefinement = async (req, res) => {
  const { id } = req.params;
  const { url, proposer, creationId } = req.body;

  if (!url || !proposer || !creationId) {
    return res.status(400).send({ message: "Required fields missing!" });
  }

  try {
    const refinementReq = await refinement.findById(id);
    if (!refinementReq) {
      return res.status(404).send({ message: "No refinement exists by this id" });
    }
    refinementReq.status = "accepted";
    const CreationDetails = await creation.findById(creationId);
    const stashId = CreationDetails.stash;
    const cat = CreationDetails.category;
    const NewCreation = await creation.create({
      url,
      author: proposer,
      stash: stashId,
      category: cat,
    });
    await stash.findByIdAndUpdate(stashId, {
      $push: {
        creations: NewCreation._id,
        styleChain: {
          designer: proposer,
          role: "contributor",
        }
      }
    });

    await refinementReq.save();
    console.log("Done!");
    return res.status(200).send({
      message: "Refinement accepted and stash updated successfully",
      newCreationId: NewCreation._id
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error while accepting refinement" });
  }
};
