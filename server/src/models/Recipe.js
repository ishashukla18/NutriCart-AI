const mongoose = require("mongoose");


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


const recipeSchema = new mongoose.Schema(
  {

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


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


    steps: {
      type: [String],
      default: [],
    },


    tags: {
      type: [String],
      default: [],
    },


    nutrition: {
      type: nutritionSchema,

      default: () => ({}),
    },


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


    createdByAI: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


recipeSchema.pre("save", function () {

  const ingredientCount =
    this.ingredients?.length || 0;

  const stepCount =
    this.steps?.length || 0;


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


  let score = 50;


  if (this.nutrition?.protein >= 15) {
    score += 20;
  }


  if (this.nutrition?.carbs <= 40) {
    score += 10;
  }


  if (this.nutrition?.fat >= 25) {
    score -= 15;
  }


  if (
    this.nutrition?.calories >= 200 &&
    this.nutrition?.calories <= 600
  ) {
    score += 15;
  }


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


  score = Math.max(
    0,
    Math.min(score, 100)
  );

  this.healthScore = score;

});


module.exports = mongoose.model(
  "Recipe",
  recipeSchema
);
