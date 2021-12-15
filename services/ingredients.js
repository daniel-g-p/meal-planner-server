import { db } from "../utilities/database.js";
import { validate, condition } from "../utilities/validation.js";

import newIngredient from "../models/ingredient.js";

export default {
  getAllIngredients: async () => {
    return await db.find("ingredients", {}, [], { name: 1 });
  },
  validateIngredient: (ingredient) => {
    const validUnits = ["100g", "100ml", "unit", "tsp", "tbsp"];
    const data = newIngredient(
      ingredient.name,
      ingredient.unit || "100g",
      +ingredient.carbohydrates || 0,
      +ingredient.sugars || 0,
      +ingredient.fats || 0,
      +ingredient.saturatedFats || 0,
      +ingredient.protein || 0
    );
    return validate(
      data,
      condition(ingredient.name, "Please enter an ingredient name."),
      condition(
        validUnits.includes(ingredient.unit),
        "Please select a valid measuring unit."
      )
    );
  },
  checkForDuplicateName: async (name, ingredientId) => {
    const ingredients = await db.find("ingredients", { name }, ["_id"]);
    return (
      !ingredients.length ||
      ingredients.every((ingredient) => {
        return ingredient._id.toString() === ingredientId;
      })
    );
  },
  createIngredient: async (ingredient) => {
    return await db.create("ingredients", ingredient);
  },
  editIngredient: async (ingredientId, data) => {
    return await db.updateById("ingredients", ingredientId, data);
  },
  deleteIngredient: async (ingredientId) => {
    return await db.deleteById("ingredients", ingredientId);
  },
};
