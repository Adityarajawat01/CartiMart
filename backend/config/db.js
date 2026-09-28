import mongoose from "mongoose";

const connectDb = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDb connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDb ;
