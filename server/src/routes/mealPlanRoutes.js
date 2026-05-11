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

/* ========================= */
/* CREATE / SAVE PLAN */
/* ========================= */

router.post(
  "/",
  protect,
  createMealPlan
);

/* ========================= */
/* GENERATE GROCERY */
/* ========================= */

router.post(
  "/generate-grocery",
  protect,
  generateGroceryList
);

/* ========================= */
/* INSIGHTS */
/* ========================= */

router.get(
  "/insights/:weekStartDate",
  protect,
  getMealPlanInsights
);

/* ========================= */
/* GET PLAN BY WEEK */
/* ========================= */

router.get(
  "/:weekStartDate",
  protect,
  getMealPlanByWeek
);

/* ========================= */
/* UPDATE PLAN */
/* ========================= */

router.put(
  "/update/:id",
  protect,
  updateMealPlan
);

module.exports = router;