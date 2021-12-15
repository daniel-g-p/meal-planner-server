import express from "express";
import cors from "cors";
import compression from "compression";

import config from "./config/index.js";
import { catchAllRoute, errorHandler } from "./middleware/errors.js";
import { connectToDatabase } from "./utilities/database.js";

import ingredients from "./routes/ingredients.js";
import meals from "./routes/meals.js";

const app = express();

app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/ingredients", ingredients);
app.use("/api/meals", meals);

app.use(catchAllRoute);
app.use(errorHandler);

const start = async () => {
  try {
    await connectToDatabase();
    app.listen(config.port, () => {
      if (config.nodeEnv === "development") {
        console.log(`Server running on http://localhost:${config.port}`);
      }
    });
  } catch (error) {
    if (config.nodeEnv === "development") {
      console.log(error);
    }
    process.exit();
  }
};

start();
