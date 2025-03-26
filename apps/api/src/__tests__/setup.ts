import dotenv from "dotenv";

// Test environment setup
dotenv.config({ path: "../.env" });

// Mock Stripe API key
process.env.STRIPE_SECRET_KEY = "sk_test_mock_key";

// Stripe mock functions
const mockPaymentIntentsCreate = jest.fn();
const mockRefundsCreate = jest.fn();

// Export mocks for tests
export const stripeMocks = {
  paymentIntentsCreate: mockPaymentIntentsCreate,
  refundsCreate: mockRefundsCreate,
};

// Mock Stripe module
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: { create: mockPaymentIntentsCreate },
    refunds: { create: mockRefundsCreate },
  }));
});

// Prevent server from actually listening
jest.mock("../index", () => {
  const originalModule = jest.requireActual("../index");
  return {
    ...originalModule,
    app: {
      ...originalModule.app,
      listen: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
    },
  };
});

afterEach(async () => {
  jest.clearAllMocks();
});
