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


export const getUser = async (req, res) => {
    const { username } = req.params;
    try {
        const userDetails = await user.findOne({ username })
            .populate({
                path: 'stash',
                populate: {
                    path: 'styleChain.designer',
                    select: 'username avatar',
                }
            })
            .populate('creations')
            .populate({
                path: 'refinements.id',
                model: 'Refinement'
            })
            .populate({
                path: 'outlooks',
                populate: [
                    {
                        path: 'author',
                        model: 'User',
                        select: 'username avatar'
                    },
                    {
                        path: 'refinementRequest',
                        model: 'Refinement',
                        populate: {
                            path: 'proposer',
                            model: 'User',
                            select: 'username avatar'
                        }
                    }
                ]
            });

        if (userDetails) {
            res.status(200).send({ message: "User found", userDetails });
        }
        else {
            res.status(420).send({ message: "User with such username was not found in our Database" });
        }
    } catch (error) {
        console.log(error);
        res.status(420).send({ message: "User with such username was not found in our Database" });
    }
}

export const follow = async (req, res) => {
  const { username } = req.params; 
  const { userId } = req.body;     

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    const userToFollow = await user.findOne({ username });
    if (!userToFollow) {
      return res.status(404).json({ message: "No user with such username exists!" });
    }

    const currentUser = await user.findById(userId);
    if (!currentUser) {
      return res.status(400).json({ message: "Invalid user ID provided!" });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: "Already following this user!" });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(userId);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "Successfully followed the user!" });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unfollow = async (req, res) => {
  const { username } = req.params;
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    const userToUnfollow = await user.findOne({ username });
    if (!userToUnfollow) {
      return res.status(404).json({ message: "No user with such username exists!" });
    }

    const currentUser = await user.findById(userId);
    if (!currentUser) {
      return res.status(400).json({ message: "Invalid user ID provided!" });
    }

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ message: "You don't follow this user!" });
    }

    // Remove from both sides
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== userId.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    return res.status(200).json({ message: "Successfully unfollowed the user!" });
  } catch (error) {
    console.error("Unfollow error:", error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};


