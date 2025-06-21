import mongoose from "mongoose";

const connectDB = async () => {
    try { 
        await mongoose.connect(process.env.DB_URI);
        console.log("db connected successfully");
        
        
    } catch (error) {
        console.log("erorr connecting DB",error);
        
    }

};

export default connectDB;
