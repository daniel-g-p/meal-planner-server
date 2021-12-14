import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";
import controller from "../controllers/ingredients.js";

const router = Router();

router.route("/").get(tryCatch(controller.getAllIngredients));

export default router;
