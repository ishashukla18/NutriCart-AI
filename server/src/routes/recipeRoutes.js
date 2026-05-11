const express = require("express");

const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getSmartRecipes,
  cookRecipe,
} = require("../controllers/recipeController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* ========================= */
/* SMART RECIPES */
/* ========================= */

router.get(
  "/smart-recipes",
  protect,
  getSmartRecipes
);

/* ========================= */
/* COOK NOW */
/* ========================= */

router.put(
  "/cook/:id",
  protect,
  cookRecipe
);

/* ========================= */
/* MAIN ROUTES */
/* ========================= */

router
  .route("/")
  .get(protect, getRecipes)
  .post(protect, createRecipe);

router
  .route("/:id")
  .get(protect, getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;