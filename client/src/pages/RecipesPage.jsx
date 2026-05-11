import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { getToken } from "../utils/storage";
import "../styles/RecipesPage.css";

const quickRecipes = {
  Breakfast: [
    {
      title: "Poha",
      description: "Light Indian breakfast",
      prepTime: 15,
      servings: 2,
      ingredients: [
        { name: "Poha", quantity: 1, unit: "cup" },
        { name: "Onion", quantity: 1, unit: "pieces" },
        { name: "Green Chili", quantity: 1, unit: "pieces" },
      ],
      steps: [
        "Wash poha",
        "Cook with onion and spices",
        "Serve hot",
      ],
      tags: ["quick", "veg"],
    },

    {
      title: "Vegetable Sandwich",
      description: "Simple breakfast sandwich",
      prepTime: 10,
      servings: 2,
      ingredients: [
        { name: "Bread", quantity: 4, unit: "slices" },
        { name: "Tomato", quantity: 1, unit: "pieces" },
        { name: "Cucumber", quantity: 1, unit: "pieces" },
      ],
      steps: [
        "Slice vegetables",
        "Assemble sandwich",
        "Serve fresh",
      ],
      tags: ["quick", "veg"],
    },

    {
      title: "Oats Bowl",
      description: "Healthy oats breakfast",
      prepTime: 8,
      servings: 1,
      ingredients: [
        { name: "Oats", quantity: 1, unit: "cup" },
        { name: "Milk", quantity: 1, unit: "cup" },
        { name: "Banana", quantity: 1, unit: "pieces" },
      ],
      steps: [
        "Cook oats",
        "Add milk",
        "Top with banana",
      ],
      tags: ["healthy"],
    },
  ],

  Lunch: [
    {
      title: "Dal Rice",
      description: "Simple everyday lunch",
      prepTime: 30,
      servings: 2,
      ingredients: [
        { name: "Rice", quantity: 1, unit: "cup" },
        { name: "Toor Dal", quantity: 1, unit: "cup" },
      ],
      steps: [
        "Cook rice",
        "Cook dal",
        "Serve together",
      ],
      tags: ["classic"],
    },

    {
      title: "Rajma Rice",
      description: "Comfort lunch meal",
      prepTime: 40,
      servings: 2,
      ingredients: [
        { name: "Rice", quantity: 1, unit: "cup" },
        { name: "Rajma", quantity: 1, unit: "cup" },
      ],
      steps: [
        "Cook rajma",
        "Serve with rice",
      ],
      tags: ["protein"],
    },
  ],

  Dinner: [
    {
      title: "Roti Sabzi",
      description: "Simple dinner combo",
      prepTime: 30,
      servings: 2,
      ingredients: [
        { name: "Atta", quantity: 2, unit: "cup" },
        { name: "Potato", quantity: 2, unit: "pieces" },
      ],
      steps: [
        "Prepare dough",
        "Cook sabzi",
      ],
      tags: ["classic"],
    },
  ],

  Snack: [
    {
      title: "Smoothie",
      description: "Quick blended drink",
      prepTime: 8,
      servings: 1,
      ingredients: [
        { name: "Milk", quantity: 1, unit: "cup" },
        { name: "Banana", quantity: 1, unit: "pieces" },
      ],
      steps: [
        "Blend ingredients",
        "Serve chilled",
      ],
      tags: ["quick"],
    },
  ],
};

function RecipesPage() {

  const [recipes, setRecipes] = useState([]);
  const [smartRecipes, setSmartRecipes] =
    useState([]);

  const [search, setSearch] = useState("");

  const [selectedMealType, setSelectedMealType] =
    useState("Breakfast");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });


  const fetchRecipes = async () => {
    try {

      const { data } = await api.get(
        "/recipes",
        authConfig()
      );

      setRecipes(data);

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Failed to load recipes"
      );

    }
  };


  const fetchSmartRecipes = async () => {
    try {

      const { data } = await api.get(
        "/recipes/smart-recipes",
        authConfig()
      );

      setSmartRecipes(data);

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {

    fetchRecipes();
    fetchSmartRecipes();

  }, []);


  const filteredRecipes = useMemo(() => {

    return recipes.filter((recipe) => {

      return (
        recipe.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        recipe.mealType
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    });

  }, [recipes, search]);


  const handleQuickAddRecipe = async (
    recipe
  ) => {

    setError("");
    setSuccess("");

    try {

      await api.post(
        "/recipes",
        {
          title: recipe.title,
          description: recipe.description,
          mealType: selectedMealType,
          prepTime: recipe.prepTime,
          servings: recipe.servings,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          tags: recipe.tags,

          nutrition: {
            calories: 250,
            protein: 10,
            carbs: 35,
            fat: 8,
          },

          image: "",
        },
        authConfig()
      );

      setSuccess(
        `${recipe.title} added successfully`
      );

      fetchRecipes();
      fetchSmartRecipes();

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Failed to add recipe"
      );

    }
  };


  const handleDelete = async (id) => {
    try {

      await api.delete(
        `/recipes/${id}`,
        authConfig()
      );

      fetchRecipes();
      fetchSmartRecipes();

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Failed to delete recipe"
      );

    }
  };


  const handleCookRecipe = async (id) => {

    try {

      await api.put(
        `/recipes/cook/${id}`,
        {},
        authConfig()
      );

      fetchRecipes();
      fetchSmartRecipes();

      setSuccess("Recipe cooked successfully");

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Failed to cook recipe"
      );

    }
  };

  return (
    <DashboardLayout title="Recipes">


      {smartRecipes.length > 0 && (

        <div className="page-card smart-recipes-panel mb-4">

          <div className="recipe-header-block">

            <h2>
              Smart Recipe Suggestions
            </h2>

            <p>
              Recipes matched with your pantry inventory.
            </p>

          </div>

          <div className="smart-recipe-grid">

            {smartRecipes
              .slice(0, 6)
              .map((recipe) => (

                <div
                  className="smart-recipe-card"
                  key={recipe._id}
                >

                  <div className="smart-recipe-top">

                    <h3>
                      {recipe.title}
                    </h3>

                    <span className="match-badge">
                      {recipe.matchPercentage}%
                    </span>

                  </div>

                  <p className="smart-meta">

                    {recipe.mealType}
                    {" • "}
                    {recipe.prepTime} min

                  </p>

                  {recipe.canCookNow ? (

                    <span className="cook-now-badge">
                      Ready To Cook
                    </span>

                  ) : (

                    <span className="missing-badge">

                      Missing{" "}
                      {
                        recipe.missingIngredients.length
                      }{" "}
                      ingredient
                      {
                        recipe.missingIngredients.length > 1
                          ? "s"
                          : ""
                      }

                    </span>

                  )}

                  {!recipe.canCookNow && (

                    <div className="missing-list">

                      {recipe.missingIngredients
                        .slice(0, 3)
                        .map((item, index) => (

                          <span
                            className="missing-item"
                            key={index}
                          >
                            {item}
                          </span>

                        ))}

                    </div>

                  )}

                </div>

              ))}

          </div>

        </div>

      )}

      <div className="row g-4">


        <div className="col-xl-5">

          <div className="page-card recipe-form-card">

            <div className="recipe-header-block">

              <h2>
                Quick Add Recipes
              </h2>

              <p>
                Add common meals instantly.
              </p>

            </div>

            <div className="pantry-filters mb-3">

              {Object.keys(
                quickRecipes
              ).map((mealType) => (

                <button
                  key={mealType}
                  type="button"
                  className={`btn btn-sm rounded-pill ${
                    selectedMealType === mealType
                      ? "btn-success"
                      : "btn-outline-dark"
                  }`}
                  onClick={() =>
                    setSelectedMealType(mealType)
                  }
                >
                  {mealType}
                </button>

              ))}

            </div>

            <div className="quick-add-grid">

              {quickRecipes[
                selectedMealType
              ].map((recipe) => (

                <button
                  type="button"
                  key={recipe.title}
                  className="quick-add-card"
                  onClick={() =>
                    handleQuickAddRecipe(recipe)
                  }
                >

                  <strong>
                    {recipe.title}
                  </strong>

                  <span>
                    {recipe.prepTime} min
                    {" • "}
                    Serves {recipe.servings}
                  </span>

                </button>

              ))}

            </div>

            {error && (
              <div className="alert alert-danger mt-3">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success mt-3">
                {success}
              </div>
            )}

          </div>

        </div>


        <div className="col-xl-7">

          <div className="page-card">

            <div className="recipes-list-header">

              <div>

                <h2>
                  Your Recipes
                </h2>

                <p>
                  Search and manage your recipes.
                </p>

              </div>

              <input
                className="form-control recipe-search"
                placeholder="Search recipes"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {filteredRecipes.length === 0 ? (

              <p className="placeholder-text">
                No recipes found.
              </p>

            ) : (

              <div className="recipe-grid">

                {filteredRecipes.map((recipe) => (

                  <div
                    className="recipe-card"
                    key={recipe._id}
                  >

                    <div className="recipe-card-top">

                      <div>

                        <h3>
                          {recipe.title}
                        </h3>

                        <span className="recipe-meta">

                          {recipe.mealType}
                          {" • "}
                          {recipe.ingredients.length}
                          {" ingredients"}

                        </span>

                      </div>

                      <div className="recipe-actions">

                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            handleCookRecipe(
                              recipe._id
                            )
                          }
                        >
                          Cook Now
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDelete(recipe._id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                    {recipe.description && (

                      <p className="recipe-description">
                        {recipe.description}
                      </p>

                    )}

                    {recipe.tags?.length > 0 && (

                      <div className="recipe-tags">

                        {recipe.tags.map(
                          (tag, index) => (

                            <span
                              className="recipe-tag"
                              key={index}
                            >
                              {tag}
                            </span>

                          )
                        )}

                      </div>

                    )}

                    <div className="recipe-footer">

                      <span>
                        Prep: {recipe.prepTime} min
                      </span>

                      <span>
                        Serves: {recipe.servings}
                      </span>

                      <span>
                        Difficulty:
                        {" "}
                        {recipe.difficulty || "Easy"}
                      </span>

                      <span>
                        Health:
                        {" "}
                        {recipe.healthScore || 0}/100
                      </span>

                      <span>
                        Cooked:
                        {" "}
                        {recipe.cookCount || 0}x
                      </span>

                      {recipe.lastCooked && (

                        <span>

                          Last:
                          {" "}
                          {new Date(
                            recipe.lastCooked
                          ).toLocaleDateString()}

                        </span>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default RecipesPage;
