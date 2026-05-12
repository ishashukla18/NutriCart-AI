const express = require("express");

const {
  getMealSuggestions,
} = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/meal-suggestions",
  protect,
  getMealSuggestions
);

module.exports = router;
