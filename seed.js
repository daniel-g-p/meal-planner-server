import newIngredient from "./models/ingredient.js";
import newMeal from "./models/meal.js";

import { connectToDatabase, db } from "./utilities/database.js";

const log = (message) => {
  console.log(message);
};

const randomString = (minLength = 7, maxLength = 13) => {
  let string = "";
  const length = randomNumber(minLength, maxLength);
  for (let i = 0; i < length; i++) {
    string += Math.floor(Math.random() * 10);
  }
  return string;
};

const randomNumber = (min = 0, max = 1, decimals = 0) => {
  const range = max - min;
  const multiplier = decimals * 10 || 1;
  return Math.floor(Math.random() * range * multiplier + min) / multiplier;
};

const randomUnit = () => {
  const units = ["100g", "100ml", "tbsp", "tsp", "unit"];
  return units[randomNumber(0, units.length - 1)];
};

const seedIngredients = async (numberOfIngredients) => {
  await db.delete("ingredients", {});
  for (let i = 0; i < numberOfIngredients; i++) {
    const ingredient = newIngredient(
      randomString(),
      randomUnit(),
      randomNumber(0, 99, 1),
      randomNumber(0, 99, 1),
      randomNumber(0, 99, 1),
      randomNumber(0, 99, 1),
      randomNumber(0, 99, 1)
    );
    await db.create("ingredients", ingredient);
  }
  log("Ingredients seeded.");
};

const seedMeals = async (numberOfMeals) => {
  await db.delete("meals", {});
  const ingredients = await db.find("ingredients", {});
  for (let i = 0; i < numberOfMeals; i++) {
    const mealIngredients = [];
    for (let j = 0; j < 5; j++) {
      const index = randomNumber(0, ingredients.length);
      mealIngredients.push({
        id: ingredients[index]._id.toString(),
        quantity: randomNumber(5, 20),
      });
    }
    const meal = newMeal(randomString(7, 13), mealIngredients);
    console.log(meal);
    await db.create("meals", meal);
  }
  log("Meals seeded.");
};

const seed = async () => {
  await connectToDatabase();
  await seedIngredients(5);
  await seedMeals(5);
  log("Database seeded.");
  process.exit();
};

seed();
