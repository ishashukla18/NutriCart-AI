
const express = require("express");

const {
  generateGroceryList,
  getGroceryListByWeek,
  updateGroceryItemStatus,
  getGroceryAnalytics,
  getAiInsights,
} = require(
  "../controllers/groceryListController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


router.post(
  "/generate",
  protect,
  generateGroceryList
);


router.get(
  "/analytics/:weekStartDate",
  protect,
  getGroceryAnalytics
);


router.get(
  "/ai-insights/:weekStartDate",
  protect,
  getAiInsights
);


router.get(
  "/:weekStartDate",
  protect,
  getGroceryListByWeek
);


router.put(
  "/:id/item/:itemIndex",
  protect,
  updateGroceryItemStatus
);

module.exports = router;
