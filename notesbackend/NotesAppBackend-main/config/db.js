import "./env.js";
import dns from "dns";
import mongoose from "mongoose";

const connectToDatabase = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing from the environment variables.");
  }

  dns.setDefaultResultOrder("ipv4first");

  if (process.env.MONGO_DNS_SERVERS) {
    dns.setServers(
      process.env.MONGO_DNS_SERVERS.split(",")
        .map((server) => server.trim())
        .filter(Boolean),
    );
  }

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("MongoDB connected successfully");
      return;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);
    }
  }

  throw new Error(
    `${lastError?.message || "MongoDB connection failed."} Check your MONGO_URI, Atlas network access list, and DNS settings.`,
  );
};

export default connectToDatabase;
