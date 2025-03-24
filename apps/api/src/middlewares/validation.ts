import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";

// Middleware for params validation
export const validateParams =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(
          createHttpError(400, {
            message: "Invalid parameters",
            errors: error.errors,
          })
        );
      } else {
        next(error);
      }
    }
  };

// Middleware for query validation
export const validateQuery =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(
          createHttpError(400, {
            message: "Invalid query parameters",
            errors: error.errors,
          })
        );
      } else {
        next(error);
      }
    }
  };
