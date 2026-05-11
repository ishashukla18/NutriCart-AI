import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { getToken } from "../utils/storage";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const [summary, setSummary] =
    useState(null);

  const [error, setError] =
    useState("");

  const getTodayDate = () => {
    return new Date()
      .toISOString()
      .split("T")[0];
  };

  const [weekStartDate, setWeekStartDate] =
    useState(getTodayDate());

  useEffect(() => {
    fetchDashboard();
  }, [weekStartDate]);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get(
        `/dashboard/summary?weekStartDate=${weekStartDate}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setSummary(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    }
  };

  if (!summary) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="dash-panel">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">

      <section className="dash-hero">

        <div>

          <span className="dash-chip">
            Smart Kitchen Overview
          </span>

          <h2>
            NutriCart Intelligence Dashboard
          </h2>

          <p className="dash-hero-text">
            Track pantry health,
            nutrition, grocery flow
            and food waste in one place.
          </p>

        </div>

        <div className="dash-hero-side">

          <label>
            Week Starting
          </label>

          <input
            type="date"
            className="form-control dash-date"
            value={weekStartDate}
            onChange={(e) =>
              setWeekStartDate(
                e.target.value
              )
            }
          />

        </div>

      </section>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      <section className="dash-stat-grid">

        <div className="dash-stat-card card-blue">
          <span className="dash-stat-label">
            Pantry Items
          </span>

          <h3>
            {summary.totalPantryItems}
          </h3>
        </div>

        <div className="dash-stat-card card-orange">
          <span className="dash-stat-label">
            Expiring Soon
          </span>

          <h3>
            {
              summary.expiringItemsCount
            }
          </h3>
        </div>

        <div className="dash-stat-card card-red">
          <span className="dash-stat-label">
            Low Stock
          </span>

          <h3>
            {summary.lowStockCount}
          </h3>
        </div>

        <div className="dash-stat-card card-green">
          <span className="dash-stat-label">
            Pantry Health
          </span>

          <h3>
            {
              summary.pantryHealthScore
            }
            %
          </h3>
        </div>

        <div className="dash-stat-card card-purple">
          <span className="dash-stat-label">
            Recipes
          </span>

          <h3>
            {summary.totalRecipes}
          </h3>
        </div>

        <div className="dash-stat-card card-money">
          <span className="dash-stat-label">
            Money Saved
          </span>

          <h3>
            ₹
            {summary.moneySavedEstimate}
          </h3>
        </div>

      </section>


      <section className="dash-main-grid">


        <div className="dash-left">


          <article className="dash-panel">

            <div className="panel-top">

              <div>

                <span className="dash-chip">
                  Weekly Nutrition
                </span>

                <h3>
                  Nutrition Summary
                </h3>

              </div>

            </div>

            <div className="nutrition-grid">

              <div className="nutrition-card">
                <span>
                  Calories
                </span>

                <strong>
                  {
                    summary
                      .weeklyNutrition
                      .calories
                  }
                </strong>
              </div>

              <div className="nutrition-card">
                <span>
                  Protein
                </span>

                <strong>
                  {
                    summary
                      .weeklyNutrition
                      .protein
                  }
                  g
                </strong>
              </div>

              <div className="nutrition-card">
                <span>
                  Carbs
                </span>

                <strong>
                  {
                    summary
                      .weeklyNutrition
                      .carbs
                  }
                  g
                </strong>
              </div>

              <div className="nutrition-card">
                <span>
                  Fat
                </span>

                <strong>
                  {
                    summary
                      .weeklyNutrition
                      .fat
                  }
                  g
                </strong>
              </div>

            </div>

          </article>


          <article className="dash-panel">

            <span className="dash-chip">
              Alerts
            </span>

            <h3>
              Low Stock Alert Center
            </h3>

            {summary.lowStockItems
              .length === 0 ? (

              <p className="dash-muted">
                No low stock items.
              </p>

            ) : (

              <div className="alert-list">

                {summary.lowStockItems.map(
                  (item) => (

                    <div
                      className="alert-item"
                      key={item._id}
                    >

                      <div>

                        <strong>
                          {item.name}
                        </strong>

                        <p>
                          {
                            item.quantity
                          }{" "}
                          {
                            item.unit
                          }{" "}
                          left
                        </p>

                      </div>

                      <span className="low-badge">
                        LOW
                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </article>


          <article className="dash-panel">

            <span className="dash-chip">
              Activity
            </span>

            <h3>
              Recent Activity Feed
            </h3>

            <div className="activity-list">

              {summary.recentActivity.map(
                (activity, index) => (

                  <div
                    className="activity-item"
                    key={index}
                  >

                    <div>

                      <strong>
                        {
                          activity.type
                        }
                      </strong>

                      <p>
                        {
                          activity.text
                        }
                      </p>

                    </div>

                    <span>
                      {new Date(
                        activity.time
                      ).toLocaleDateString()}
                    </span>

                  </div>

                )
              )}

            </div>

          </article>

        </div>


        <div className="dash-right">


          <article className="dash-panel">

            <span className="dash-chip">
              AI Insights
            </span>

            <h3>
              Smart Insights Panel
            </h3>

            <div className="insight-list">

              {summary.smartInsights.map(
                (insight, index) => (

                  <div
                    className="insight-item"
                    key={index}
                  >
                    {insight}
                  </div>

                )
              )}

            </div>

          </article>


          <article className="dash-panel dark-panel">

            <h3>
              Grocery Progress
            </h3>

            <p>
              Purchased{" "}
              {
                summary.purchasedItems
              }{" "}
              of{" "}
              {
                summary.groceryItems
              }{" "}
              items
            </p>

            <div className="dash-progress-track">

              <div
                className="dash-progress-fill"
                style={{
                  width:
                    summary.groceryItems >
                    0
                      ? `${
                          (summary.purchasedItems /
                            summary.groceryItems) *
                          100
                        }%`
                      : "0%",
                }}
              />

            </div>

            <Link
              to="/grocery-list"
              className="btn btn-light mt-3"
            >
              Open Grocery List
            </Link>

          </article>

        </div>

      </section>

    </DashboardLayout>
  );
}

export default DashboardPage;
