const mongoose = require("mongoose");

// ==========================================
// INGREDIENT SCHEMA
// ==========================================

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// ==========================================
// NUTRITION SCHEMA
// ==========================================

const nutritionSchema = new mongoose.Schema(
  {
    calories: {
      type: Number,
      default: 0,
      min: 0,
    },

    protein: {
      type: Number,
      default: 0,
      min: 0,
    },

    carbs: {
      type: Number,
      default: 0,
      min: 0,
    },

    fat: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

// ==========================================
// RECIPE SCHEMA
// ==========================================

const recipeSchema = new mongoose.Schema(
  {
    // ======================================
    // USER
    // ======================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ======================================
    // BASIC DETAILS
    // ======================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    // ======================================
    // MEAL INFO
    // ======================================

    mealType: {
      type: String,
      enum: [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snack",
      ],
      default: "Lunch",
    },

    prepTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    servings: {
      type: Number,
      default: 1,
      min: 1,
    },

    difficulty: {
      type: String,
      enum: [
        "Easy",
        "Medium",
        "Hard",
      ],
      default: "Easy",
    },

    // ======================================
    // INGREDIENTS
    // ======================================

    ingredients: {
      type: [ingredientSchema],

      required: true,

      validate: {
        validator: function (value) {
          return value.length > 0;
        },

        message:
          "At least one ingredient is required",
      },
    },

    // ======================================
    // STEPS
    // ======================================

    steps: {
      type: [String],
      default: [],
    },

    // ======================================
    // TAGS
    // ======================================

    tags: {
      type: [String],
      default: [],
    },

    // ======================================
    // NUTRITION
    // ======================================

    nutrition: {
      type: nutritionSchema,

      default: () => ({}),
    },

    // ======================================
    // SMART ANALYTICS
    // ======================================

    cookCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastCooked: {
      type: Date,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    healthScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ======================================
    // SYSTEM FIELDS
    // ======================================

    createdByAI: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// AUTO DIFFICULTY + HEALTH SCORE
// ==========================================

recipeSchema.pre("save", function () {

  const ingredientCount =
    this.ingredients?.length || 0;

  const stepCount =
    this.steps?.length || 0;

  // ======================================
  // AUTO DIFFICULTY
  // ======================================

  if (
    ingredientCount <= 5 &&
    stepCount <= 3 &&
    this.prepTime <= 15
  ) {

    this.difficulty = "Easy";

  }

  else if (
    ingredientCount <= 10 &&
    stepCount <= 6 &&
    this.prepTime <= 35
  ) {

    this.difficulty = "Medium";

  }

  else {

    this.difficulty = "Hard";

  }

  // ======================================
  // AUTO HEALTH SCORE
  // ======================================

  let score = 50;

  // protein bonus

  if (this.nutrition?.protein >= 15) {
    score += 20;
  }

  // balanced carbs

  if (this.nutrition?.carbs <= 40) {
    score += 10;
  }

  // high fat penalty

  if (this.nutrition?.fat >= 25) {
    score -= 15;
  }

  // calorie balance

  if (
    this.nutrition?.calories >= 200 &&
    this.nutrition?.calories <= 600
  ) {
    score += 15;
  }

  // healthy tags

  const healthyTags = [
    "healthy",
    "protein",
    "low-carb",
    "high-fiber",
    "diet",
  ];

  const matchedHealthyTags =
    this.tags.filter((tag) =>
      healthyTags.includes(
        tag.toLowerCase()
      )
    );

  score += matchedHealthyTags.length * 2;

  // clamp score

  score = Math.max(
    0,
    Math.min(score, 100)
  );

  this.healthScore = score;

});

// ==========================================
// EXPORT
// ==========================================

module.exports = mongoose.model(
  "Recipe",
  recipeSchema
);