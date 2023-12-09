import express from 'express';
import dotenv from 'dotenv';
import connectDb from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoute.js';
import postRoutes from './routes/postRoute.js';
// import device from 'express-device';

//Intializations
dotenv.config();
connectDb();


const app = express();
const PORT = process.env.PORT;

//Middlewares
app.use(express.json()); //To parse json data in the req.body
app.use(express.urlencoded({extended:false})); // To parse form data in the req.body
app.use(cookieParser()); // To parse cookies in the req.cookies
// app.use(device.capture()); // To capture device info in the req.device


//Routes
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.listen(PORT,()=>{console.log(`Server started at http://localhost:${PORT}`)});
