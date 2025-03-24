import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors
      .array()
      .map((err) => ({ [err.param]: err.msg }));
    res.status(400).json({
      message: "Validation error",
      errors: extractedErrors,
    });
    return;
  }
  next();
};
