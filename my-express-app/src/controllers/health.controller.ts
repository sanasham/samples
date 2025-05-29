import { Request, Response } from "express";
import { HealthService } from "../services/health.service";

export class HealthController {
  public static async healthCheck(req: Request, res: Response) {
    const healthStatus = await HealthService.getHealthStatus();
    res.status(200).json(healthStatus);
  }

  public static async readinessCheck(req: Request, res: Response) {
    const readinessStatus = await HealthService.getReadinessStatus();
    res.status(200).json(readinessStatus);
  }
}
