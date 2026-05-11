const PantryItem = require("../models/PantryItem");
const Recipe = require("../models/Recipe");
const MealPlan = require("../models/MealPlan");
const GroceryList = require("../models/GroceryList");

const getDashboardSummary = async (req, res) => {
  try {
    const { weekStartDate } = req.query;


    const totalPantryItems =
      await PantryItem.countDocuments({
        userId: req.user._id,
      });

    const totalRecipes =
      await Recipe.countDocuments({
        userId: req.user._id,
      });


    const today = new Date();

    const nextSevenDays = new Date();

    nextSevenDays.setDate(
      today.getDate() + 7
    );

    const expiringItems =
      await PantryItem.find({
        userId: req.user._id,
        expiryDate: {
          $gte: today,
          $lte: nextSevenDays,
        },
      });


    const lowStockItems =
      await PantryItem.find({
        userId: req.user._id,
        $expr: {
          $lte: [
            "$quantity",
            "$minimumStock",
          ],
        },
      });


    const pantryItems =
      await PantryItem.find({
        userId: req.user._id,
      });

    let healthyItems = 0;

    pantryItems.forEach((item) => {
      const isExpired =
        item.expiryDate &&
        new Date(item.expiryDate) <
          new Date();

      const isLow =
        item.quantity <=
        item.minimumStock;

      if (!isExpired && !isLow) {
        healthyItems++;
      }
    });

    const pantryHealthScore =
      pantryItems.length > 0
        ? Math.round(
            (healthyItems /
              pantryItems.length) *
              100
          )
        : 0;


    let moneySavedEstimate = 0;

    pantryItems.forEach((item) => {
      moneySavedEstimate +=
        (item.price || 0) *
        (item.quantity || 0);
    });


    const recipes = await Recipe.find({
      userId: req.user._id,
    });

    let weeklyNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    recipes.forEach((recipe) => {
      weeklyNutrition.calories +=
        recipe.nutrition?.calories || 0;

      weeklyNutrition.protein +=
        recipe.nutrition?.protein || 0;

      weeklyNutrition.carbs +=
        recipe.nutrition?.carbs || 0;

      weeklyNutrition.fat +=
        recipe.nutrition?.fat || 0;
    });


    const smartInsights = [];

    if (lowStockItems.length >= 5) {
      smartInsights.push(
        "Many pantry items are running low."
      );
    }

    if (expiringItems.length >= 3) {
      smartInsights.push(
        "Several items may expire this week."
      );
    }

    if (totalRecipes < 5) {
      smartInsights.push(
        "Add more recipes for better meal planning."
      );
    }

    if (pantryHealthScore >= 80) {
      smartInsights.push(
        "Your pantry health looks excellent."
      );
    }


    const recentPantry =
      await PantryItem.find({
        userId: req.user._id,
      })
        .sort({ updatedAt: -1 })
        .limit(5);

    const recentRecipes =
      await Recipe.find({
        userId: req.user._id,
      })
        .sort({ updatedAt: -1 })
        .limit(5);

    const recentActivity = [
      ...recentPantry.map((item) => ({
        type: "Pantry",
        text: `${item.name} updated`,
        time: item.updatedAt,
      })),

      ...recentRecipes.map((recipe) => ({
        type: "Recipe",
        text: `${recipe.title} modified`,
        time: recipe.updatedAt,
      })),
    ];

    recentActivity.sort(
      (a, b) =>
        new Date(b.time) -
        new Date(a.time)
    );


    let plannedMeals = 0;

    let groceryItems = 0;

    let purchasedItems = 0;

    if (weekStartDate) {
      const mealPlan =
        await MealPlan.findOne({
          userId: req.user._id,
          weekStartDate,
        });

      if (mealPlan) {
        plannedMeals =
          mealPlan.entries.length;
      }

      const groceryList =
        await GroceryList.findOne({
          userId: req.user._id,
          weekStartDate,
        });

      if (groceryList) {
        groceryItems =
          groceryList.items.length;

        purchasedItems =
          groceryList.items.filter(
            (item) => item.purchased
          ).length;
      }
    }


    res.json({
      totalPantryItems,
      totalRecipes,

      expiringItemsCount:
        expiringItems.length,

      expiringItems,

      lowStockItems,

      lowStockCount:
        lowStockItems.length,

      pantryHealthScore,

      moneySavedEstimate,

      weeklyNutrition,

      smartInsights,

      recentActivity,

      plannedMeals,

      groceryItems,

      purchasedItems,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch dashboard summary",
    });
  }
};

module.exports = {
  getDashboardSummary,
};
