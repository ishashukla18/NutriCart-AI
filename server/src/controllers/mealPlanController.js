const MealPlan = require("../models/MealPlan");
const Recipe = require("../models/Recipe");
const PantryItem = require("../models/PantryItem");

const getMealPlanByWeek = async (req, res) => {
  try {

    const mealPlan = await MealPlan.findOne({
      userId: req.user._id,
      weekStartDate: req.params.weekStartDate,
    }).populate("entries.recipeId");

    if (!mealPlan) {
      return res.status(404).json({
        message: "Meal plan not found for this week",
      });
    }

    res.json(mealPlan);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch meal plan",
    });

  }
};

const createMealPlan = async (req, res) => {
  try {

    const { weekStartDate, entries } = req.body;

    if (!weekStartDate) {
      return res.status(400).json({
        message: "Week start date is required",
      });
    }

    let existingPlan = await MealPlan.findOne({
      userId: req.user._id,
      weekStartDate,
    });

    if (existingPlan) {

      existingPlan.entries = entries;

      await existingPlan.save();

      const updatedPlan =
        await MealPlan.findById(existingPlan._id)
          .populate("entries.recipeId");

      return res.json(updatedPlan);
    }

    const mealPlan = await MealPlan.create({
      userId: req.user._id,
      weekStartDate,
      entries,
    });

    const populatedMealPlan =
      await MealPlan.findById(mealPlan._id)
        .populate("entries.recipeId");

    res.status(201).json(populatedMealPlan);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const updateMealPlan = async (req, res) => {
  try {

    const mealPlan = await MealPlan.findById(
      req.params.id
    );

    if (!mealPlan) {
      return res.status(404).json({
        message: "Meal plan not found",
      });
    }

    if (
      mealPlan.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    mealPlan.weekStartDate =
      req.body.weekStartDate ||
      mealPlan.weekStartDate;

    mealPlan.entries =
      req.body.entries ||
      mealPlan.entries;

    const updatedMealPlan =
      await mealPlan.save();

    const populatedMealPlan =
      await MealPlan.findById(
        updatedMealPlan._id
      ).populate("entries.recipeId");

    res.json(populatedMealPlan);

  } catch (error) {

    res.status(500).json({
      message: "Failed to update meal plan",
    });

  }
};

const getMealPlanInsights = async (
  req,
  res
) => {
  try {

    const mealPlan = await MealPlan.findOne({
      userId: req.user._id,
      weekStartDate: req.params.weekStartDate,
    }).populate("entries.recipeId");

    if (!mealPlan) {
      return res.status(404).json({
        message: "Meal plan not found",
      });
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const pantryItems =
      await PantryItem.find({
        userId: req.user._id,
      });

    const pantryNames = pantryItems.map(
      (item) =>
        item.name.toLowerCase()
    );

    const smartSuggestions = [];

    // ====================================
    // EXPIRY ALERTS
    // ====================================

    const expiringItems =
      pantryItems.filter((item) => {

        if (!item.expiryDate)
          return false;

        const diff =
          Math.ceil(
            (
              new Date(item.expiryDate) -
              new Date()
            ) /
            (1000 * 60 * 60 * 24)
          );

        return diff >= 0 && diff <= 3;
      });

    if (expiringItems.length > 0) {

      smartSuggestions.push({
        type: "expiry",
        recipe: "Expiry Alert",
        value:
          `${expiringItems.length} pantry items should be used soon`,
      });

    }

    // ====================================
    // MEAL ANALYSIS
    // ====================================

    let totalIngredients = 0;
    let matchedIngredients = 0;

    mealPlan.entries.forEach((entry) => {

      const recipe = entry.recipeId;

      if (!recipe) return;

      totalCalories +=
        recipe.nutrition?.calories || 0;

      totalProtein +=
        recipe.nutrition?.protein || 0;

      totalCarbs +=
        recipe.nutrition?.carbs || 0;

      totalFat +=
        recipe.nutrition?.fat || 0;

      totalIngredients +=
        recipe.ingredients?.length || 0;

      matchedIngredients +=
        recipe.ingredients.filter(
          (ingredient) =>
            pantryNames.includes(
              ingredient.name.toLowerCase()
            )
        ).length;

    });

    // ====================================
    // PANTRY COMPATIBILITY
    // ====================================

    const pantryMatch =
      totalIngredients > 0
        ? Math.round(
            (
              matchedIngredients /
              totalIngredients
            ) * 100
          )
        : 0;

    smartSuggestions.push({
      type: "pantry-score",
      recipe:
        "Pantry Compatibility",
      value:
        `${pantryMatch}% ingredients already available`,
    });

    // ====================================
    // LOW PROTEIN
    // ====================================

    if (totalProtein < 120) {

      smartSuggestions.push({
        type: "protein",
        recipe: "Protein Alert",
        value:
          "Protein intake is low this week",
      });

    }

    // ====================================
    // LOW CALORIES
    // ====================================

    if (totalCalories < 7000) {

      smartSuggestions.push({
        type: "calories",
        recipe: "Calorie Alert",
        value:
          "Weekly calorie intake looks low",
      });

    }

    // ====================================
    // HEALTH SCORE
    // ====================================

    if (
      totalProtein >= 120 &&
      totalCalories <= 14000
    ) {

      smartSuggestions.push({
        type: "healthy",
        recipe: "Balanced Meal Plan",
        value:
          "Good nutrition balance detected",
      });

    }

    // ====================================
    // GROCERY DEPENDENCY
    // ====================================

    if (pantryMatch < 60) {

      smartSuggestions.push({
        type: "warning",
        recipe: "High Grocery Usage",
        value:
          "You may need many grocery items this week",
      });

    }

    // ====================================
    // MEAL DIVERSITY
    // ====================================

    const uniqueRecipes =
      new Set(
        mealPlan.entries.map(
          (entry) =>
            entry.recipeId?.title
        )
      );

    if (
      uniqueRecipes.size < 4 &&
      mealPlan.entries.length > 5
    ) {

      smartSuggestions.push({
        type: "diversity",
        recipe: "Low Meal Variety",
        value:
          "Try adding more meal variety",
      });

    }

    // ====================================
    // FINAL RESPONSE
    // ====================================

    res.json({

      nutrition: {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
      },

      smartSuggestions,

    });

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to fetch meal plan insights",
    });

  }
};

module.exports = {
  getMealPlanByWeek,
  createMealPlan,
  updateMealPlan,
  getMealPlanInsights,
};