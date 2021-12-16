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
          meal.ingredients[i].unit = savedIngredient.unit;
        } else {
          const newIngredient = await db.findById("ingredients", id, [
            "name",
            "unit",
          ]);
          if (!newIngredient) {
            notFoundIngredients.unshift(i);
          } else {
            savedIngredients.push(newIngredient);
            meal.ingredients[i].name = newIngredient.name;
            meal.ingredients[i].unit = newIngredient.unit;
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
    return validate(
      newMeal(meal.name, meal.ingredients),
      condition(meal.name, "Please enter a meal name."),
      condition(
        meal.ingredients.every((ingredient) => {
          return ingredient.id && ingredient.quantity;
        }),
        "Invalid ingredients."
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
