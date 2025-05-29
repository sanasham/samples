import request from "supertest";
import { createApp } from "../../app";
import { HealthController } from "../../controllers/health.controller";
import { HealthService } from "@services/health.service";
import { Express } from "express";
jest.mock("@services/health.service");

describe("HealthController", () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe("GET /health", () => {
    it("should return 200 and health status", async () => {
      const mockHealthStatus = {
        status: "OK",
        timestamp: "2023-01-01T00:00:00.000Z",
      };

      (HealthService.getHealthStatus as jest.Mock).mockResolvedValue(
        mockHealthStatus,
      );

      const response = await request(app).get("/health");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockHealthStatus);
    });
  });

  describe("GET /health/ready", () => {
    it("should return 200 and readiness status", async () => {
      const mockReadinessStatus = {
        status: "READY",
        timestamp: "2023-01-01T00:00:00.000Z",
        details: {
          database: "connected",
        },
      };

      (HealthService.getReadinessStatus as jest.Mock).mockResolvedValue(
        mockReadinessStatus,
      );

      const response = await request(app).get("/health/ready");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReadinessStatus);
    });
  });
});
