# NutriCart AI

NutriCart AI is a smart kitchen and grocery management platform designed to simplify weekly meal planning, pantry tracking, and grocery shopping.

The platform combines meal planning, pantry intelligence, nutrition insights, and grocery automation into one system so users can organize food decisions more efficiently and reduce unnecessary food waste.

## Features

### Smart Pantry Management

- Add and manage pantry inventory
- Track quantity, pricing, and expiry dates
- Low stock detection
- Pantry health monitoring
- Expiry alerts and smart tracking

### AI Meal Planner

- Create weekly meal plans
- Assign breakfast, lunch, and dinner meals
- Smart nutrition analysis
- AI-based meal insights
- Weekly nutrition breakdown

### Grocery Automation

- Auto-generate grocery lists from meal plans
- Pantry-aware grocery generation
- Skip or purchase grocery items
- Grocery analytics dashboard
- Smart grocery insights
- Estimated grocery cost tracking

### Recipe Management

- Create and save recipes
- Add ingredients and nutrition values
- Organize meal preparation
- Connect recipes directly with planner

### Nutrition Tracking

- Calories monitoring
- Protein, carbs, and fat tracking
- Weekly nutrition overview
- Balanced meal analysis

### Responsive Dashboard

- Mobile-friendly interface
- Modern dashboard UI
- Interactive cards and analytics
- Clean dashboard experience

## Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Bootstrap
- Custom CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Deployment

- Vercel for frontend
- Render for backend
- MongoDB Atlas for database

## Project Structure

```text
NutriCart/
|-- client/
|   |-- src/
|   |-- public/
|   |-- package.json
|
|-- server/
|   |-- src/
|   |   |-- controllers/
|   |   |-- routes/
|   |   |-- models/
|   |   |-- middleware/
|   |   |-- config/
|   |-- package.json
|
|-- screenshots/
|-- README.md
```

## Screenshots

### Landing Page

![Landing Page](./screenshots/landing1.png)
![Landing Page](./screenshots/landing2.png)


### Login Page

![Login Page](./screenshots/login.png)


### Dashboard

![Dashboard](./screenshots/dashboard.png)

### Pantry Management

![Pantry Page](./screenshots/PantryPage.png)

### Meal Planner

![Meal Planner](./screenshots/MealPlanner.png)

### Grocery Intelligence

![Grocery Intelligence](./screenshots/GroceryIntelligence.png)

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/NutriCart.git
cd NutriCart
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

For the frontend, create a `.env` file inside the `client` folder if needed.

```env
VITE_API_URL=http://localhost:5000/api
```

## API Features

### Authentication

- User registration
- User login
- JWT protected routes

### Pantry APIs

- Add pantry item
- Update pantry item
- Consume pantry item
- Smart suggestions

### Meal Planner APIs

- Create weekly plan
- Update weekly plan
- Nutrition insights

### Grocery APIs

- Generate grocery list
- Grocery analytics
- Purchase tracking
- AI grocery insights

## Key Highlights

- Full MERN stack application
- Responsive modern UI
- Pantry-aware grocery automation
- Weekly meal planning workflow
- AI-style smart insights system
- Real-world productivity use case
- Clean component-based architecture

## Future Improvements

- AI recipe recommendation engine
- Barcode scanner integration
- Voice-based grocery assistant
- Family/shared pantry system
- Smart budget optimization
- Real-time notifications

## Author

Isha Shukla

## License

This project is created for educational and portfolio purposes.
