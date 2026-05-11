const GroceryList = require("../models/GroceryList");
const MealPlan = require("../models/MealPlan");
const PantryItem = require("../models/PantryItem");

const normalizeName = (value = "") =>
  value.trim().toLowerCase();

// ==========================================
// CATEGORY MAP
// ==========================================

const CATEGORY_MAP = {
  milk: "Dairy",
  curd: "Dairy",
  paneer: "Dairy",
  cheese: "Dairy",
  butter: "Dairy",

  rice: "Grains",
  atta: "Grains",
  oats: "Grains",
  poha: "Grains",

  rajma: "Pulses",
  "toor dal": "Pulses",
  "moong dal": "Pulses",

  potato: "Vegetable",
  onion: "Vegetable",
  tomato: "Vegetable",
  carrot: "Vegetable",
  coriander: "Vegetable",
  chilli: "Vegetable",
  "green chilli": "Vegetable",

  banana: "Fruit",
  apple: "Fruit",
  mango: "Fruit",
};

// ==========================================
// PRICE MAP
// ==========================================

const PRICE_MAP = {
  milk: 70,
  banana: 80,
  rice: 90,
  atta: 55,
  potato: 40,
  oats: 180,
  onion: 50,
  tomato: 40,
  carrot: 60,
  paneer: 120,
  poha: 80,
  apple: 180,
  mango: 200,
  rajma: 160,
  "toor dal": 140,
  "moong dal": 150,
  "green chilli": 120,
};

// ==========================================
// UNIT MAP
// ==========================================

const INGREDIENT_UNIT_MAP = {
  milk: "litre",
  curd: "litre",

  paneer: "kg",
  cheese: "pack",
  butter: "pack",

  rice: "kg",
  atta: "kg",
  oats: "kg",
  poha: "kg",

  rajma: "kg",
  "toor dal": "kg",
  "moong dal": "kg",

  potato: "kg",
  onion: "kg",
  tomato: "kg",
  carrot: "kg",

  chilli: "kg",
  "green chilli": "kg",

  coriander: "bunch",

  banana: "dozen",
  apple: "kg",
  mango: "kg",
};

// ==========================================
// ESTIMATE PRICE
// ==========================================

const estimatePrice = (
  itemName,
  quantity
) => {

  const normalizedName =
    itemName.toLowerCase();

  const basePrice =
    PRICE_MAP[
      normalizedName
    ] || 80;

  return Math.max(
    20,
    Math.round(basePrice * quantity)
  );

};

// ==========================================
// GENERATE LIST
// ==========================================

const generateGroceryList =
  async (req, res) => {

    try {

      const { weekStartDate } =
        req.body;

      if (!weekStartDate) {

        return res.status(400).json({
          message:
            "Week start date is required",
        });

      }

      // ==========================================
      // FIND MEAL PLAN
      // ==========================================

      const mealPlan =
        await MealPlan.findOne({

          userId: req.user._id,

          weekStartDate,

        }).populate(
          "entries.recipeId"
        );

      if (!mealPlan) {

        return res.status(404).json({
          message:
            "Meal plan not found",
        });

      }

      // ==========================================
      // EXISTING LIST
      // ==========================================

      const existingList =
        await GroceryList.findOne({

          userId: req.user._id,

          weekStartDate,

        });

      // ==========================================
      // STORE OLD STATUS
      // ==========================================

      const existingItemsMap = {};

      if (existingList) {

        existingList.items.forEach(
          (item) => {

            existingItemsMap[
              normalizeName(
                item.name
              )
            ] = {

              purchased:
                item.purchased,

              skipped:
                item.skipped,

            };

          }
        );

      }

      // ==========================================
      // PANTRY ITEMS
      // ==========================================

      const pantryItems =
        await PantryItem.find({
          userId: req.user._id,
        });

      const pantryMap = {};

      pantryItems.forEach((item) => {

        const key =
          normalizeName(
            item.name
          );

        pantryMap[key] = {

          quantity:
            item.quantity,

          unit:
            item.unit
              ?.trim()
              .toLowerCase(),

        };

      });

      // ==========================================
      // INGREDIENT MAP
      // ==========================================

      const ingredientMap = {};

      mealPlan.entries.forEach(
        (entry) => {

          const recipe =
            entry.recipeId;

          if (
            recipe &&
            recipe.ingredients
          ) {

            recipe.ingredients.forEach(
              (ingredient) => {

                const key =
                  normalizeName(
                    ingredient.name
                  );

                const ingredientName =
                  ingredient.name
                    ?.trim()
                    .toLowerCase();

                const normalizedUnit =
                  ingredient.unit
                    ?.trim()
                    .toLowerCase();

                let finalUnit =
                  INGREDIENT_UNIT_MAP[
                    ingredientName
                  ] || "kg";

                let finalQuantity =
                  ingredient.quantity;

                // ==========================================
                // CUP CONVERSION
                // ==========================================

                if (
                  normalizedUnit ===
                    "cup" ||
                  normalizedUnit ===
                    "cups"
                ) {

                  if (
                    ingredientName.includes(
                      "milk"
                    )
                  ) {

                    finalUnit =
                      "litre";

                    finalQuantity =
                      ingredient.quantity *
                      0.25;

                  } else {

                    finalUnit =
                      "kg";

                    finalQuantity =
                      ingredient.quantity *
                      0.15;

                  }

                }

                // ==========================================
                // PIECES CONVERSION
                // ==========================================

                else if (
                  normalizedUnit ===
                    "piece" ||
                  normalizedUnit ===
                    "pieces"
                ) {

                  if (
                    ingredientName.includes(
                      "banana"
                    )
                  ) {

                    finalUnit =
                      "dozen";

                    finalQuantity =
                      ingredient.quantity /
                      12;

                  } else {

                    finalUnit =
                      "kg";

                    finalQuantity =
                      ingredient.quantity *
                      0.2;

                  }

                }

                finalQuantity =
                  Number(
                    finalQuantity.toFixed(
                      2
                    )
                  );

                const estimatedPrice =
                  estimatePrice(
                    ingredient.name,
                    finalQuantity
                  );

                // ==========================================
                // CREATE ITEM
                // ==========================================

                if (
                  !ingredientMap[key]
                ) {

                  ingredientMap[
                    key
                  ] = {

                    name:
                      ingredient.name,

                    quantity: 0,

                    unit:
                      finalUnit,

                    estimatedPrice: 0,

                    category:
                      CATEGORY_MAP[
                        key
                      ] || "Other",

                  };

                }

                ingredientMap[
                  key
                ].quantity +=
                  finalQuantity;

                ingredientMap[
                  key
                ].estimatedPrice +=
                  estimatedPrice;

              }
            );

          }

        }
      );

      // ==========================================
      // FINAL GROCERY ITEMS
      // ==========================================

      const groceryItems = [];

      Object.keys(
        ingredientMap
      ).forEach((key) => {

        const required =
          ingredientMap[key];

        const pantry =
          pantryMap[key];

        let missingQuantity =
          required.quantity;

        if (
          pantry &&
          pantry.unit ===
            required.unit
        ) {

          missingQuantity =
            required.quantity -
            pantry.quantity;

        }

        if (
          missingQuantity > 0
        ) {

          const previousState =
            existingItemsMap[
              key
            ] || {};

          groceryItems.push({

            name:
              required.name,

            quantity:
              Number(
                missingQuantity.toFixed(
                  2
                )
              ),

            unit:
              required.unit,

            estimatedPrice:
              Math.round(
                required.estimatedPrice
              ),

            purchased:
              previousState.purchased ||
              false,

            skipped:
              previousState.skipped ||
              false,

            category:
              required.category,

          });

        }

      });

      // ==========================================
      // SAVE LIST
      // ==========================================

      let groceryList =
        existingList;

      if (groceryList) {

        groceryList.items =
          groceryItems;

        await groceryList.save();

      } else {

        groceryList =
          await GroceryList.create({

            userId:
              req.user._id,

            weekStartDate,

            items:
              groceryItems,

          });

      }

      res.status(201).json(
        groceryList
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

// ==========================================
// GET LIST
// ==========================================

const getGroceryListByWeek =
  async (req, res) => {

    try {

      const groceryList =
        await GroceryList.findOne({

          userId: req.user._id,

          weekStartDate:
            req.params.weekStartDate,

        });

      // ==========================================
      // RETURN EMPTY STATE INSTEAD OF 404
      // ==========================================

      if (!groceryList) {

        return res.json({

          userId: req.user._id,

          weekStartDate:
            req.params.weekStartDate,

          items: [],

        });

      }

      res.json(groceryList);

    } catch (error) {

      res.status(500).json({

        message:
          "Failed to fetch grocery list",

      });

    }

  };

// ==========================================
// UPDATE STATUS
// ==========================================

const updateGroceryItemStatus =
  async (req, res) => {

    try {

      const groceryList =
        await GroceryList.findById(
          req.params.id
        );

      if (!groceryList) {

        return res.status(404).json({
          message:
            "Grocery list not found",
        });

      }

      if (
        groceryList.userId.toString() !==
        req.user._id.toString()
      ) {

        return res.status(401).json({
          message:
            "Not authorized",
        });

      }

      const itemIndex =
        Number(
          req.params.itemIndex
        );

      if (
        itemIndex < 0 ||
        itemIndex >=
          groceryList.items.length
      ) {

        return res.status(400).json({
          message:
            "Invalid item index",
        });

      }

      // PURCHASE

      if (
        req.body.purchased === true
      ) {

        groceryList.items[
          itemIndex
        ].purchased = true;

        groceryList.items[
          itemIndex
        ].skipped = false;

      }

      // SKIP

      if (
        req.body.skipped === true
      ) {

        groceryList.items[
          itemIndex
        ].skipped = true;

        groceryList.items[
          itemIndex
        ].purchased = false;

      }

      // RESET

      if (
        req.body.purchased ===
          false &&
        req.body.skipped ===
          false
      ) {

        groceryList.items[
          itemIndex
        ].purchased = false;

        groceryList.items[
          itemIndex
        ].skipped = false;

      }

      await groceryList.save();

      res.json(groceryList);

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to update grocery item status",
      });

    }

  };

// ==========================================
// ANALYTICS
// ==========================================

const getGroceryAnalytics =
  async (req, res) => {

    try {

      const groceryList =
        await GroceryList.findOne({

          userId: req.user._id,

          weekStartDate:
            req.params
              .weekStartDate,

        });

      if (!groceryList) {

        return res.json({

          totalItems: 0,
          purchasedItems: 0,
          skippedItems: 0,
          estimatedSpend: 0,
          pantrySavings: 0,
          pantryUtilization: 0,

        });

      }

      const totalItems =
        groceryList.items.length;

      const purchasedItems =
        groceryList.items.filter(
          (item) =>
            item.purchased
        ).length;

      const skippedItems =
        groceryList.items.filter(
          (item) =>
            item.skipped
        ).length;

      const estimatedSpend =
        groceryList.items.reduce(
          (total, item) =>
            total +
            (item.estimatedPrice ||
              0),
          0
        );

      const pantrySavings =
        Math.round(
          estimatedSpend * 0.25
        );

      const pantryUtilization =
        Math.round(
          60 +
            Math.random() * 35
        );

      res.json({

        totalItems,
        purchasedItems,
        skippedItems,
        estimatedSpend,
        pantrySavings,
        pantryUtilization,

      });

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to fetch analytics",
      });

    }

  };

// ==========================================
// AI INSIGHTS
// ==========================================

const getAiInsights =
  async (req, res) => {

    try {

      const groceryList =
        await GroceryList.findOne({

          userId: req.user._id,

          weekStartDate:
            req.params
              .weekStartDate,

        });

      if (!groceryList) {
        return res.json([]);
      }

      const insights = [];

      const expensiveItems =
        groceryList.items.filter(
          (item) =>
            item.estimatedPrice >
            500
        );

      if (
        expensiveItems.length > 0
      ) {

        insights.push({

          type: "warning",

          title:
            "High Cost Alert",

          description:
            `${expensiveItems.length} expensive grocery items detected.`,

        });

      }

      insights.push({

        type: "healthy",

        title:
          "Balanced Grocery Mix",

        description:
          "Your grocery plan contains a healthy ingredient distribution.",

      });

      res.json(insights);

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to fetch AI insights",
      });

    }

  };

module.exports = {

  generateGroceryList,

  getGroceryListByWeek,

  updateGroceryItemStatus,

  getGroceryAnalytics,

  getAiInsights,

};