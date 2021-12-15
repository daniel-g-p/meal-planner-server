import { db } from "../utilities/database.js";
import { validate, condition } from "../utilities/validation.js";

import newMeal from "../models/meal.js";

export default {
  getAllMeals: async () => {
    return await db.find("meals", {}, [], { name: 1 });
  },
  addIngredientNames: async (meals) => {
    const savedIngredients = [];
    for (let meal of meals) {
      const notFoundIngredients = [];
      for (let i = 0; i < meal.ingredients.length; i++) {
        const { id } = meal.ingredients[i];
        const savedIngredient = savedIngredients.find((ingredient) => {
          return ingredient._id.toString() === id;
        });
        if (savedIngredient) {
          meal.ingredients[i].name = savedIngredient.name;
        } else {
          const newIngredient = await db.findById("ingredients", id, ["name"]);
          if (!newIngredient) {
            notFoundIngredients.unshift(i);
          } else {
            savedIngredients.push(newIngredient);
            meal.ingredients[i].name = newIngredient.name;
          }
        }
      }
      for (let index of notFoundIngredients) {
        meal.ingredients.splice(index, 1);
        const ingredientsWithoutName = meal.ingredients.map((ingredient) => {
          return { id: ingredient.id, quantity: ingredient.quantity };
        });
        await db.updateById("meals", meal._id.toString(), {
          ingredients: ingredientsWithoutName,
        });
      }
    }
    return meals;
  },
  validateMeal: (meal) => {
    const validUnits = ["100g", "100ml", "unit", "tsp", "tbsp"];
    const data = newMeal(
      meal.name,
      meal.unit || "100g",
      +meal.carbohydrates || 0,
      +meal.sugars || 0,
      +meal.fats || 0,
      +meal.saturatedFats || 0,
      +meal.protein || 0
    );
    return validate(
      data,
      condition(meal.name, "Please enter an meal name."),
      condition(
        validUnits.includes(meal.unit),
        "Please select a valid measuring unit."
      )
    );
  },
  checkForDuplicateName: async (name, mealId) => {
    const meals = await db.find("meals", { name }, ["_id"]);
    return (
      !meals.length ||
      meals.every((meal) => {
        return meal._id.toString() === mealId;
      })
    );
  },
  createMeal: async (meal) => {
    return await db.create("meals", meal);
  },
  editMeal: async (mealId, data) => {
    return await db.updateById("meals", mealId, data);
  },
  deleteMeal: async (mealId) => {
    return await db.deleteById("meals", mealId);
  },
};

const removeIngredientFromMeal = async (mealId, ingredientId) => {
  const { ingredients } = db.findById("meals", mealId, ["ingredients"]);
  const filteredIngredients = ingredients.filter((ingredient) => {
    return ingredient.id !== ingredientId;
  });
  return await db.updateById("meals", mealId, {
    ingredients: filteredIngredients,
  });
};
