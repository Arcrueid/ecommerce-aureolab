import { type NextFunction, type Request, type Response } from "express";

// HTTP error type definition
export interface HttpError extends Error {
  status?: number;
  errors?: Record<string, unknown>;
}

// Error handling middleware
export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    error: {
      status,
      message,
      ...(err.errors && { details: err.errors }),
    },
  });
};
