import { Request, Response, NextFunction } from "express";

export const isAdminEJS = (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies?.adminLoggedIn === "true") {
    return next();
  }
  return res.redirect("/admin/login");
};
