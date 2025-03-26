import { type Request, type Response } from "express";
import { errorHandler, type HttpError } from "../../utils/errorHandler";

describe("Error Handler Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {};
    mockResponse = {
      status: statusMock,
    };
  });

  it("should handle errors with status and message", () => {
    const error: HttpError = new Error("Test error");
    error.status = 400;

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      jest.fn()
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        status: 400,
        message: "Test error",
      },
    });
  });

  it("should handle errors with default status and message", () => {
    const error: HttpError = new Error();

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      jest.fn()
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        status: 500,
        message: "Internal server error",
      },
    });
  });

  it("should include error details when provided", () => {
    const error: HttpError = new Error("Validation failed");
    error.status = 400;
    error.errors = {
      fields: ["name is required", "email is invalid"],
    };

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      jest.fn()
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        status: 400,
        message: "Validation failed",
        details: {
          fields: ["name is required", "email is invalid"],
        },
      },
    });
  });
});
