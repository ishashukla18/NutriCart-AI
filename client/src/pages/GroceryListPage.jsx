import getWeekStartDate from "../utils/getWeekStartDate";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../services/api";

import {
  getToken,
} from "../utils/storage";

import "../styles/GroceryListPage.css";

function GroceryListPage() {


  const getTodayDate = () => {

    return new Date()
      .toISOString()
      .split("T")[0];

  };


  const [
    selectedDate,
    setSelectedDate,
  ] = useState(getTodayDate());

  const weekStartDate =
    getWeekStartDate(selectedDate);

  const [
    groceryList,
    setGroceryList,
  ] = useState(null);

  const [
    analytics,
    setAnalytics,
  ] = useState(null);

  const [
    insights,
    setInsights,
  ] = useState([]);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const authConfig = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };


  const fetchAnalytics =
    async () => {

      try {

        const { data } =
          await api.get(
            `/grocery-lists/analytics/${weekStartDate}`,
            authConfig
          );

        setAnalytics(data);

      } catch (err) {

        console.log(err);

      }

    };


  const fetchInsights =
    async () => {

      try {

        const { data } =
          await api.get(
            `/grocery-lists/ai-insights/${weekStartDate}`,
            authConfig
          );

        setInsights(data);

      } catch (err) {

        console.log(err);

      }

    };


  const fetchExistingList =
    async () => {

      try {

        const { data } =
          await api.get(
            `/grocery-lists/${weekStartDate}`,
            authConfig
          );

        setGroceryList(data);

      } catch (err) {

        console.log(err);

      }

    };


  useEffect(() => {

    fetchExistingList();

    fetchAnalytics();

    fetchInsights();

  }, [weekStartDate]);


  const generateList =
    async () => {

      setError("");

      setMessage("");

      try {

        const { data } =
          await api.post(
            "/grocery-lists/generate",
            {
              weekStartDate,
            },
            authConfig
          );

        setGroceryList(data);

        fetchAnalytics();

        fetchInsights();

        setMessage(
          "Smart grocery list generated successfully"
        );

      } catch (err) {

        setError(
          err.response?.data
            ?.message ||
            "Failed to generate grocery list"
        );

      }

    };


  const togglePurchased =
    async (index) => {

      try {

        const { data } =
          await api.put(
            `/grocery-lists/${groceryList._id}/item/${index}`,
            {
              purchased: true,
              skipped: false,
            },
            authConfig
          );

        setGroceryList(data);

        fetchAnalytics();

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to update item"
        );

      }

    };


  const skipItem =
    async (index) => {

      try {

        const { data } =
          await api.put(
            `/grocery-lists/${groceryList._id}/item/${index}`,
            {
              skipped: true,
              purchased: false,
            },
            authConfig
          );

        setGroceryList(data);

        fetchAnalytics();

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to skip item"
        );

      }

    };


  const purchasePercent =
    useMemo(() => {

      if (
        !analytics ||
        analytics.totalItems === 0
      ) {
        return 0;
      }

      return Math.round(
        (
          analytics.purchasedItems /
          analytics.totalItems
        ) * 100
      );

    }, [analytics]);


  return (

    <DashboardLayout title="Grocery Intelligence">


      {analytics && (

        <div className="grocery-stats-grid">

          <div className="grocery-stat-card">

            <span>
              Estimated Spend
            </span>

            <h3>
              ₹
              {analytics.estimatedSpend}
            </h3>

          </div>

          <div className="grocery-stat-card">

            <span>
              Pantry Savings
            </span>

            <h3>
              ₹
              {analytics.pantrySavings}
            </h3>

          </div>

          <div className="grocery-stat-card">

            <span>
              Pantry Usage
            </span>

            <h3>
              {
                analytics.pantryUtilization
              }
              %
            </h3>

          </div>

          <div className="grocery-stat-card">

            <span>
              Purchased
            </span>

            <h3>
              {purchasePercent}%
            </h3>

          </div>

        </div>

      )}


      <div className="grocery-layout">


        <div>

          <div className="page-card">


            <div className="grocery-topbar">

              <div>

                <h2>
                  AI Grocery Planner
                </h2>

                <p className="placeholder-text">
                  Auto-generated from your meal plans and pantry inventory.
                </p>

              </div>

              <div className="grocery-actions">

                <input
                  type="date"
                  className="form-control grocery-date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                />

                <button
                  className="generate-btn"
                  onClick={generateList}
                >
                  Generate List
                </button>

              </div>

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


            {!groceryList ||
            groceryList.items.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No Grocery Items Yet
                </h3>

                <p>
                  Generate a smart grocery list from your weekly meal plan.
                </p>

              </div>

            ) : (

              <div className="grocery-list">

                {groceryList.items.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={`${item.name}-${index}`}
                      className={`grocery-item-card ${
                        item.purchased
                          ? "purchased-card"
                          : ""
                      }`}
                    >


                      <div className="grocery-left">

                        <div className="grocery-icon">
                          🛒
                        </div>

                        <div>

                          <h3>
                            {item.name}
                          </h3>

                          <div className="grocery-meta">

                            {item.quantity}{" "}
                            {item.unit}

                          </div>

                        </div>

                      </div>


                      <div className="grocery-right">

                        <div className="price-tag">

                          ₹
                          {item.estimatedPrice}

                        </div>

                        <div className="grocery-buttons">

                          {item.purchased ? (

                            <button className="done-btn">
                              Purchased
                            </button>

                          ) : item.skipped ? (

                            <button className="skipped-btn">
                              Skipped
                            </button>

                          ) : (

                            <>

                              <button
                                className="purchase-btn"
                                onClick={() =>
                                  togglePurchased(index)
                                }
                              >
                                Purchase
                              </button>

                              <button
                                className="skip-btn"
                                onClick={() =>
                                  skipItem(index)
                                }
                              >
                                Skip
                              </button>

                            </>

                          )}

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>


        <div className="grocery-sidebar">


          <div className="page-card">

            <div className="sidebar-title">
              AI Shopping Assistant
            </div>

            <div className="ai-insights-list">

              {insights.length === 0 ? (

                <div className="smart-empty">
                  No AI insights available.
                </div>

              ) : (

                insights.map(
                  (
                    insight,
                    index
                  ) => (

                    <div
                      key={index}
                      className={`insight-card ${insight.type}`}
                    >

                      <strong>
                        {insight.title}
                      </strong>

                      <span>
                        {insight.description}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>


          {analytics && (

            <div className="page-card">

              <div className="sidebar-title">
                Weekly Progress
              </div>

              <div className="progress-circle">

                <div className="progress-value">
                  {purchasePercent}%
                </div>

              </div>

              <div className="progress-label">
                Grocery Completion
              </div>

              <div className="mini-stats">

                <div>

                  <strong>
                    {
                      analytics.purchasedItems
                    }
                  </strong>

                  <span>
                    Purchased
                  </span>

                </div>

                <div>

                  <strong>
                    {
                      analytics.skippedItems
                    }
                  </strong>

                  <span>
                    Skipped
                  </span>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>

  );
}

export default GroceryListPage;
