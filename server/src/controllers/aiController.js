const PantryItem = require("../models/PantryItem");
const Recipe = require("../models/Recipe");

const extractGeminiText = (data) => {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim() || ""
  );
};

const buildMealSuggestionPrompt = (pantryItems, recipes) => {
  const pantrySummary = pantryItems.length
    ? pantryItems
        .map((item) => `${item.name} (${item.quantity} ${item.unit})`)
        .join(", ")
    : "No pantry items added yet";

  const recipeSummary = recipes.length
    ? recipes
        .slice(0, 12)
        .map((recipe) => `${recipe.title} - ${recipe.mealType}`)
        .join(", ")
    : "No saved recipes yet";

  return `
You are NutriCart AI, a practical meal planning assistant.

User pantry items:
${pantrySummary}

Saved recipes:
${recipeSummary}

Suggest 4 realistic meal ideas the user can cook or plan next.
Keep it beginner-friendly, affordable, and based mainly on the pantry.
For each idea include:
1. meal name
2. why it fits
3. missing ingredients, if any

Return concise bullet points only.
`;
};

const getMealSuggestions = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        message:
          "Gemini API key is not configured on the server",
      });
    }

    const pantryItems = await PantryItem.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    const recipes = await Recipe.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    const model =
      process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const prompt = buildMealSuggestionPrompt(
      pantryItems,
      recipes
    );

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 700,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return res.status(502).json({
        message:
          "AI suggestions are unavailable right now",
      });
    }

    const suggestions = extractGeminiText(data);

    if (!suggestions) {
      return res.status(502).json({
        message:
          "AI returned an empty response. Please try again.",
      });
    }

    res.json({
      suggestions,
      model,
      pantryItemsUsed: pantryItems.length,
      recipesUsed: recipes.length,
    });
  } catch (error) {
    console.error("Meal suggestion error:", error);

    res.status(500).json({
      message: "Failed to generate AI meal suggestions",
    });
  }
};

module.exports = {
  getMealSuggestions,
};
