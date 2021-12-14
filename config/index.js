import { config } from "dotenv";

config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "production",
  dbUrl: process.env.DB_URL || "mongodb://localhost:27017",
  dbName: process.env.DB_NAME || "test",
};
