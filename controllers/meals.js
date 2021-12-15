import meals from "../services/meals.js";

export default {
  getAllMeals: async (req, res, next) => {
    const mealList = await meals.getAllMeals();
    const fullMealList = await meals.addIngredientNames(mealList);
    return res.status(200).json({ meals: fullMealList });
  },
  addMeal: async (req, res, next) => {
    const { meal } = req.body;
    const { valid, data, error } = meals.validateMeal(meal);
    if (!valid) {
      return res.status(400).json({ error });
    }
    const nameIsAvailable = await meals.checkForDuplicateName(data.name);
    if (!nameIsAvailable) {
      return res
        .status(400)
        .json({ error: "Another meal with that name already exists." });
    }
    const result = await meals.createMeal(data);
    if (!result.acknowledged) {
      return res.status(500).json({
        error: "Couldn't add the new meal, please try again later.",
      });
    }
    return res.status(200).json({ ok: true });
  },
  editMeal: async (req, res, next) => {
    const { mealId } = req.params;
    const { meal } = req.body;
    const { valid, data, error } = meals.validateMeal(meal);
    if (!valid) {
      return res.status(400).json({ error });
    }
    const nameIsAvailable = await meals.checkForDuplicateName(
      data.name,
      mealId
    );
    if (!nameIsAvailable) {
      return res
        .status(400)
        .json({ error: "Another meal with that name already exists." });
    }
    const result = await meals.editMeal(mealId, data);
    if (!result.acknowledged) {
      return res.status(500).json({
        error: "Couldn't apply the change meal, please try again later.",
      });
    }
    return res.status(200).json({ ok: true });
  },
  deleteMeal: async (req, res, next) => {
    const { mealId } = req.params;
    const result = await meals.deleteMeal(mealId);
    if (!result.acknowledged) {
      return res.status(500).json({
        error: "Couldn't delete the meal, please try again later.",
      });
    }
    return res.status(200).json({ ok: true });
  },
};
