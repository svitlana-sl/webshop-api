// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import { notFound } from "./controllers/notFoundController";
import { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
// Variables
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Webshop API",
      version: "1.0.0",
      description: "API documentation for the Webshop project",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Load API routes documentation
};

const swaggerSpec = swaggerJsdoc(swaggerOptions); 
// Middleware
app.use(cors());
app.use(express.json());
// Swagger 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); //serve swagger UI

// Routes
app.use("/api/users", userRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API is running!");
});
app.all("*", notFound);

// Database connection
const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined in .env file");
    }
    await mongoose.connect(MONGO_URI);
    console.log("✅ Database connection OK");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}!`);
  });
};

startServer();
