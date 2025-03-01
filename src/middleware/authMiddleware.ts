import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Define custom User type
interface UserPayload {
  userId: string;
  role: string;
}

// Extend Express Request type
declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) { 
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
};

export const isAdmin: RequestHandler = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admins only" });
  }
};
