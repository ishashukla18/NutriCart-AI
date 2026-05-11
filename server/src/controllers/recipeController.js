const Recipe = require("../models/Recipe");
const PantryItem = require("../models/PantryItem");


const getRecipes = async (req, res) => {
  try {

    const recipes = await Recipe.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(recipes);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch recipes",
    });

  }
};


const getRecipeById = async (req, res) => {
  try {

    const recipe = await Recipe.findById(
      req.params.id
    );

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    if (
      recipe.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    res.json(recipe);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch recipe",
    });

  }
};


const createRecipe = async (req, res) => {
  try {

    const {
      title,
      description,
      mealType,
      prepTime,
      servings,
      ingredients,
      steps,
      tags,
      nutrition,
      image,
    } = req.body;

    if (
      !title ||
      !ingredients ||
      ingredients.length === 0
    ) {
      return res.status(400).json({
        message:
          "Title and at least one ingredient are required",
      });
    }

    const recipe = await Recipe.create({
      userId: req.user._id,
      title,
      description,
      mealType,
      prepTime,
      servings,
      ingredients,
      steps,
      tags,
      nutrition,
      image,
    });

    res.status(201).json(recipe);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to create recipe",
    });

  }
};


const updateRecipe = async (req, res) => {
  try {

    const recipe = await Recipe.findById(
      req.params.id
    );

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    if (
      recipe.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const updatedRecipe =
      await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.json(updatedRecipe);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to update recipe",
    });

  }
};


const deleteRecipe = async (req, res) => {
  try {

    const recipe = await Recipe.findById(
      req.params.id
    );

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    if (
      recipe.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await recipe.deleteOne();

    res.json({
      message:
        "Recipe deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to delete recipe",
    });

  }
};


const getSmartRecipes = async (req, res) => {
  try {

    const pantryItems = await PantryItem.find({
      userId: req.user._id,
    });

    const recipes = await Recipe.find({
      userId: req.user._id,
    });

    const smartRecipes = recipes.map((recipe) => {

      let matchedCount = 0;

      const missingIngredients = [];

      recipe.ingredients.forEach((ingredient) => {

        const pantryItem = pantryItems.find(
          (item) =>
            item.name.trim().toLowerCase() ===
            ingredient.name.trim().toLowerCase()
        );

        if (
          !pantryItem ||
          pantryItem.quantity < ingredient.quantity
        ) {

          missingIngredients.push(
            ingredient.name
          );

          return;
        }

        matchedCount++;
      });

      const totalIngredients =
        recipe.ingredients.length;

      const matchPercentage =
        Math.round(
          (matchedCount /
            totalIngredients) * 100
        );

      return {
        ...recipe.toObject(),

        matchedCount,

        totalIngredients,

        matchPercentage,

        missingIngredients,

        canCookNow:
          missingIngredients.length === 0,
      };
    });

    smartRecipes.sort(
      (a, b) =>
        b.matchPercentage -
        a.matchPercentage
    );

    res.json(smartRecipes);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch smart recipes",
    });

  }
};


const cookRecipe = async (req, res) => {
  try {

    const recipe = await Recipe.findById(
      req.params.id
    );

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    if (
      recipe.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const pantryItems = await PantryItem.find({
      userId: req.user._id,
    });

    const missingIngredients = [];


    for (const ingredient of recipe.ingredients) {

      const pantryItem = pantryItems.find(
        (item) =>
          item.name.trim().toLowerCase() ===
          ingredient.name.trim().toLowerCase()
      );

      if (
        !pantryItem ||
        pantryItem.quantity < ingredient.quantity
      ) {

        missingIngredients.push(
          ingredient.name
        );
      }
    }

    if (missingIngredients.length > 0) {

      return res.status(400).json({
        message:
          "Not enough: " +
          missingIngredients.join(", "),
      });
    }


    for (const ingredient of recipe.ingredients) {

      const pantryItem = pantryItems.find(
        (item) =>
          item.name.trim().toLowerCase() ===
          ingredient.name.trim().toLowerCase()
      );

      if (pantryItem) {

        pantryItem.quantity =
          pantryItem.quantity -
          ingredient.quantity;

        pantryItem.usageCount =
          (pantryItem.usageCount || 0) + 1;

        pantryItem.lastUsedAt =
          new Date();

        if (pantryItem.quantity <= 0) {

          await pantryItem.deleteOne();

        } else {

          await pantryItem.save();
        }
      }
    }


    recipe.cookCount =
      (recipe.cookCount || 0) + 1;

    recipe.lastCooked = new Date();

    await recipe.save();

    res.json({
      success: true,
      message:
        "Recipe cooked successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to cook recipe",
    });

  }
};


module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getSmartRecipes,
  cookRecipe,
};
