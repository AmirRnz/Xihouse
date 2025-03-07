import mongoose from "mongoose";

let initialized = false;

export const connect = async () => {
  mongoose.set("strictQuery", true);
  if (initialized) {
    console.log("mongodb already connected");
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Xihouse",
    });
    initialized = true;
    console.log("mongodb connected");
  } catch (error) {
    console.log("mongodb connection error:", error);
  }
};
