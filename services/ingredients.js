import { db } from "../utilities/database.js";

export default {
  getAllIngredients: async () => {
    return await db.find("ingredients", {});
  },
};
