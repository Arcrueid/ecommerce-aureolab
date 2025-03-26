import request from "supertest";
import app from "../../app";

// Mock Stripe module
jest.mock("../../utils/stripe", () => {
  const mockPaymentIntentsCreate = jest.fn();
  return {
    __esModule: true,
    default: {
      paymentIntents: {
        create: mockPaymentIntentsCreate,
      },
    },
    getStripeInstance: jest.fn(() => ({
      paymentIntents: {
        create: mockPaymentIntentsCreate,
      },
    })),
    mockPaymentIntentsCreate,
  };
});

describe("Payments API", () => {
  // Import mocks after setup
  const { mockPaymentIntentsCreate } = jest.requireMock("../../utils/stripe");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/payments/create-payment-intent", () => {
    it("should create a payment intent", async () => {
      // Mock Stripe response
      const mockClientSecret = "pi_test_secret_123";
      mockPaymentIntentsCreate.mockResolvedValueOnce({
        client_secret: mockClientSecret,
      });

      const payload = {
        items: [
          { id: "1", price: 10000, quantity: 2 },
          { id: "2", price: 20000, quantity: 1 },
        ],
      };

      const expectedAmount = 40000; // (10000*2 + 20000*1) - we use higher amounts to avoid Stripe minimum amount error

      const response = await request(app)
        .post("/api/payments/create-payment-intent")
        .send(payload)
        .expect("Content-Type", /json/)
        .expect(200);

      // Verify Stripe was called with correct parameters
      expect(mockPaymentIntentsCreate).toHaveBeenCalledWith({
        amount: expectedAmount,
        automatic_payment_methods: { enabled: true },
        currency: "CLP",
      });

      expect(response.body).toHaveProperty("clientSecret", mockClientSecret);
    });

    it("should return 400 for invalid request body", async () => {
      // Invalid payload format (no items)
      const invalidPayload = {};

      await request(app)
        .post("/api/payments/create-payment-intent")
        .send(invalidPayload)
        .expect(400);
    });

    it("should return 400 for items with invalid properties", async () => {
      // Payload with invalid item properties
      const invalidPayload = {
        items: [
          { id: "1", price: -100, quantity: 2 }, // negative price
        ],
      };

      await request(app)
        .post("/api/payments/create-payment-intent")
        .send(invalidPayload)
        .expect(400);
    });
  });
});
