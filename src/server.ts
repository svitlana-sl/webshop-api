// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import { notFound } from "./controllers/notFoundController";
// import testRoutes from "./routes/exampleRoutes";
import { helloMiddleware } from "./middleware/exampleMiddleware";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";


// Variables
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("🚀 API is running!");
});
// app.use("/api", helloMiddleware, testRoutes);
app.all("*", notFound);

// Database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connection OK");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

// Start Server
const startServer = async () => {
  await connectDB();
// Server Listening
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}!`);
  });
};

startServer();

