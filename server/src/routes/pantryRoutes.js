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



router
  .route("/")
  .get(protect, getPantryItems)
  .post(protect, createPantryItem);



router.get(
  "/expiring",
  protect,
  getExpiringItems
);



router.get(
  "/smart-suggestions",
  protect,
  getSmartSuggestions
);



router.put(
  "/consume/:id",
  protect,
  consumePantryItem
);



router
  .route("/:id")
  .put(protect, updatePantryItem)
  .delete(protect, deletePantryItem);

module.exports = router;
