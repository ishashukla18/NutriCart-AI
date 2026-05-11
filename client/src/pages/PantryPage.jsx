import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { getToken } from "../utils/storage";
import "../styles/PantryPage.css";

const pantrySuggestions = [


  {
    name: "Potato",
    category: "Vegetable",
    unit: "kg",
    price: 40,
    shelfLife: 14,
  },

  {
    name: "Green Chili",
    category: "Vegetable",
    unit: "kg",
    price: 20,
    shelfLife: 10,
  },

  {
    name: "Onion",
    category: "Vegetable",
    unit: "kg",
    price: 45,
    shelfLife: 20,
  },

  {
    name: "Tomato",
    category: "Vegetable",
    unit: "kg",
    price: 35,
    shelfLife: 7,
  },

  {
    name: "Carrot",
    category: "Vegetable",
    unit: "kg",
    price: 60,
    shelfLife: 10,
  },

  {
    name: "Cucumber",
    category: "Vegetable",
    unit: "kg",
    price: 50,
    shelfLife: 6,
  },

  {
    name: "Capsicum",
    category: "Vegetable",
    unit: "kg",
    price: 80,
    shelfLife: 7,
  },

  {
    name: "Spinach",
    category: "Vegetable",
    unit: "bunch",
    price: 25,
    shelfLife: 3,
  },

  {
    name: "Coriander",
    category: "Vegetable",
    unit: "bunch",
    price: 15,
    shelfLife: 3,
  },

  {
    name: "Mint",
    category: "Vegetable",
    unit: "bunch",
    price: 15,
    shelfLife: 3,
  },

  {
    name: "Garlic",
    category: "Vegetable",
    unit: "kg",
    price: 160,
    shelfLife: 30,
  },

  {
    name: "Ginger",
    category: "Vegetable",
    unit: "kg",
    price: 120,
    shelfLife: 20,
  },

  {
    name: "Broccoli",
    category: "Vegetable",
    unit: "pieces",
    price: 90,
    shelfLife: 5,
  },

  {
    name: "Mushroom",
    category: "Vegetable",
    unit: "box",
    price: 60,
    shelfLife: 4,
  },


  {
    name: "Apple",
    category: "Fruit",
    unit: "kg",
    price: 180,
    shelfLife: 14,
  },

  {
    name: "Banana",
    category: "Fruit",
    unit: "dozen",
    price: 70,
    shelfLife: 5,
  },

  {
    name: "Orange",
    category: "Fruit",
    unit: "kg",
    price: 120,
    shelfLife: 12,
  },

  {
    name: "Mango",
    category: "Fruit",
    unit: "kg",
    price: 200,
    shelfLife: 7,
  },

  {
    name: "Papaya",
    category: "Fruit",
    unit: "pieces",
    price: 60,
    shelfLife: 5,
  },

  {
    name: "Watermelon",
    category: "Fruit",
    unit: "pieces",
    price: 90,
    shelfLife: 6,
  },

  {
    name: "Pomegranate",
    category: "Fruit",
    unit: "kg",
    price: 220,
    shelfLife: 10,
  },


  {
    name: "Milk",
    category: "Dairy",
    unit: "litre",
    price: 60,
    shelfLife: 5,
  },

  {
    name: "Curd",
    category: "Dairy",
    unit: "cup",
    price: 40,
    shelfLife: 6,
  },

  {
    name: "Paneer",
    category: "Dairy",
    unit: "pack",
    price: 90,
    shelfLife: 5,
  },

  {
    name: "Cheese",
    category: "Dairy",
    unit: "pack",
    price: 140,
    shelfLife: 25,
  },

  {
    name: "Butter",
    category: "Dairy",
    unit: "pack",
    price: 55,
    shelfLife: 30,
  },

  {
    name: "Ghee",
    category: "Dairy",
    unit: "jar",
    price: 550,
    shelfLife: 180,
  },


  {
    name: "Rice",
    category: "Grains",
    unit: "kg",
    price: 70,
    shelfLife: 180,
  },

  {
    name: "Basmati Rice",
    category: "Grains",
    unit: "kg",
    price: 140,
    shelfLife: 365,
  },

  {
    name: "Brown Rice",
    category: "Grains",
    unit: "kg",
    price: 120,
    shelfLife: 180,
  },

  {
    name: "Poha",
    category: "Grains",
    unit: "kg",
    price: 80,
    shelfLife: 120,
  },

  {
    name: "Oats",
    category: "Grains",
    unit: "pack",
    price: 180,
    shelfLife: 120,
  },

  {
    name: "Suji",
    category: "Grains",
    unit: "kg",
    price: 60,
    shelfLife: 120,
  },


  {
    name: "Toor Dal",
    category: "Pulses",
    unit: "kg",
    price: 140,
    shelfLife: 180,
  },

  {
    name: "Moong Dal",
    category: "Pulses",
    unit: "kg",
    price: 150,
    shelfLife: 180,
  },

  {
    name: "Masoor Dal",
    category: "Pulses",
    unit: "kg",
    price: 135,
    shelfLife: 180,
  },

  {
    name: "Chana Dal",
    category: "Pulses",
    unit: "kg",
    price: 110,
    shelfLife: 180,
  },

  {
    name: "Rajma",
    category: "Pulses",
    unit: "kg",
    price: 180,
    shelfLife: 240,
  },

  {
    name: "Chickpeas",
    category: "Pulses",
    unit: "kg",
    price: 120,
    shelfLife: 240,
  },


  {
    name: "Atta",
    category: "Flour",
    unit: "kg",
    price: 55,
    shelfLife: 90,
  },

  {
    name: "Maida",
    category: "Flour",
    unit: "kg",
    price: 60,
    shelfLife: 120,
  },

  {
    name: "Besan",
    category: "Flour",
    unit: "kg",
    price: 90,
    shelfLife: 120,
  },

  {
    name: "Ragi Flour",
    category: "Flour",
    unit: "kg",
    price: 140,
    shelfLife: 120,
  },


  {
    name: "Turmeric Powder",
    category: "Spices",
    unit: "pack",
    price: 35,
    shelfLife: 365,
  },

  {
    name: "Red Chili Powder",
    category: "Spices",
    unit: "pack",
    price: 45,
    shelfLife: 365,
  },

  {
    name: "Coriander Powder",
    category: "Spices",
    unit: "pack",
    price: 50,
    shelfLife: 365,
  },

  {
    name: "Garam Masala",
    category: "Spices",
    unit: "pack",
    price: 80,
    shelfLife: 365,
  },

  {
    name: "Black Pepper",
    category: "Spices",
    unit: "pack",
    price: 120,
    shelfLife: 365,
  },


  {
    name: "Sunflower Oil",
    category: "Oils",
    unit: "litre",
    price: 160,
    shelfLife: 180,
  },

  {
    name: "Olive Oil",
    category: "Oils",
    unit: "litre",
    price: 700,
    shelfLife: 240,
  },

  {
    name: "Mustard Oil",
    category: "Oils",
    unit: "litre",
    price: 190,
    shelfLife: 180,
  },


  {
    name: "Bread",
    category: "Bakery",
    unit: "pack",
    price: 45,
    shelfLife: 4,
  },

  {
    name: "Brown Bread",
    category: "Bakery",
    unit: "pack",
    price: 55,
    shelfLife: 4,
  },

  {
    name: "Buns",
    category: "Bakery",
    unit: "pack",
    price: 40,
    shelfLife: 3,
  },


  {
    name: "Biscuits",
    category: "Snacks",
    unit: "pack",
    price: 30,
    shelfLife: 180,
  },

  {
    name: "Chips",
    category: "Snacks",
    unit: "pack",
    price: 20,
    shelfLife: 120,
  },

  {
    name: "Namkeen",
    category: "Snacks",
    unit: "pack",
    price: 60,
    shelfLife: 120,
  },

  {
    name: "Popcorn",
    category: "Snacks",
    unit: "pack",
    price: 50,
    shelfLife: 120,
  },


  {
    name: "Tea",
    category: "Beverages",
    unit: "pack",
    price: 220,
    shelfLife: 365,
  },

  {
    name: "Coffee",
    category: "Beverages",
    unit: "pack",
    price: 350,
    shelfLife: 365,
  },

  {
    name: "Green Tea",
    category: "Beverages",
    unit: "box",
    price: 280,
    shelfLife: 365,
  },

  {
    name: "Juice",
    category: "Beverages",
    unit: "bottle",
    price: 120,
    shelfLife: 30,
  },


  {
    name: "Frozen Peas",
    category: "Frozen",
    unit: "pack",
    price: 120,
    shelfLife: 180,
  },

  {
    name: "Frozen Corn",
    category: "Frozen",
    unit: "pack",
    price: 140,
    shelfLife: 180,
  },

  {
    name: "Frozen Paratha",
    category: "Frozen",
    unit: "pack",
    price: 160,
    shelfLife: 120,
  },


  {
    name: "Chocolate",
    category: "Sweets",
    unit: "bars",
    price: 50,
    shelfLife: 240,
  },

  {
    name: "Ice Cream",
    category: "Sweets",
    unit: "box",
    price: 220,
    shelfLife: 90,
  },


  {
    name: "Instant Noodles",
    category: "Ready To Cook",
    unit: "pack",
    price: 20,
    shelfLife: 240,
  },

  {
    name: "Pasta",
    category: "Ready To Cook",
    unit: "pack",
    price: 90,
    shelfLife: 240,
  },

  {
    name: "Pizza Base",
    category: "Ready To Cook",
    unit: "pack",
    price: 70,
    shelfLife: 15,
  },


  {
    name: "Almonds",
    category: "Dry Fruits",
    unit: "pack",
    price: 450,
    shelfLife: 240,
  },

  {
    name: "Cashews",
    category: "Dry Fruits",
    unit: "pack",
    price: 520,
    shelfLife: 240,
  },

  {
    name: "Raisins",
    category: "Dry Fruits",
    unit: "pack",
    price: 180,
    shelfLife: 240,
  },


  {
    name: "Dishwash Liquid",
    category: "Household",
    unit: "bottle",
    price: 180,
    shelfLife: 365,
  },

  {
    name: "Detergent",
    category: "Household",
    unit: "pack",
    price: 260,
    shelfLife: 365,
  },

  {
    name: "Handwash",
    category: "Household",
    unit: "bottle",
    price: 120,
    shelfLife: 365,
  },
];

function PantryPage() {
  const [items, setItems] = useState([]);
  const [smartSuggestions, setSmartSuggestions] =
    useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("Vegetable");

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [quickAddPending, setQuickAddPending] =
    useState("");

  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });


  const fetchItems = async () => {
    try {
      const { data } = await api.get(
        "/pantry",
        authConfig()
      );

      setItems(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load pantry"
      );
    }
  };


  const fetchSmartSuggestions = async () => {
    try {
      const { data } = await api.get(
        "/pantry/smart-suggestions",
        authConfig()
      );

      setSmartSuggestions(data.items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchSmartSuggestions();
  }, []);


  const categories = [
    ...new Set(
      pantrySuggestions.map(
        (item) => item.category
      )
    ),
  ];


  const quickAddItems = useMemo(() => {
    return pantrySuggestions.filter(
      (item) =>
        item.category === selectedCategory
    );
  }, [selectedCategory]);


  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return (
        item.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (item.category || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [items, search]);


  const estimatedCost = useMemo(() => {
    return items.reduce((total, item) => {
      return (
        total +
        (item.price || 0) *
          (item.quantity || 0)
      );
    }, 0);
  }, [items]);


  const expiringSoonCount = useMemo(() => {
    return items.filter((item) => {
      if (!item.expiryDate) return false;

      const today = new Date();

      const expiry = new Date(
        item.expiryDate
      );

      const diff = Math.ceil(
        (expiry - today) /
          (1000 * 60 * 60 * 24)
      );

      return diff >= 0 && diff <= 2;
    }).length;
  }, [items]);


  const expiredCount = useMemo(() => {
    return items.filter((item) => {
      if (!item.expiryDate) return false;

      return (
        new Date(item.expiryDate) <
        new Date()
      );
    }).length;
  }, [items]);


  const lowStockCount = useMemo(() => {
    return items.filter(
      (item) =>
        item.quantity <=
        (item.minimumStock || 2)
    ).length;
  }, [items]);


  const pantryHealth = useMemo(() => {
    if (items.length === 0) return 0;

    const healthyItems = items.filter(
      (item) => {
        if (!item.expiryDate) return true;

        return (
          new Date(item.expiryDate) >
          new Date()
        );
      }
    );

    return Math.round(
      (healthyItems.length /
        items.length) *
        100
    );
  }, [items]);


  const handleQuickAdd = async (
    item
  ) => {
    const itemKey = `${item.category}:${item.name}:${item.unit}`;

    if (quickAddPending === itemKey) {
      return;
    }

    setError("");
    setSuccess("");
    setQuickAddPending(itemKey);

    try {
      const existingItem = items.find(
        (pantryItem) =>
          pantryItem.name.toLowerCase() ===
            item.name.toLowerCase() &&
          pantryItem.category ===
            item.category &&
          pantryItem.unit === item.unit
      );

      if (existingItem) {
        await api.put(
          `/pantry/${existingItem._id}`,
          {
            quantity:
              Number(
                existingItem.quantity
              ) + 1,
          },
          authConfig()
        );

        setSuccess(
          `${item.name} quantity increased`
        );
      } else {
        const expiryDate =
          new Date();

        expiryDate.setDate(
          expiryDate.getDate() +
            (item.shelfLife || 7)
        );

        await api.post(
          "/pantry",
          {
            name: item.name,
            category: item.category,
            quantity: 1,
            unit: item.unit,
            expiryDate,
            price: item.price || 0,
            minimumStock: 2,
          },
          authConfig()
        );

        setSuccess(
          `${item.name} added to pantry`
        );
      }

      fetchItems();
      fetchSmartSuggestions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update pantry item"
      );
    } finally {
      setQuickAddPending("");
    }
  };


  const handleConsume = async (
    id
  ) => {
    try {
      await api.put(
        `/pantry/consume/${id}`,
        {},
        authConfig()
      );

      fetchItems();
      fetchSmartSuggestions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to consume item"
      );
    }
  };


  const handleDelete = async (
    id
  ) => {
    try {
      await api.delete(
        `/pantry/${id}`,
        authConfig()
      );

      fetchItems();
      fetchSmartSuggestions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete pantry item"
      );
    }
  };


  const getExpiryStatus = (
    expiryDate
  ) => {
    if (!expiryDate) return null;

    const today = new Date();

    const expiry = new Date(
      expiryDate
    );

    const diff = Math.ceil(
      (expiry - today) /
        (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return "Expired";

    if (diff <= 2) return "Use Soon";

    if (diff <= 7) return "This Week";

    return "Fresh";
  };

  return (
    <DashboardLayout title="Pantry">


      <div className="pantry-stats-grid">

        <div className="stats-card total-card">
          <p>Total Items</p>
          <h2>{items.length}</h2>
        </div>

        <div className="stats-card soon-card">
          <p>Expiring Soon</p>
          <h2>{expiringSoonCount}</h2>
        </div>

        <div className="stats-card expired-card">
          <p>Expired</p>
          <h2>{expiredCount}</h2>
        </div>

        <div className="stats-card stock-card">
          <p>Low Stock</p>
          <h2>{lowStockCount}</h2>
        </div>

        <div className="stats-card health-card">
          <p>Pantry Health</p>
          <h2>{pantryHealth}%</h2>
        </div>

        <div className="stats-card value-card">
          <p>Estimated Cost</p>
          <h2>
            ₹
            {estimatedCost.toLocaleString()}
          </h2>
        </div>

      </div>


      {smartSuggestions.length > 0 && (

        <div className="page-card smart-panel mb-4">

          <div className="pantry-header-block">
            <h2>
              Smart Grocery Suggestions
            </h2>

            <p>
              Based on low stock,
              frequent usage and expiry
              patterns.
            </p>
          </div>

          <div className="smart-grid">

            {smartSuggestions.map(
              (item) => (
                <div
                  className="smart-card"
                  key={item._id}
                >

                  <strong>
                    {item.name}
                  </strong>

                  <div className="smart-tags">

  {item.reasons?.lowStock && (
    <span className="low-stock-tag">
      Low Stock
    </span>
  )}

  {item.reasons?.frequent && (
    <span className="frequent-tag">
      Frequently Used
    </span>
  )}

  {item.reasons?.expiringSoon && (
    <span className="expiry-tag">
      Expiring Soon
    </span>
  )}

</div>

                </div>
              )
            )}

          </div>

        </div>
      )}


      <div className="row g-4">


        <div className="col-xl-5">

          <div className="page-card pantry-form-card">

            <div className="pantry-header-block">

              <h2>
                Quick Add by Category
              </h2>

              <p>
                Tap common household
                items to add instantly.
              </p>

            </div>

            <div className="pantry-filters mb-3">

              {categories.map(
                (category) => (

                  <button
                    type="button"
                    key={category}
                    className={`btn btn-sm rounded-pill ${
                      selectedCategory ===
                      category
                        ? "btn-success"
                        : "btn-outline-dark"
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                  >
                    {category}
                  </button>
                )
              )}

            </div>

            <div className="quick-add-grid">

              {quickAddItems.map(
                (item) => {
                  const itemKey = `${item.category}:${item.name}:${item.unit}`;

                  return (

                  <button
                    type="button"
                    key={item.name}
                    className="quick-add-card"
                    disabled={
                      quickAddPending ===
                      itemKey
                    }
                    onClick={() =>
                      handleQuickAdd(item)
                    }
                  >

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.unit}
                    </span>

                    <small>
                      ₹{item.price} •{" "}
                      {
                        item.shelfLife
                      }
                      d life
                    </small>

                  </button>
                  );
                }
              )}

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

            <div className="pantry-list-header">

              <div>

                <h2>
                  Kitchen Snapshot
                </h2>

                <p>
                  Your pantry inventory.
                </p>

              </div>

              <input
                className="form-control pantry-search"
                placeholder="Search pantry"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {filteredItems.length ===
            0 ? (

              <p className="placeholder-text">
                No pantry items found.
              </p>

            ) : (

              <div className="pantry-grid">

                {filteredItems.map(
                  (item) => {

                    const expiryStatus =
                      getExpiryStatus(
                        item.expiryDate
                      );

                    return (

                      <div
                        className="pantry-item-card"
                        key={item._id}
                      >

                        <div className="pantry-item-top">

                          <div>

                            <h3>
                              {item.name}
                            </h3>

                            <span className="pantry-meta">
                              {
                                item.quantity
                              }{" "}
                              {
                                item.unit
                              }{" "}
                              •{" "}
                              {item.category ||
                                "Other"}
                            </span>

                          </div>

                          <div className="pantry-actions">

                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                handleConsume(
                                  item._id
                                )
                              }
                            >
                              Consume
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDelete(
                                  item._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                        <div className="pantry-badges">

                          <span className="info-badge">
                            ₹
                            {item.price ||
                              0}
                          </span>

                          {item.quantity <=
                            (item.minimumStock ||
                              2) && (
                            <span className="info-badge low-stock-badge">
                              Low Stock
                            </span>
                          )}

                          {expiryStatus && (
                            <span
                              className={`info-badge status-${expiryStatus
                                .toLowerCase()
                                .replace(
                                  " ",
                                  "-"
                                )}`}
                            >
                              {
                                expiryStatus
                              }
                            </span>
                          )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default PantryPage;
