import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";

describe("Validation Middlewares", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    nextFunction = jest.fn();
  });

  describe("validateParams", () => {
    const schema = z.object({
      id: z.string().uuid(),
    });

    it("should call next() with valid params", () => {
      mockRequest.params = { id: "123e4567-e89b-12d3-a456-426614174000" };

      validateParams(schema)(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should call next() with an error for invalid params", () => {
      mockRequest.params = { id: "invalid-id" };

      validateParams(schema)(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(400);
    });
  });

  describe("validateQuery", () => {
    const schema = z.object({
      page: z.coerce.number().optional(),
      per_page: z.coerce.number().optional(),
    });

    it("should call next() with valid query params", () => {
      mockRequest.query = { page: "1", per_page: "10" };

      validateQuery(schema)(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith();
      expect(mockRequest.query).toEqual({ page: 1, per_page: 10 });
    });

    it("should call next() with an error for invalid query params", () => {
      mockRequest.query = { page: "abc", per_page: "10" };

      validateQuery(schema)(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(400);
    });
  });

  describe("validateBody", () => {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    it("should call next() with valid body", () => {
      mockRequest.body = { name: "Test User", email: "test@example.com" };

      validateBody(schema)(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should call next() with an error for invalid body", () => {
      mockRequest.body = { name: "Test User", email: "invalid-email" };

      validateBody(schema)(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(400);
    });
  });
});
