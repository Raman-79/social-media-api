import User from "../../models/userModel.js";
import jwt from "jsonwebtoken";
const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded.userId }).select("-password"); //.select("-password") to remove password from response
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            req.user = user;
            next();
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log("Error in verify token", error.message);
    }
};
export default verifyToken;
//# sourceMappingURL=verifyToken.js.map