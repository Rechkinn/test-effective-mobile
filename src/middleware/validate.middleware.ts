import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

type ValidatorFn = (body: Record<string, unknown>) => string | null;

export const validate = (validatorFn: ValidatorFn) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const error = validatorFn(req.body);
    if (error) return next(ApiError.badRequest(error));
    next();
  };
};
