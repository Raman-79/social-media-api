import User from '../models/userModel.js';
import bycrpt from 'bcryptjs';
import generateToken from '../utils/authentication/generateToken.js';
const singupUser = async (req, res) => {
    try {
        const { email, password, username, name } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user)
            return res.status(403).json({ message: 'User already exists' });
        const salt = bycrpt.genSaltSync(10);
        const hashedPassword = bycrpt.hashSync(password, salt);
        const newUser = await User.create({ email, password: hashedPassword, username, name });
        await newUser.save();
        if (newUser) {
            generateToken(newUser._id, req, res);
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                name: newUser.name,
                message: 'User created successfully'
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in creating user", err.message);
    }
};
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = bycrpt.compareSync(password, user?.password || "");
        if (!user) {
            return res.status(404).json({ message: 'User does not exists' });
        }
        else if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        generateToken(user._id, req, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            name: user.name,
            message: 'User logged in successfully'
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log("Error in login user", error.message);
    }
};
const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", {
            expires: new Date(0),
            httpOnly: true
        }); //To remove the token from the cookie
        return res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log("Error in logout user", error.message);
    }
};
const handleFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user._id.toString();
        const currentUser = await User.findById(currentUserId);
        const userToModify = await User.findById(id);
        if (currentUserId === id) {
            return res.status(400).json({ message: "You cannot follow  yourself" });
        }
        if (!userToModify) {
            return res.status(404).json({ message: "User not found" });
        }
        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            return res.status(200).json({ message: "Already following" });
        }
        else {
            await User.findByIdAndUpdate(id, { $push: { followers: currentUserId } }); //pushing the id of the current user in the followers array of the user to be followed
            await User.findByIdAndUpdate(currentUserId, { $push: { following: id } }); //pushing the id of the user to be followed in the following array of the current user
            return res.status(200).json({ message: "User followed successfully" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log("Error in follow user", error.message);
    }
};
const handleUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user._id.toString();
        const currentUser = await User.findById(currentUserId);
        const userToModify = await User.findById(id);
        if (currentUserId === id) {
            return res.status(403).json({ message: "You cannot  unfollow yourself" });
        }
        if (!userToModify) {
            return res.status(404).json({ message: "User not found" });
        }
        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } });
            await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } });
            return res.status(200).json({ message: "User unfollowed successfully" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log("Error in unfollow user", error.message);
    }
};
const updateUser = async (req, res) => {
    const { name, email, username, password, profilePic, bio } = req.body;
    const userId = req.user._id.toString();
    try {
        let user = await User.findById(userId);
        if (req.params.id !== userId.toString()) {
            return res.status(403).json({ message: "You cannot update other user's profile" });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (password) {
            const salt = bycrpt.genSaltSync(10);
            const hashedPassword = bycrpt.hashSync(password, salt);
            user.password = hashedPassword;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;
        user = await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log("Error in update user", error.message);
    }
};
const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select("-password").select("-updatedAt");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log("Error in get user profile", error.message);
    }
};
export { singupUser, loginUser, logoutUser, handleFollowUser, handleUnfollowUser, updateUser, getUserProfile };
//# sourceMappingURL=userController.js.map