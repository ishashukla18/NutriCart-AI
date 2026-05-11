import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { getToken } from "../utils/storage";
import "../styles/MealPlannerPage.css";
import getWeekStartDate from "../utils/getWeekStartDate";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SLOTS = [
  "Breakfast",
  "Lunch",
  "Dinner",
];

function MealPlannerPage() {

  const [recipes, setRecipes] =
    useState([]);

  const [entries, setEntries] =
    useState([]);

  const [insights, setInsights] =
    useState(null);

  const [groceryGenerated,
    setGroceryGenerated] =
    useState(false);

  const [showFullAnalysis,
    setShowFullAnalysis] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const getTodayDate = () => {
    return new Date()
      .toISOString()
      .split("T")[0];
  };

  const [selectedDate,
  setSelectedDate] =
  useState(getTodayDate());

const weekStartDate =
  getWeekStartDate(selectedDate);
  const authConfig = {
    headers: {
      Authorization:
        `Bearer ${getToken()}`,
    },
  };


  useEffect(() => {

    const fetchRecipes = async () => {

      try {

        const { data } =
          await api.get(
            "/recipes",
            authConfig
          );

        setRecipes(data);

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to load recipes"
        );

      }
    };

    fetchRecipes();

  }, []);


  const fetchInsights =
    async () => {

    try {

      const { data } =
        await api.get(
          `/meal-plans/insights/${weekStartDate}`,
          authConfig
        );

      setInsights(data);

    } catch (err) {

      console.log(err);

    }
  };


  const handleSelect = (
    day,
    mealSlot,
    recipeId
  ) => {

    setEntries((prev) => {

      const filtered =
        prev.filter(
          (entry) =>
            !(
              entry.day === day &&
              entry.mealSlot === mealSlot
            )
        );

      if (!recipeId)
        return filtered;

      return [
        ...filtered,
        {
          day,
          mealSlot,
          recipeId,
        },
      ];
    });
  };


  const getSelected = (
    day,
    mealSlot
  ) => {

    return (
      entries.find(
        (entry) =>
          entry.day === day &&
          entry.mealSlot === mealSlot
      )?.recipeId || ""
    );
  };


  const handleSave =
    async () => {

    setMessage("");
    setError("");

    try {

      await api.post(
        "/meal-plans",
        {
          weekStartDate,
          entries,
        },
        authConfig
      );

      setMessage(
        "Meal plan saved successfully"
      );

      fetchInsights();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to save meal plan"
      );

    }
  };


  const handleGenerateGrocery =
    async () => {

    try {

      await api.post(
        "/meal-plans/generate-grocery",
        {
          weekStartDate,
        },
        authConfig
      );

      setGroceryGenerated(true);

      setMessage(
        "Smart grocery list generated"
      );

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to generate grocery list"
      );

    }
  };


  const totalMeals =
    entries.length;

  const completionRate =
    Math.round(
      (entries.length / 21) * 100
    );

  return (

    <DashboardLayout
      title="Meal Planner"
    >


      <div className="planner-stats-grid">

        <div className="planner-stat-card">

          <span>
            Planned Meals
          </span>

          <h3>
            {totalMeals}
          </h3>

        </div>

        <div className="planner-stat-card">

          <span>
            Completion
          </span>

          <h3>
            {completionRate}%
          </h3>

        </div>

        <div className="planner-stat-card">

          <span>
            Calories
          </span>

          <h3>
            {
              insights?.nutrition
                ?.calories || 0
            }
          </h3>

        </div>

        <div className="planner-stat-card">

          <span>
            Protein
          </span>

          <h3>
            {
              insights?.nutrition
                ?.protein || 0
            }g
          </h3>

        </div>

      </div>


      <div className="planner-layout">


        <div>

          <div className="page-card">

            <div className="mealplanner-topbar">

              <div>

                <h2>
                  Weekly Meal Plan
                </h2>

                <p className="placeholder-text">

                  Build your weekly
                  nutrition flow.

                </p>

              </div>

              <input
  type="date"
  className="form-control mealplanner-date"
  value={selectedDate}
  onChange={(e) =>
    setSelectedDate(
      e.target.value
    )
  }
/>
              

            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {message && (
              <div className="alert alert-success">
                {message}
              </div>
            )}

            <div className="mealplanner-grid">

              {DAYS.map((day) => (

                <div
                  className="meal-day-card"
                  key={day}
                >

                  <div className="meal-day-title">
                    {day}
                  </div>

                  {SLOTS.map((slot) => (

                    <div
                      className="meal-slot-group"
                      key={slot}
                    >

                      <div className="meal-slot-label">
                        {slot}
                      </div>

                      <select
                        className="form-select"
                        value={getSelected(
                          day,
                          slot
                        )}
                        onChange={(e) =>
                          handleSelect(
                            day,
                            slot,
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          Select recipe
                        </option>

                        {recipes.map(
                          (recipe) => (

                            <option
                              key={recipe._id}
                              value={recipe._id}
                            >
                              {recipe.title}
                            </option>

                          )
                        )}

                      </select>

                    </div>

                  ))}

                </div>

              ))}

            </div>

            <div className="planner-actions">

              <button
                className="btn planner-save-btn"
                onClick={handleSave}
              >
                Save Plan
              </button>

              <button
                className="btn planner-grocery-btn"
                onClick={
                  handleGenerateGrocery
                }
              >
                Generate Grocery
              </button>

            </div>

          </div>

        </div>


        <div className="planner-sidebar">


          <div className="page-card">

            <div className="sidebar-title">
              Weekly Nutrition
            </div>

            <div className="nutrition-grid">

              <div className="nutrition-card">

                <span>
                  Calories
                </span>

                <h4>
                  {
                    insights?.nutrition
                      ?.calories || 0
                  }
                </h4>

              </div>

              <div className="nutrition-card">

                <span>
                  Protein
                </span>

                <h4>
                  {
                    insights?.nutrition
                      ?.protein || 0
                  }g
                </h4>

              </div>

              <div className="nutrition-card">

                <span>
                  Carbs
                </span>

                <h4>
                  {
                    insights?.nutrition
                      ?.carbs || 0
                  }g
                </h4>

              </div>

              <div className="nutrition-card">

                <span>
                  Fat
                </span>

                <h4>
                  {
                    insights?.nutrition
                      ?.fat || 0
                  }g
                </h4>

              </div>

            </div>

          </div>


          <div className="page-card">

            <div className="sidebar-title">
              AI Smart Suggestions
            </div>

            <div className="smart-suggestions">

              {insights?.smartSuggestions
                ?.length === 0 && (

                <div className="smart-empty">
                  No smart insights yet.
                </div>

              )}

              {insights?.smartSuggestions
                ?.slice(0, 5)
                .map(
                  (item, index) => (

                    <div
                      className={`smart-suggestion-card ${item.type}`}
                      key={index}
                    >

                      <strong>
                        {item.recipe}
                      </strong>

                      <span>
                        {item.value}
                      </span>

                    </div>

                  )
                )}

              <button
                className="view-more-ai"
                onClick={() =>
                  setShowFullAnalysis(
                    true
                  )
                }
              >
                View Full AI Analysis
              </button>

            </div>

          </div>


          <div className="page-card">

            <div className="sidebar-title">
              Grocery Status
            </div>

            {groceryGenerated ? (

              <div className="grocery-success">

                Grocery list generated
                successfully.

              </div>

            ) : (

              <div className="grocery-pending">

                Generate grocery list
                from your meal plan.

              </div>

            )}

          </div>

        </div>

      </div>


      {showFullAnalysis && (

        <div className="ai-modal-overlay">

          <div className="ai-modal-card">

            <div className="ai-modal-top">

              <div>

                <h2>
                  AI Nutrition Analysis
                </h2>

                <p>
                  Smart meal planning
                  insights generated from
                  your weekly selections.
                </p>

              </div>

              <button
                className="ai-close-btn"
                onClick={() =>
                  setShowFullAnalysis(
                    false
                  )
                }
              >
                ✕
              </button>

            </div>


            <div className="ai-analysis-section">

              <h3>
                Weekly Nutrition
              </h3>

              <div className="nutrition-grid">

                <div className="nutrition-card">
                  <span>Calories</span>
                  <h4>
                    {
                      insights?.nutrition
                        ?.calories || 0
                    }
                  </h4>
                </div>

                <div className="nutrition-card">
                  <span>Protein</span>
                  <h4>
                    {
                      insights?.nutrition
                        ?.protein || 0
                    }g
                  </h4>
                </div>

                <div className="nutrition-card">
                  <span>Carbs</span>
                  <h4>
                    {
                      insights?.nutrition
                        ?.carbs || 0
                    }g
                  </h4>
                </div>

                <div className="nutrition-card">
                  <span>Fat</span>
                  <h4>
                    {
                      insights?.nutrition
                        ?.fat || 0
                    }g
                  </h4>
                </div>

              </div>

            </div>


            <div className="ai-analysis-section">

              <h3>
                Smart AI Insights
              </h3>

              <div className="full-ai-grid">

                {insights?.smartSuggestions
                  ?.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        className={`smart-suggestion-card ${item.type}`}
                        key={index}
                      >

                        <strong>
                          {item.recipe}
                        </strong>

                        <span>
                          {item.value}
                        </span>

                      </div>

                    )
                  )}

              </div>

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}

export default MealPlannerPage;
