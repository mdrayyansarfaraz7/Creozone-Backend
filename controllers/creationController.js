import creation from "../models/creation.js";

export const findCreation=async(req,res)=>{
    const {id}=req.params;
    try {
      const creationDetails=await creation.findOne({id});
      if(!stashDetails){
    res.status(401).send({message:"Creation Not found found"});
      }
      else{
    res.send({message:"Creaton found",creationDetails});
      }
    } catch (error) 
    {
      console.log(error);
      res.status(401).send({message:"Creation Not found found"});
    }
}