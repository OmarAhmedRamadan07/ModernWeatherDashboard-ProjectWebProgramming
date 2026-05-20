# 🌤️ Modern Weather Dashboard - SUT Project (Pro Edition)

## 📌 1. Project Overview
The **Modern Weather Dashboard** is a fully-fledged, professional-grade Full-Stack Web Application. The application aims to provide accurate, real-time weather information for any city or geographical location worldwide. It features a modern Glassmorphism UI, interactive maps, dynamic backgrounds that change based on weather conditions, and a smart search history system stored in an actual database on a Live Server, making it easy for users to access their locations of interest.

---

## 👥 2. Team Members & Roles
This project was developed as a collaborative effort by **Elsewedy University of Technology (SUT)** students, with tasks professionally distributed as follows:

### 👑 Ahmed Aldmrdash *(Team Leader & AI Engineer)*
* Project management, team coordination, and repository management (GitHub).
* Designing the User Interface (UI/UX), building the core structure (HTML/CSS), and implementing Glassmorphism.
* Programming advanced features (Bonuses): Integrating interactive maps (Leaflet.js), the smart alert and advice system (SweetAlert2), and dynamic backgrounds (Real-life Images).
* Deploying the website and database to a live hosting environment (InfinityFree Deployment).

### 👨‍💻 Omar Ahmed Ramadan *(Frontend & API Integrator)*
* Handling DOM Manipulation to display data dynamically on the interface.
* Integrating the External API (OpenWeatherMap) using `async/await` and `fetch`.
* Extracting and processing 5-day forecast data, and handling coordinates (Latitude & Longitude) to link them with the map.

### 👩‍💻 Shimaa Hussien *(Backend & Database Administrator)*
* Designing and creating the MySQL database on the local environment (XAMPP), then migrating it to the Production Server.
* Programming the PHP scripts (`save_city.php` and `get_history.php`).
* Managing data saving and retrieval operations, and implementing the "Latest on Top" algorithm to display recent searches and prevent data duplication.

---

## 🛠️ 3. Technologies Used
* **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox, Grid, Glassmorphism), Vanilla JavaScript (ES6+).
* **External Libraries:** * `Leaflet.js`: For programming interactive maps.
  * `SweetAlert2`: For the aesthetic alert system and smart notifications.
* **Backend:** PHP 8.x.
* **Database:** MySQL (Cloud Hosted).
* **Version Control:** Git & GitHub.
* **Hosting & Deployment:** InfinityFree (Live Server).
* **API:** OpenWeatherMap API (Weather & Geocoding).

---

## 📡 4. The API Details
We relied on the OpenWeatherMap API as a reliable source for weather data.

### Endpoints Used:
* **Current Weather (By City):** `weather?q={city}` *(To fetch the current weather by city name).*
* **Current Weather (By Coordinates):** `weather?lat={lat}&lon={lon}` *(To fetch weather when clicking any point on the map or when detecting user location).*
* **5-Day Forecast:** `forecast?q={city}` *(To fetch the forecast for the next 5 days at 3-hour intervals).*

### Processing Mechanism:
We used the Fetch API in JavaScript with `Promise.all` to fetch current weather and forecast data concurrently (Parallel Fetching) to reduce loading times. We also integrated loaders from SweetAlert to ensure a smooth user experience.

---

## ⚙️ 5. Advanced Project Features & Logic
Several professional programming concepts (Logic) were implemented, making the application stand out from traditional projects:

* **Auto-Detect Location:** Upon opening the app, `navigator.geolocation` is used to automatically detect the user's location and fetch their city's weather instantly without needing to search.
* **Interactive Map "Click to Explore":** Leaflet.js was integrated to display an interactive map with a "FlyTo" animation towards the searched city. More importantly, the user can click on any point worldwide on the map, and the site will automatically fetch its coordinates, display its weather, and update the entire interface.
* **Dynamic Real-Life Backgrounds:** The weather condition retrieved from the API (e.g., clear, rain, snow, mist) is analyzed to change the entire site background to high-quality, real-life images. This includes handling edge cases like tornadoes and dust, and adding CSS overlays that adjust opacity based on the lighting to ensure text readability.
* **Smart AI-like Advice:** Utilizing SweetAlert2 to show a smart Toast Notification that lasts for 10 seconds. It analyzes the weather and provides advice to the user (e.g., *"It's raining, don't forget your umbrella!"* or *"It's hot, drink plenty of water"*).
* **Dark/Light Mode Toggle:** A theme-switching feature that adjusts text colors, glass panels, and backgrounds for eye comfort, saving the preference in `localStorage`.
* **Auto-Sorting History:** When searching, the city is saved in the database. If the search is repeated, the server deletes the old record and inserts it as the latest search (Latest on Top) so it always appears at the top of the sidebar.

---

## 🗄️ 6. Database Architecture & Deployment
The project was upgraded from a local XAMPP environment to a real Production Server for easy access.

* **Database Name:** `weather_app` (Hosted on InfinityFree).
* **Main Table:** `search_history`
  * `id`: INT (Primary Key, Auto Increment).
  * `city_name`: VARCHAR(255) (To store the city name).
  * `search_date`: TIMESTAMP (Automatically records the search time for sorting purposes).

### Client-Server Communication:
The Frontend sends a `POST` request to `api/save_city.php` to store the city. It then requests `api/get_history.php` to fetch the updated history and display it directly without reloading the page (AJAX-like behavior).

---

## 🐙 7. GitHub Workflow & Live Deployment
To ensure a proper engineering workflow, the following steps were taken:

* **Version Control:** A repository was created on GitHub to track all changes, with clear Commit messages for every added feature (e.g., *Added Leaflet Map, Integrated SweetAlert2*).
* **Live Deployment:** All project files (HTML, CSS, JS, PHP) and the database (MySQL) were uploaded to the free InfinityFree hosting. The `db.php` connection file was configured to link with the cloud server, making the project available for academic review via a direct, live URL.
