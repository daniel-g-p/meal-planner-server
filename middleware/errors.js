import config from "../config/index.js";

export const tryCatch = (controllerFunction) => {
  return async (req, res, next) => {
    try {
      return controllerFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const errorHandler = (error, req, res, next) => {
  if (config.nodeEnv === "development") {
    console.error(error);
  }
  return res.status(500).send("An error ocurred.");
};

export const catchAllRoute = (req, res, next) => {
  return res.status(404).send("Page not found.");
};
