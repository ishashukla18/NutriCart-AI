import { Link } from "react-router-dom";
import heroGrocery from "../assets/images/nutricart-hero-generated.png";
import ingredientsFlatlay from "../assets/images/ingredients-flatlay.jpg";
import groceryStore from "../assets/images/grocery-store.jpg";
import pantryShelf from "../assets/images/pantry-shelf.jpg";
import "../styles/LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header container">
        <div className="landing-brand">
          <span className="brand-dot" />
          <span>NutriCart</span>
        </div>

        <div className="landing-header-actions">
          <Link to="/login" className="btn btn-outline-dark rounded-pill px-4">
            Login
          </Link>
          <Link to="/register" className="btn btn-success rounded-pill px-4">
            Get Started
          </Link>
        </div>
      </header>

      <main className="container landing-main">
        <section className="hero-section" style={{ "--hero-image": `url(${heroGrocery})` }}>
          <div className="hero-copy">
            <span className="hero-pill">Weekly food planning, simplified</span>

            <h1>NutriCart</h1>

            <p>
              AI-powered meal planning, pantry tracking, and smart grocery automation
built to reduce food waste and simplify weekly cooking.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn btn-success btn-lg rounded-pill px-4">
                Plan My Week
              </Link>
              <Link to="/login" className="btn btn-outline-dark btn-lg rounded-pill px-4">
                Launch Dashboard
              </Link>
            </div>

            <div className="hero-metrics">
              <div className="metric-card">
                <strong>7 days</strong>
                <span>Build a full weekly meal rhythm.</span>
              </div>
              <div className="metric-card">
                <strong>1 list</strong>
                <span>Convert plans into focused shopping.</span>
              </div>
              <div className="metric-card">
                <strong>Less waste</strong>
                <span>Keep pantry decisions visible.</span>
              </div>
            </div>

            <div className="hero-trust-row" aria-label="NutriCart workflow">
              <span>Pantry</span>
              <span>Recipes</span>
              <span>Planner</span>
              <span>Grocery</span>
            </div>
          </div>
        </section>

        <section className="workflow-band" aria-label="NutriCart workflow overview">
          <div>
            <span className="section-eyebrow">How it works</span>
            <h2>From kitchen stock to checkout list.</h2>
          </div>

          <div className="workflow-steps">
            <article>
              <span>01</span>
              <strong>Capture what you have</strong>
              <p>Keep pantry items organized so planning starts with real stock.</p>
            </article>
            <article>
              <span>02</span>
              <strong>Pick meals for the week</strong>
              <p>Turn saved recipes into breakfast, lunch, and dinner slots.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Shop the missing items</strong>
              <p>Generate a simple list from gaps between your plan and pantry.</p>
            </article>
          </div>
        </section>

        <section className="smart-features-section">

  <div className="smart-heading">
    <span className="section-eyebrow">
      Smart Kitchen Intelligence
    </span>

    <h2>
      Built to automate food decisions.
    </h2>

    <p>
      NutriCart combines pantry awareness,
      weekly planning, grocery prediction,
      and nutrition insights into one system.
    </p>
  </div>

  <div className="smart-features-grid">

    <article className="smart-feature-card">
      <h3>AI Meal Suggestions</h3>
      <p>
        Generate recipe recommendations
        using pantry inventory and nutrition patterns.
      </p>
    </article>

    <article className="smart-feature-card">
      <h3>Auto Grocery Planning</h3>
      <p>
        Instantly create shopping lists
        from missing ingredients in your meal plan.
      </p>
    </article>

    <article className="smart-feature-card">
      <h3>Pantry Intelligence</h3>
      <p>
        Track stock levels, expiry alerts,
        and weekly grocery usage automatically.
      </p>
    </article>

    <article className="smart-feature-card">
      <h3>Weekly Nutrition Tracking</h3>
      <p>
        Monitor calories, protein,
        carbs, and meal balance across the week.
      </p>
    </article>

  </div>

</section>

        <section className="feature-strip">
          <article className="feature-box">
            <div className="feature-image-wrap">
              <img src={pantryShelf} alt="Pantry shelf with jars" className="feature-image" />
            </div>
            <span>01</span>
            <h3>Pantry Snapshot</h3>
            <p>Keep a quick view of household stock without heavy manual tracking.</p>
          </article>

          <article className="feature-box">
            <div className="feature-image-wrap">
              <img src={ingredientsFlatlay} alt="Ingredients flat lay" className="feature-image" />
            </div>
            <span>02</span>
            <h3>Meal Planning</h3>
            <p>Build a weekly food flow from saved recipes and common ingredients.</p>
          </article>

          <article className="feature-box">
            <div className="feature-image-wrap">
              <img src={groceryStore} alt="Fresh grocery store vegetables" className="feature-image" />
            </div>
            <span>03</span>
            <h3>Focused Grocery List</h3>
            <p>Generate shopping lists from your meal plan and pantry state.</p>
          </article>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
