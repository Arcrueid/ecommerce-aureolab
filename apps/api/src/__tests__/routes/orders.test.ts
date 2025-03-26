import request from "supertest";
import app from "../../app";
import { db } from "@repo/database";

// Mock Stripe module
jest.mock("../../utils/stripe", () => {
  const mockRefundsCreate = jest.fn();
  return {
    __esModule: true,
    default: {
      refunds: {
        create: mockRefundsCreate,
      },
    },
    getStripeInstance: jest.fn(() => ({
      refunds: {
        create: mockRefundsCreate,
      },
    })),
    mockRefundsCreate,
  };
});

// Mock database
jest.mock("@repo/database", () => {
  const mockDb = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    transaction: jest.fn(),
    query: {
      ordersTable: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      orderItemsTable: {
        findMany: jest.fn(),
      },
    },
  };
  return {
    db: mockDb,
    eq: jest.fn(),
  };
});

describe("Orders API", () => {
  const { mockRefundsCreate } = jest.requireMock("../../utils/stripe");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/orders/create-order", () => {
    it("should create an order successfully", async () => {
      // Setup test data
      const mockOrder = {
        id: "order-123",
        customerName: "Cliente Prueba",
        customerEmail: "test@example.com",
        customerAddress: "Calle Test 123",
        total: 300,
        status: "succeeded",
        payment: { id: "pi_123", client_secret: "secret_123" },
      };

      (db.transaction as jest.Mock).mockImplementation(async (callback) => {
        const tx = {
          insert: jest.fn().mockReturnThis(),
          values: jest.fn().mockReturnThis(),
          returning: jest.fn().mockResolvedValue([mockOrder]),
        };
        return callback(tx);
      });

      const payload = {
        name: "Cliente Prueba",
        email: "test@example.com",
        address: "Calle Test 123",
        payment: {
          id: "pi_123",
          status: "succeeded",
          client_secret: "secret_123",
        },
        items: [
          { id: "1", name: "Producto 1", price: 100, quantity: 2 },
          { id: "2", name: "Producto 2", price: 50, quantity: 2 },
        ],
      };

      const response = await request(app)
        .post("/api/orders/create-order")
        .send(payload)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body).toHaveProperty("orderId", "order-123");
      expect(response.body).toHaveProperty("clientSecret", "secret_123");
      expect(db.transaction).toHaveBeenCalled();
    });

    it("should return 400 for invalid request body", async () => {
      // Invalid payload
      const invalidPayload = {
        name: "Cliente Prueba",
        // Missing required email
        address: "Calle Test 123",
        payment: {},
        items: [],
      };

      await request(app)
        .post("/api/orders/create-order")
        .send(invalidPayload)
        .expect(400);
    });
  });

  describe("GET /api/orders/by-email/:email", () => {
    it("should return orders for a valid email", async () => {
      const mockOrders = [
        {
          id: "order-123",
          customerName: "Cliente Prueba",
          customerEmail: "test@example.com",
          status: "succeeded",
          items: [
            { id: "item-1", name: "Producto 1", price: 100, quantity: 2 },
          ],
        },
      ];

      (db.query.ordersTable.findMany as jest.Mock).mockResolvedValueOnce(
        mockOrders
      );

      const response = await request(app)
        .get("/api/orders/by-email/test@example.com")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("orders");
      expect(response.body.orders).toHaveLength(1);
    });

    it("should return 404 if no orders found", async () => {
      (db.query.ordersTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      await request(app)
        .get("/api/orders/by-email/noorders@example.com")
        .expect(404);
    });

    it("should return 400 for invalid email format", async () => {
      await request(app).get("/api/orders/by-email/invalid-email").expect(400);
    });
  });

  describe("POST /api/orders/request-refund", () => {
    it("should process a full refund successfully", async () => {
      const mockOrderId = "123e4567-e89b-12d3-a456-426614174000";
      const mockItemId = "123e4567-e89b-12d3-a456-426614174001";

      const mockOrder = {
        id: mockOrderId,
        payment: { id: "pi_123" },
        items: [
          {
            id: mockItemId,
            price: 100,
            quantity: 2,
            refundStatus: null,
            refundedQuantity: null,
          },
        ],
      };

      (db.query.ordersTable.findFirst as jest.Mock).mockResolvedValueOnce(
        mockOrder
      );
      (db.query.orderItemsTable.findMany as jest.Mock).mockResolvedValueOnce([
        { id: mockItemId, refundStatus: "full" },
      ]);
      (db.transaction as jest.Mock).mockResolvedValueOnce(undefined);
      mockRefundsCreate.mockResolvedValueOnce({
        id: "ref_123",
      });

      const payload = {
        orderId: mockOrderId,
        itemIds: null,
        isPartial: false,
      };

      const response = await request(app)
        .post("/api/orders/request-refund")
        .send(payload)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("orderId", mockOrderId);
      expect(mockRefundsCreate).toHaveBeenCalledWith({
        payment_intent: "pi_123",
        amount: 200, // 100 × 2
      });
    });

    it("should return 404 if order not found", async () => {
      (db.query.ordersTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const payload = {
        orderId: "123e4567-e89b-12d3-a456-426614174002", // UUID valid but not found
        itemIds: null,
        isPartial: false,
      };

      await request(app)
        .post("/api/orders/request-refund")
        .send(payload)
        .expect(404);
    });
  });
});
