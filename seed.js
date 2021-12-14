import newIngredient from "./models/ingredient.js";

import { connectToDatabase, db } from "./utilities/database.js";

const randomString = (length = 10) => {
  let string = "";
  for (let i = 0; i < length; i++) {
    string += Math.floor(Math.random() * 10);
  }
  return string;
};

const randomNumber = (min, max, decimals = 0) => {
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
      randomString(10),
      randomUnit(),
      randomNumber(0, 99, 1),
      randomNumber(0, 99, 1),
      randomNumber(0, 99, 1),
      randomNumber(0, 99, 1),
      randomNumber(0, 99, 1)
    );
    await db.create("ingredients", ingredient);
  }
  console.log("Ingredients seeded.");
};

const seed = async () => {
  await connectToDatabase();
  await seedIngredients(5);
  console.log("Database seeded.");
  process.exit();
};

seed();
