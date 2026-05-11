const mongoose = require("mongoose");

const groceryItemSchema = new mongoose.Schema(
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
    estimatedPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    purchased: {
      type: Boolean,
      default: false,
    },
    skipped: {
  type: Boolean,
  default: false,
},

  category: {
  type: String,
  default: "Other",
},
  },
  { _id: false }
);

const groceryListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
    items: {
      type: [groceryItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GroceryList", groceryListSchema);
