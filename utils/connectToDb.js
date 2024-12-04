import mongoose from "mongoose";

let isConnected = false; // Global variable to track the connection status

const connectToDb = async () => {
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    try {
        const db = await mongoose.connect('mongodb+srv://kmalik0907:V2EHbN5L1zpZKu3O@cluster0.kszf5qh.mongodb.net', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = db.connections[0].readyState === 1; // 1 means connected
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        throw new Error("Failed to connect to database");
    }
};

export default connectToDb;
