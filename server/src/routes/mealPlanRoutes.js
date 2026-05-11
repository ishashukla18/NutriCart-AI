const express = require("express");

const {
  getMealPlanByWeek,
  createMealPlan,
  updateMealPlan,
  getMealPlanInsights,
} = require("../controllers/mealPlanController");

const {
  generateGroceryList,
} = require("../controllers/groceryListController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


router.post(
  "/",
  protect,
  createMealPlan
);


router.post(
  "/generate-grocery",
  protect,
  generateGroceryList
);


router.get(
  "/insights/:weekStartDate",
  protect,
  getMealPlanInsights
);


router.get(
  "/:weekStartDate",
  protect,
  getMealPlanByWeek
);


router.put(
  "/update/:id",
  protect,
  updateMealPlan
);

module.exports = router;
