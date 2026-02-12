import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB conectado");
    } catch (error) {
        console.error("❌ Error conectando Mongo:", error.message);
        process.exit(1);
    }
};
