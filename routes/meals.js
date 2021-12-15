import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";
import controller from "../controllers/meals.js";

const router = Router();

router
  .route("/")
  .get(tryCatch(controller.getAllMeals))
  .post(tryCatch(controller.addMeal));

router
  .route("/:mealId")
  .put(tryCatch(controller.editMeal))
  .delete(tryCatch(controller.deleteMeal));

export default router;