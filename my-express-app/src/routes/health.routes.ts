import { Router } from "express";
import { HealthController } from "../controllers/health.controller";

const router = Router();

router.get("/", HealthController.healthCheck);
router.get("/ready", HealthController.readinessCheck);

export default router;
