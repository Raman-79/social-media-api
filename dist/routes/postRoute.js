import express from 'express';
import { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts } from '../controllers/postController.js';
import verifyToken from '../utils/middlewares/verifyToken.js';
const router = express.Router();
//Get routes
router.get('/feed', verifyToken, getFeedPosts);
router.get('/:postId', getPost);
//Post routes
router.post('/create', verifyToken, createPost);
router.post('/reply/:postId', verifyToken, replyToPost);
//Delete routes
router.delete('/delete/:postId', verifyToken, deletePost);
//Put routes
router.put('/like-unlike/:postId', verifyToken, likeUnlikePost);
export default router;
//# sourceMappingURL=postRoute.js.map