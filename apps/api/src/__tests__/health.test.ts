import request from "supertest";
import app from "../app";

describe("Health Check API", () => {
  it("should return status ok", async () => {
    const response = await request(app)
      .get("/api/health")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("timestamp");
  });
});
