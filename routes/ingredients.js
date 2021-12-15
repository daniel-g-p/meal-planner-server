import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";
import controller from "../controllers/ingredients.js";

const router = Router();

router
  .route("/")
  .get(tryCatch(controller.getAllIngredients))
  .post(tryCatch(controller.addIngredient));

router
  .route("/:ingredientId")
  .put(tryCatch(controller.editIngredient))
  .delete(tryCatch(controller.deleteIngredient));

export default router;
