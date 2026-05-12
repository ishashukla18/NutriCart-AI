const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const pantryRoutes = require("./routes/pantryRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const groceryListRoutes = require("./routes/groceryListRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");




const app = express();

const normalizeOrigin = (origin) => origin.replace(/\/$/, "");

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
      .map((origin) => normalizeOrigin(origin.trim()))
      .filter(Boolean)
  : [];

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(normalizeOrigin(origin))
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "NutriCart API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/grocery-lists", groceryListRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);





app.use(notFound);
app.use(errorHandler);

module.exports = app;
