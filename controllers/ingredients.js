import ingredients from "../services/ingredients.js";

export default {
  getAllIngredients: async (req, res, next) => {
    const ingredientList = await ingredients.getAllIngredients();
    return res.status(200).json({ ingredientList });
  },
  addIngredient: async (req, res, next) => {
    const { ingredient } = req.body;
    const { valid, data, error } = ingredients.validateIngredient(ingredient);
    if (!valid) {
      return res.status(400).json({ error });
    }
    const nameIsAvailable = await ingredients.checkForDuplicateName(data.name);
    if (!nameIsAvailable) {
      return res
        .status(400)
        .json({ error: "Another ingredient with that name already exists." });
    }
    const result = await ingredients.createIngredient(data);
    if (!result.acknowledged) {
      return res.status(500).json({
        error: "Couldn't add the new ingredient, please try again later.",
      });
    }
    return res.status(200).json({ ok: true });
  },
  editIngredient: async (req, res, next) => {
    const { ingredientId } = req.params;
    const { ingredient } = req.body;
    const { valid, data, error } = ingredients.validateIngredient(ingredient);
    if (!valid) {
      return res.status(400).json({ error });
    }
    const nameIsAvailable = await ingredients.checkForDuplicateName(
      data.name,
      ingredientId
    );
    if (!nameIsAvailable) {
      return res
        .status(400)
        .json({ error: "Another ingredient with that name already exists." });
    }
    const result = await ingredients.editIngredient(ingredientId, data);
    if (!result.acknowledged) {
      return res.status(500).json({
        error: "Couldn't apply the change ingredient, please try again later.",
      });
    }
    return res.status(200).json({ ok: true });
  },
  deleteIngredient: async (req, res, next) => {
    const { ingredientId } = req.params;
    const result = await ingredients.deleteIngredient(ingredientId);
    if (!result.acknowledged) {
      return res.status(500).json({
        error: "Couldn't delete the ingredient, please try again later.",
      });
    }
    return res.status(200).json({ ok: true });
  },
};
