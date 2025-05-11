import user from "../models/user.js";

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    console.log("Updating user ID:", id);
    console.log("Update data:", updatedFields);

    try {
        const updatedUser = await user.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        console.log("Updated user:", updatedUser);
        res.status(201).send({ message: "Successfully updated user details!", updatedUser });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error in updating the User! Please try again later." });
    }
}
