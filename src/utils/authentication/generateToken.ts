import jwt from 'jsonwebtoken';
import {Request,Response} from 'express';
const generateToken = (userId:Object,req:Request,res:Response) =>{

    
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'15d'});
    res.cookie("jwt",token,{
        httpOnly:true,
        maxAge: 1000*60*60*24*15,//15 days
        sameSite:"strict", //https://chat.openai.com/share/5a567841-3332-4e42-9bd3-31db4d34ee5e
    });
    return token;
}

export default generateToken;