const express = require("express");

const {

  getPantryItems,

  createPantryItem,

  updatePantryItem,

  deletePantryItem,

  getExpiringItems,

  consumePantryItem,

  getSmartSuggestions,

} = require(
  "../controllers/pantryController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();


// =============================
// MAIN CRUD
// =============================

router
  .route("/")
  .get(protect, getPantryItems)
  .post(protect, createPantryItem);


// =============================
// EXPIRING
// =============================

router.get(
  "/expiring",
  protect,
  getExpiringItems
);


// =============================
// SMART SUGGESTIONS
// =============================

router.get(
  "/smart-suggestions",
  protect,
  getSmartSuggestions
);


// =============================
// CONSUME ITEM
// =============================

router.put(
  "/consume/:id",
  protect,
  consumePantryItem
);


// =============================
// UPDATE / DELETE
// =============================

router
  .route("/:id")
  .put(protect, updatePantryItem)
  .delete(protect, deletePantryItem);

module.exports = router;