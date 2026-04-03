import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { Role } from "@prisma/client";

export interface JwtPayload {
  userId: string;
  role: string;
}

// Расширяем тип Request, чтобы хранить данные пользователя
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = payload;

    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== Role.admin) {
    return next(ApiError.forbidden("Admin access required"));
  }
  next();
};
