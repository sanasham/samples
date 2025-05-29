export class HealthService {
  public static async getHealthStatus() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  }

  public static async getReadinessStatus() {
    // Add your readiness checks here (database connection, etc.)
    return {
      status: "READY",
      timestamp: new Date().toISOString(),
      details: {
        database: "connected", // This would be dynamic in a real app
      },
    };
  }
}
