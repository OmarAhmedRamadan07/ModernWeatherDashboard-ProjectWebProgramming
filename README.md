# 🌤️ Modern Weather Dashboard

> A full-stack weather web application built as a **Web Programming course project** at **El Sewedy University of Technology (SUTech)** — Data Science & AI Department.

---

## 📝 Project Description

Modern Weather Dashboard is a full-stack web application that displays real-time weather data, forecasts, and location-based information for any city in the world. The frontend automatically detects the user's location, lets them search for other cities by text or voice, and shows current conditions alongside a 13-day forecast and an hourly breakdown of precipitation, wind, humidity, and UV index. An interactive map allows getting weather data for any point clicked on it.

The background video and ambient sound change dynamically to match the current weather condition and time of day, giving the dashboard a more immersive, "living" feel. Users can save their favorite cities, which are stored on a backend server connected to a cloud database, so the list persists across sessions.

The project is split into two connected parts: a static frontend hosted on Vercel, and a Node.js/Express backend hosted on Railway that handles visit tracking, search history, and favorite cities using MongoDB Atlas as the database.

---

## 👨‍💻 Developer

| Field                | Info                                        |
| -------------------- | ------------------------------------------- |
| **Name**       | Omar Ahmed Ramadan                          |
| **University** | El Sewedy University of Technology (SUTech) |
| **Department** | Data Science & Artificial Intelligence      |
| **Course**     | Web Programming                             |
| **Year**       | 2026                                        |

---

## 🔗 Live Links

| Resource          | URL                                                                                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🌐 Live Demo      | [modern-weather-dashboard-project-we.vercel.app](https://modern-weather-dashboard-project-we.vercel.app/)                                                                    |
| 📦 GitHub Repo    | [github.com/OmarAhmedRamadan07/ModernWeatherDashboard-ProjectWebProgramming-SUTec](https://github.com/OmarAhmedRamadan07/ModernWeatherDashboard-ProjectWebProgramming-SUTec) |
| ⚙️ Backend API  | [modernweatherdashboard-projectwebprogramming-sut-production.up.railway.app](https://modernweatherdashboard-projectwebprogramming-sut-production.up.railway.app)             |
| 📊 Visit Stats    | [/api/stats](https://modernweatherdashboard-projectwebprogramming-sut-production.up.railway.app/api/stats)                                                                   |
| 🔍 Search History | [/api/searches](https://modernweatherdashboard-projectwebprogramming-sut-production.up.railway.app/api/searches)                                                             |
| ⭐ Favorites      | [/api/favorites/:sessionId](https://modernweatherdashboard-projectwebprogramming-sut-production.up.railway.app/api/favorites/SESSION_ID)                                     |


▲ Vercel Project Dashboard

🚂 Railway Project Dashboard

🖼️ Cloudinary Console

🍃 MongoDB Atlas

🧭 MongoDB Compass  used locally to debug the Atlas connection

---


## ✨ Features

### 🌍 Weather & Data

- Auto-detects user location using browser Geolocation API
- Real-time weather data from **Open-Meteo API** (free, no API key required)
- City search using **Nominatim (OpenStreetMap)** geocoding
- Smart fallback search — finds nearest match if exact city not found
- Voice search using **Web Speech API**
- 13-day forecast with cards, sortable table, and interactive line chart
- Hourly forecast with 4 tabs: Precipitation, Wind, Humidity, UV Index
- Live local clock for any searched city (fully timezone-aware)
- Current conditions: Wind speed & direction, Humidity, UV Index, Pressure, Sunrise, Sunset

### 🎥 Dynamic Backgrounds & Sound

- Animated video backgrounds that change based on weather condition and time of day
- 9 weather video states: Clear Day, Clear Night, Clouds Light, Clouds Heavy, Rain Light, Rain Heavy, Storm, Snow, Fog (fallback)
- 14 ambient sound effects: Storm, Rain, Snow, Wind, Clear Day/Night, Click, Success, Error
- All media hosted on **Cloudinary CDN** for fast global delivery
- Lazy-loaded audio — sounds only load when needed to save bandwidth
- Day/night detection using `is_day` field from Open-Meteo API

### 🗺️ Interactive Map

- Powered by **Leaflet.js** with **CARTO Voyager** tile layer
- Click anywhere on the map to get weather for that location
- Smooth `flyTo` animation when switching cities
- Scroll-to-zoom disabled by default (enabled when map is focused)
- Auto-reverse geocoding using Nominatim for clicked coordinates

### 🎨 UI & Design

- Glassmorphism design with backdrop blur effects
- Dark Mode / Light Mode toggle with localStorage persistence
- Day/night CSS overlay on background video (darker at night, lighter in day)
- Floating weather icons with CSS animations
- Fully responsive — mobile, tablet, and desktop
- Custom scrollbars, smooth transitions, and hover effects
- SweetAlert2 for beautiful alerts, toasts, and loading indicators

### ⭐ Backend Features

- **Visit counter** — tracks daily and total page visits
- **City search history** — logs every searched city with frequency and timestamp
- **Favorite cities** — save up to 10 cities per user using a unique session ID
- Session ID stored in `localStorage` — persists across browser sessions
- All data stored in **MongoDB Atlas** cloud database

---

## 🛠️ Full Tech Stack

### Frontend

| Technology        | Version/Source   | Purpose                            |
| ----------------- | ---------------- | ---------------------------------- |
| HTML5             | —               | Structure                          |
| CSS3              | —               | Styling, animations, glassmorphism |
| JavaScript (ES6+) | —               | All frontend logic                 |
| Leaflet.js        | v1.9.4           | Interactive map                    |
| Chart.js          | Latest CDN       | Temperature forecast line chart    |
| SweetAlert2       | v11              | Alerts, toasts, loading UI         |
| Web Speech API    | Browser built-in | Voice search                       |
| Geolocation API   | Browser built-in | Auto location detection            |

### Backend

| Technology         | Version  | Purpose                        |
| ------------------ | -------- | ------------------------------ |
| Node.js            | v24.15.0 | Runtime environment            |
| Express.js         | v4.18.2  | REST API framework             |
| Mongoose           | v8.3.4   | MongoDB ODM                    |
| CORS               | v2.8.5   | Cross-origin requests          |
| express-rate-limit | v7.2.0   | API rate limiting (60 req/min) |
| dotenv             | v16.4.5  | Environment variables          |

### External APIs & Services

| Service                   | Purpose                               | Cost       |
| ------------------------- | ------------------------------------- | ---------- |
| Open-Meteo                | Weather data (current, hourly, daily) | Free       |
| Nominatim (OpenStreetMap) | City geocoding & reverse geocoding    | Free       |
| Cloudinary                | Video & audio CDN hosting             | Free tier  |
| MongoDB Atlas             | Cloud database (M0 cluster)           | Free tier  |
| Railway                   | Backend hosting & deployment          | Free trial |
| Vercel                    | Frontend hosting & deployment         | Free       |
| GitHub                    | Version control & source code         | Free       |

## 📡 Backend API Reference

**Base URL:** `https://modernweatherdashboard-projectwebprogramming-sut-production.up.railway.app`

### Visit Tracking

| Method   | Endpoint       | Description                                      |
| -------- | -------------- | ------------------------------------------------ |
| `POST` | `/api/visit` | Register a new page visit                        |
| `GET`  | `/api/stats` | Get visit statistics (today, total, last 7 days) |

**Stats Response Example:**

```json
{
  "today": 9,
  "total": 37,
  "last7Days": [
    { "date": "2026-06-29", "count": 9 },
    { "date": "2026-06-28", "count": 28 }
  ]
}
```

### City Search Tracking

| Method   | Endpoint          | Description                               |
| -------- | ----------------- | ----------------------------------------- |
| `POST` | `/api/searches` | Log a city search                         |
| `GET`  | `/api/searches` | Get all cities sorted by search frequency |

**Searches Response Example:**

```json
{
  "total": 4,
  "cities": [
    { "city": "zagazig", "count": 4, "lastSearch": "2026-06-29T00:10:38.631Z" },
    { "city": "cairo", "count": 1, "lastSearch": "2026-06-29T00:16:26.839Z" }
  ]
}
```

### Favorite Cities

| Method     | Endpoint                            | Description                       |
| ---------- | ----------------------------------- | --------------------------------- |
| `GET`    | `/api/favorites/:sessionId`       | Get saved cities for a user       |
| `POST`   | `/api/favorites`                  | Save a city to favorites (max 10) |
| `DELETE` | `/api/favorites/:sessionId/:city` | Remove a city from favorites      |

---

## 📁 Project Structure

```
ModernWeatherDashboard-ProjectWebProgramming-SUTec/
│
├── index.html                  # Main HTML entry point
├── README.md                   # Project documentation
│
├── css/
│   └── style.css               # All styles — dark/light mode, glassmorphism, responsive
│
├── js/
│   └── app.js                  # All frontend logic — weather, map, audio, backend calls
│
├── images/                     # Weather condition icons (PNG)
│   ├── clear.png
│   ├── Few-clouds.png
│   ├── Moderate-rain.png
│   └── ...
│
├── manifest.json               # PWA manifest
│
└── backend/
    ├── server.js               # Express server + all API routes
    ├── package.json            # Node.js dependencies
    ├── .env                    # Environment variables (not committed to Git)
    └── .gitignore              # Excludes node_modules and .env
```

---

## 🗄️ Database Schema (MongoDB Atlas)

### Visitors Collection

```
date: String (YYYY-MM-DD, unique)   — daily counter key
count: Number                        — visits on that day
```

> Special document `{ date: "__total__" }` stores the all-time total for O(1) lookup.

### Searches Collection

```
city: String (lowercase, unique)    — city name
count: Number                        — times searched
lastSearch: Date                     — last time it was searched
```

### FavoriteCities Collection

```
sessionId: String                   — unique user session ID
city: String                        — city name
country: String                     — country code (e.g. "EG")
lat: Number                         — latitude
lon: Number                         — longitude
addedAt: Date                       — when it was saved
```

> Compound unique index on `{ sessionId, city }` prevents duplicates.

---

## 🚀 Setup & Running Locally

### Prerequisites

- Node.js v18+ installed
- MongoDB Atlas account (free)

### Frontend

```bash
# Just open index.html in any browser
# Or serve with a local server:
npx serve .
```

### Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/weatherDashboard?appName=Cluster0
PORT=3000
```

```bash
npm start
# Output: 🚀 Server running on port 3000
#         ✅ MongoDB Connected
```

### Deployment

- **Frontend** → Push to GitHub → Auto-deploy on Vercel
- **Backend** → Push to GitHub → Auto-deploy on Railway (root directory: `/backend`)

---

## 📄 License

This project was developed for academic purposes as part of the **Web Programming course** at **El Sewedy University of Technology (SUTech)** — Data Science & AI Department, 2026.