import user from "../models/user.js";

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;
    try {
        if (req.file && req.file.path) {
            updatedFields.avatar = req.file.path; 
        }
        const updatedUser = await user.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(201).send({ message: "Successfully updated user details!", updatedUser });
    } catch (error) {
        res.status(400).send({ message: "Error in updating the User! Please try again later." });
    }
};


export const getUser=async(req,res)=>{
    const {username}=req.params;
    try {
        const userDetails=await user.findOne({username}).populate({
    path: 'stash',
    populate: {
      path: 'styleChain.designer',
      select: 'username avatar',
    }
  }).populate('creations');
        if(userDetails){
            res.status(200).send({message:"User found",userDetails});
        }
        else{
            res.status(420).send({message:"User with such username was not found in our Database"});
        }
    } catch (error) {
        console.log(error);
         res.status(420).send({message:"User with such username was not found in our Database"});
    }
}
