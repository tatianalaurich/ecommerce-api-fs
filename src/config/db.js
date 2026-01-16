import mongoose from "mongoose";

export async function connectDB() {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        if (!MONGO_URL) throw new Error("Falta MONGO_URL en .env");

        await mongoose.connect(MONGO_URL);
        console.log("MongoDB connected ✅");
    } catch (err) {
        console.error("MongoDB connection error ❌", err.message);
        process.exit(1);
    }
}
