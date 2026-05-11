const PantryItem = require("../models/PantryItem");


const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


const getPantryItems = async (req, res) => {
  try {

    const items = await PantryItem.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {

    res.status(500);

    throw new Error(
      "Failed to fetch pantry items"
    );
  }
};



const createPantryItem = async (req, res) => {

  try {

    const {
      name,
      category,
      quantity,
      unit,
      expiryDate,
      price,
      minimumStock,
    } = req.body;

    if (
      !name ||
      quantity === undefined ||
      !unit
    ) {

      res.status(400);

      throw new Error(
        "Name, quantity and unit are required"
      );
    }

    const existingItem = await PantryItem.findOne({
      userId: req.user._id,
      name: {
        $regex: `^${escapeRegExp(name.trim())}$`,
        $options: "i",
      },
      category: category || "Other",
      unit,
    });

    if (existingItem) {
      existingItem.quantity += Number(quantity);

      if (expiryDate) {
        existingItem.expiryDate = expiryDate;
      }

      if (price !== undefined) {
        existingItem.price = price;
      }

      if (minimumStock !== undefined) {
        existingItem.minimumStock = minimumStock;
      }

      const updatedItem = await existingItem.save();

      res.status(200).json(updatedItem);
      return;
    }

    const item = await PantryItem.create({

      userId: req.user._id,

      name: name.trim(),

      category,

      quantity,

      unit,

      expiryDate,

      price,

      minimumStock:
        minimumStock || 2,

    });

    res.status(201).json(item);

  } catch (error) {

    if (res.statusCode === 200) {
      res.status(500);
    }

    throw error;
  }
};



const updatePantryItem = async (
  req,
  res
) => {

  try {

    const item =
      await PantryItem.findById(
        req.params.id
      );

    if (!item) {

      res.status(404);

      throw new Error(
        "Pantry item not found"
      );
    }

    if (
      item.userId.toString() !==
      req.user._id.toString()
    ) {

      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }

    const updatedItem =
      await PantryItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.json(updatedItem);

  } catch (error) {

    if (res.statusCode === 200) {
      res.status(500);
    }

    throw error;
  }
};



const consumePantryItem = async (
  req,
  res
) => {

  try {

    const item =
      await PantryItem.findById(
        req.params.id
      );

    if (!item) {

      res.status(404);

      throw new Error(
        "Pantry item not found"
      );
    }

    if (
      item.userId.toString() !==
      req.user._id.toString()
    ) {

      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }

    if (item.quantity > 0) {
      item.quantity -= 1;
    }

    item.usageCount += 1;

    item.lastUsedAt = new Date();

    await item.save();

    res.json(item);

  } catch (error) {

    if (res.statusCode === 200) {
      res.status(500);
    }

    throw error;
  }
};



const getExpiringItems = async (
  req,
  res
) => {

  try {

    const today = new Date();

    const next5Days = new Date();

    next5Days.setDate(
      today.getDate() + 5
    );

    const items =
      await PantryItem.find({

        userId: req.user._id,

        expiryDate: {
          $gte: today,
          $lte: next5Days,
        },

      });

    res.json({
      count: items.length,
      items,
    });

  } catch (error) {

    res.status(500);

    throw new Error(
      "Failed to fetch expiring items"
    );
  }
};



const getSmartSuggestions = async (
  req,
  res
) => {

  try {

    const items =
      await PantryItem.find({
        userId: req.user._id,
      });

    const suggestions = [];

    items.forEach((item) => {

      const isLowStock =
        item.quantity <=
        item.minimumStock;

      const isFrequentlyUsed =
        item.usageCount >= 5;

      let isExpiringSoon = false;

      if (item.expiryDate) {

        const today = new Date();

        const expiry = new Date(
          item.expiryDate
        );

        const diff = Math.ceil(
          (expiry - today) /
            (1000 * 60 * 60 * 24)
        );

        isExpiringSoon =
          diff >= 0 && diff <= 2;
      }

      if (
        isLowStock ||
        isFrequentlyUsed ||
        isExpiringSoon
      ) {

        suggestions.push({

          _id: item._id,

          name: item.name,

          category: item.category,

          quantity: item.quantity,

          unit: item.unit,

          reasons: {

            lowStock: isLowStock,

            frequent:
              isFrequentlyUsed,

            expiringSoon:
              isExpiringSoon,

          },
        });
      }
    });

    res.json({
      count: suggestions.length,
      items: suggestions,
    });

  } catch (error) {

    res.status(500);

    throw new Error(
      "Failed to fetch smart suggestions"
    );
  }
};



const deletePantryItem = async (
  req,
  res
) => {

  try {

    const item =
      await PantryItem.findById(
        req.params.id
      );

    if (!item) {

      res.status(404);

      throw new Error(
        "Pantry item not found"
      );
    }

    if (
      item.userId.toString() !==
      req.user._id.toString()
    ) {

      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }

    await item.deleteOne();

    res.json({
      message:
        "Pantry item deleted successfully",
    });

  } catch (error) {

    if (res.statusCode === 200) {
      res.status(500);
    }

    throw error;
  }
};


module.exports = {

  getPantryItems,

  createPantryItem,

  updatePantryItem,

  deletePantryItem,

  getExpiringItems,

  consumePantryItem,

  getSmartSuggestions,
};
