import { HealthService } from "@services/health.service";

describe("HealthService", () => {
  describe("getHealthStatus", () => {
    it("should return health status", async () => {
      const result = await HealthService.getHealthStatus();
      expect(result).toHaveProperty("status", "OK");
      expect(result).toHaveProperty("timestamp");
    });
  });

  describe("getReadinessStatus", () => {
    it("should return readiness status", async () => {
      const result = await HealthService.getReadinessStatus();
      expect(result).toHaveProperty("status", "READY");
      expect(result).toHaveProperty("timestamp");
      expect(result).toHaveProperty("details");
      expect(result.details).toHaveProperty("database", "connected");
    });
  });
});
