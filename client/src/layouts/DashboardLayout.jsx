

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  clearAuthData,
  getUser,
} from "../utils/storage";

import "../styles/DashboardLayout.css";

function DashboardLayout({
  title,
  children,
}) {
  const { pathname } =
    useLocation();

  const navigate =
    useNavigate();

  const user = getUser();

  const navItems = [
    {
      to: "/dashboard",
      label: "Home",
      short: "Home",
      icon: "🏠",
    },

    {
      to: "/pantry",
      label: "Pantry",
      short: "Pantry",
      icon: "🥫",
    },

    {
      to: "/recipes",
      label: "Recipes",
      short: "Recipes",
      icon: "🍲",
    },

    {
      to: "/meal-planner",
      label: "Planner",
      short: "Plan",
      icon: "📅",
    },

    {
      to: "/grocery-list",
      label: "Grocery",
      short: "List",
      icon: "🛒",
    },
  ];

  const handleLogout = () => {
    clearAuthData();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="dashboard-shell">

      {/* BACKGROUND BLOBS */}

      <div className="bg-blur bg-one"></div>
      <div className="bg-blur bg-two"></div>

      <div className="dashboard-main container">

        {/* HEADER */}

        <header className="app-header">

          <div className="header-left">

            <div className="welcome-badge">
              ✨ Smart Kitchen
            </div>

            <p className="app-welcome">

              {user?.name
                ? `Hi, ${user.name}`
                : "Welcome back"}

            </p>

            <h1 className="app-title">
              {title}
            </h1>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </header>

        {/* DESKTOP NAV */}

        <nav className="top-nav d-none d-md-flex">

          {navItems.map((item) => (

            <Link
              key={item.to}
              to={item.to}
              className={`nav-pill ${
                pathname === item.to
                  ? "active"
                  : ""
              }`}
            >

              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </Link>

          ))}

        </nav>

        {/* PAGE */}

        <main className="page-content">
          {children}
        </main>

      </div>

      {/* MOBILE NAV */}

      <nav className="bottom-nav d-md-none">

        {navItems.map((item) => (

          <Link
            key={item.to}
            to={item.to}
            className={`bottom-nav-item ${
              pathname === item.to
                ? "active"
                : ""
            }`}
          >

            <span className="bottom-icon">
              {item.icon}
            </span>

            <span>
              {item.short}
            </span>

          </Link>

        ))}

      </nav>

    </div>
  );
}

export default DashboardLayout;