# NutriCart Deployment Guide

NutriCart has two deployable apps:

- `client`: React + Vite frontend
- `server`: Node + Express API

## 1. Upload To GitHub

Create a new empty repository on GitHub named `NutriCart`, then run these commands from `C:\Projects\NutriCart`:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/NutriCart.git
git push -u origin main
```

Do not commit `.env`, `node_modules`, `dist`, or `build`. The root `.gitignore` already excludes them.

## 2. Create MongoDB Atlas Database

Create a MongoDB Atlas cluster, create a database user, allow network access for your deployed server, then copy the driver connection string.

Use that connection string as `MONGO_URI` on the backend host.

## 3. Deploy The Server

On Render, create a new Web Service from the GitHub repo.

Use these settings:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`

Add these environment variables:

```text
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

After deploy, Render gives you a backend URL like:

```text
https://nutricart-api.onrender.com
```

Your API base URL is that URL plus `/api`.

## 4. Deploy The Client

On Vercel, import the same GitHub repo.

Use these settings:

- Framework preset: Vite
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

Add this environment variable:

```text
VITE_API_URL=https://your-render-service.onrender.com/api
```

Redeploy the frontend after adding or changing environment variables.

## 5. Final Connection

After the Vercel URL exists, go back to Render and set:

```text
CLIENT_URL=https://your-vercel-app.vercel.app
```

Redeploy the server once after updating `CLIENT_URL`.
