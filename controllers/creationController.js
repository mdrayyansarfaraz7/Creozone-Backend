import creation from "../models/creation.js";

export const findCreation=async(req,res)=>{
    const {id}=req.params;
    console.log(id);
    try {
      const creationDetails = await creation.findById(id).populate({path:'author',select:'username email avatar'}).populate({path:'stash',select:'title'});
      console.log(creationDetails);
      if(!creationDetails){
    res.status(401).send({message:"Creation Not  found"});
      }
      else{
    res.send({message:"Creaton found",creationDetails});
      }
    } catch (error) 
    {
      console.log(error);
      res.status(401).send({message:"Something went wrong"});
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
