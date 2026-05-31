import { Request, Response, NextFunction } from "express";

type ValidationRule = {
  field: string;
  required?: boolean;
  minLength?: number;
  format?: "email";
};

function validate(rules: ValidationRule[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && !value) {
        return res.status(400).json({ error: `${rule.field} is required` });
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        return res.status(400).json({
          error: `${rule.field} must be at least ${rule.minLength} characters`,
        });
      }

      if (value && rule.format === "email" && !value.includes("@")) {
        return res.status(400).json({ error: "Invalid email format" });
      }
    }

    next();
  };
}

export const validateRegister = validate([
  { field: "email", required: true, format: "email" },
  { field: "password", required: true, minLength: 6 },
]);

export const validateLogin = validate([
  { field: "email", required: true },
  { field: "password", required: true },
]);

export const validateResetPassword = validate([
  { field: "email", required: true, format: "email" },
]);

export const validateChangePassword = validate([
  { field: "token", required: true },
  { field: "new_password", required: true, minLength: 6 },
]);

export const validateUpdatePassword = validate([
  { field: "current_password", required: true },
  { field: "new_password", required: true, minLength: 6 },
]);

export const validateUpdateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { full_name, photo_url } = req.body;

  if (!full_name && !photo_url) {
    return res.status(400).json({ error: "At least one of full_name or photo_url is required" });
  }

  next();
};