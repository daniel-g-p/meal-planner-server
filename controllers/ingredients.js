import ingredients from "../services/ingredients.js";

export default {
  getAllIngredients: async (req, res, next) => {
    const ingredientList = await ingredients.getAllIngredients();
    return res.status(200).json({ ingredientList });
  },
};
