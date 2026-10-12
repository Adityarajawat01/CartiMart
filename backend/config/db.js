import mongoose from "mongoose";

const connectDb = async () => {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing");
      }

      const conn = await Promise.race([
        mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
          socketTimeoutMS: 10000,
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("MongoDB connection timed out")),
            15000
          )
        ),
      ]);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDb connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDb ;
