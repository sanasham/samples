import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import winston from "winston";
import expressWinston from "express-winston";
import healthRoutes from "../src/routes/health.routes";
import { config } from "../src/config/env";

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logger
  if (config.env === "development") {
    app.use(morgan("dev"));
    app.use(
      expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json(),
        ),
      }),
    );
  }

  // Routes
  app.use("/health", healthRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });

  return app;
};
