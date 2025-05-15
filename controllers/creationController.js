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