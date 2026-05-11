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


router.get(
  "/smart-recipes",
  protect,
  getSmartRecipes
);


router.put(
  "/cook/:id",
  protect,
  cookRecipe
);


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
