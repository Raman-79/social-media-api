import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDb = async () => {
try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
} catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
}
};

export default connectDb;