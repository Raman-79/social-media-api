import Post from '../models/postModel.js';
import User from '../models/userModel.js';
const createPost = async (req, res) => {
    try {
        const { postedBy, text, img } = req.body;
        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(403).json({ msg: "User does not exist" });
        }
        if (!postedBy || !text) {
            return res.status(400).json({ msg: "Please fill all the fields" });
        }
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: "You are not authorized" });
        }
        const maxlength = 500;
        if (text.length > maxlength) {
            return res.status(400).json({ msg: `Text must be less than ${maxlength} characters` });
        }
        const newPost = new Post({ postedBy, text, img });
        await newPost.save();
        return res.status(200).json({ msg: "Post created successfully", newPost });
    }
    catch (error) {
        console.log("Error in createPost function in postController.js", error);
        return res.status(500).json({ msg: error.message });
    }
};
const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(200).json({ post });
    }
    catch (error) {
        console.log("Error in getPost function ", error);
        res.status(500).json({ msg: error.message });
    }
};
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: "You are not authorized" });
        }
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ msg: "Post deleted successfully" });
    }
    catch (error) {
        console.log("Error in deletePost function ", error);
        res.status(500).json({ msg: error.message });
    }
};
const likeUnlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            // Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: "Post unliked successfully" });
        }
        else {
            // Like post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post liked successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const replyToPost = async (req, res) => {
    try {
        const { text } = req.body;
        const { postId } = req.params;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;
        if (!text) {
            return res.status(400).json({ msg: "Please fill all the fields" });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        const reply = { userId, text, userProfilePic, username };
        post.replies.push(reply);
        await post.save();
        return res.status(202).json({ msg: "Reply added successfully", post });
    }
    catch (error) {
        console.log("Error in replyToPost function ", error);
        return res.status(500).json({ msg: error.message });
    }
};
const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const following = user.following;
        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });
        res.status(200).json(feedPosts);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts };
//# sourceMappingURL=postController.js.map