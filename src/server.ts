// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import userRoutes from "./routes/userRoutes";
import { notFound } from "./controllers/notFoundController";
import { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import ejs from "ejs";
import {Product} from "./models/Product"; // import the Product model

// Variables
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ✨ EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // 

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
      {
        url: "https://webshop-api-wc6u.onrender.com",
        description: "Production server (Render)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API is running!");
});

// ✨ Admin Panel Route (GET)
app.get("/admin", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.render("admin", { products });
  } catch (error) {
    res.status(500).send("Error loading admin panel");
  }
});

// ✨ Admin Product Deletion (POST)
app.post("/admin/delete/:id", async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (error) {
    res.status(500).send("Failed to delete product");
  }
});

// Not found handler
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
