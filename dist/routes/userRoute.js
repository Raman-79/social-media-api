import express from 'express';
import { singupUser, loginUser, logoutUser, handleFollowUser, handleUnfollowUser, updateUser, getUserProfile } from '../controllers/userController.js';
import verifyToken from '../utils/middlewares/verifyToken.js';
const router = express.Router();
//Get routes
router.get('/profile/:username', getUserProfile);
//Post routes
router.post('/signup', singupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', verifyToken, handleFollowUser);
router.post('/unfollow/:id', verifyToken, handleUnfollowUser);
router.post('/update/:id', verifyToken, updateUser);
export default router;
//# sourceMappingURL=userRoute.js.map