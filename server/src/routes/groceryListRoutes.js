// ==========================================
// routes/groceryRoutes.js
// ==========================================

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

// ==========================================
// GENERATE LIST
// ==========================================

router.post(
  "/generate",
  protect,
  generateGroceryList
);

// ==========================================
// ANALYTICS
// ==========================================

router.get(
  "/analytics/:weekStartDate",
  protect,
  getGroceryAnalytics
);

// ==========================================
// AI INSIGHTS
// ==========================================

router.get(
  "/ai-insights/:weekStartDate",
  protect,
  getAiInsights
);

// ==========================================
// GET LIST BY WEEK
// ==========================================

router.get(
  "/:weekStartDate",
  protect,
  getGroceryListByWeek
);

// ==========================================
// UPDATE ITEM
// ==========================================

router.put(
  "/:id/item/:itemIndex",
  protect,
  updateGroceryItemStatus
);

module.exports = router;