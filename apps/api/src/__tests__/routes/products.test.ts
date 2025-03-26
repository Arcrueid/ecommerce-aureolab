/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@repo/database";
import request from "supertest";
import app from "../../app";
import { type NextFunction } from "express";

// Mock Stripe module
jest.mock("../../utils/stripe", () => {
  return {
    __esModule: true,
    default: {},
    getStripeInstance: jest.fn(() => ({})),
  };
});

// Mock for validation middleware
jest.mock("../../middlewares/validation", () => {
  return {
    validateParams: jest.fn(
      () => (_req: Request, _res: Response, next: NextFunction) => next()
    ),
    validateQuery: jest.fn(
      () => (_req: Request, _res: Response, next: NextFunction) => next()
    ),
    validateBody: jest.fn(
      () => (_req: Request, _res: Response, next: NextFunction) => next()
    ),
  };
});

// Mock for database
jest.mock("@repo/database", () => {
  const mockDb = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    query: {
      productsTable: {
        findFirst: jest.fn(),
      },
    },
  };
  return {
    db: mockDb,
    eq: jest.fn(),
    desc: jest.fn(),
    asc: jest.fn(),
    count: jest.fn(),
    ilike: jest.fn(),
  };
});

describe("Products API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("should return products with pagination", async () => {
      const mockProducts = [
        { id: "1", name: "Product 1", price: 100 },
        { id: "2", name: "Product 2", price: 200 },
      ];
      const mockCount = [{ total: 2 }];

      (db.execute as jest.Mock).mockResolvedValueOnce(mockProducts);
      (db.execute as jest.Mock).mockResolvedValueOnce(mockCount);

      const response = await request(app)
        .get("/api/products")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("meta");
      expect(response.body.meta).toHaveProperty("records", 2);
    });

    it("should filter products by search term", async () => {
      // Mock data
      const mockProducts = [{ id: "1", name: "Product 1", price: 100 }];
      const mockCount = [{ total: 1 }];

      (db.execute as jest.Mock).mockResolvedValueOnce(mockProducts);
      (db.execute as jest.Mock).mockResolvedValueOnce(mockCount);

      const response = await request(app)
        .get("/api/products?search=Product 1")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.meta.records).toBe(1);
    });
  });
});
