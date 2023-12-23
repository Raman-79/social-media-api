import User from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import {Request,Response,NextFunction} from 'express';
import { Types } from "mongoose";
// import { Schema } from 'mongoose';
// const { ObjectId } = Schema;
interface User {
    _id: Types.ObjectId;
    // username:string,
    // email:string,
    // profilePic:string,
    // followers:[string],
    // following:[string],
    // bio:string,
    // isFrozen:boolean
}
interface UserRequest extends Request {
    user?: User; // Optional because it may not be added by the middleware in every route
  }
interface JwtPayload {
    userId: string;
  }
const verifyToken = async(req:UserRequest,res:Response,next:NextFunction) => {
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"Unauthorized access"});
        }
        else{
            const decoded:JwtPayload = jwt.verify(token,process.env.JWT_SECRET) as JwtPayload;
            const user = await User.findOne({ _id:  decoded.userId }).select("-password");//.select("-password") to remove password from response
            if(!user){
                return res.status(404).json({message:"User not found"});
            }
            req.user = user;
            next();      
            
        }
    }catch(error){
        res.status(500).json({message:"Internal server error"});
        console.log("Error in verify token", error.message);
    }
}
export default verifyToken;