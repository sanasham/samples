import request from "supertest";
import { createApp } from "../../app";
import { Express } from "express";

describe("Health Routes", () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe("GET /health", () => {
    it("should return 200 OK", async () => {
      const response = await request(app).get("/health");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /health/ready", () => {
    it("should return 200 OK", async () => {
      const response = await request(app).get("/health/ready");
      expect(response.status).toBe(200);
    });
  });
});
