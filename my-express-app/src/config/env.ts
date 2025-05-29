import dotenv from "dotenv";

dotenv.config();

interface Config {
  env: string;
  port: number;
}

const config: Config = {
  env: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "3000", 10),
};

export { config };
