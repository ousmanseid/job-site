# Smart Job Portal - Frontend

This is the frontend client for the Smart Job Portal, built with **React**, **Vite**, and **Bootstrap 5**.

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Bootstrap 5 + Custom CSS (Glassmorphism)
- **Routing**: React Router DOM
- **Icons**: React Icons / FontAwesome

## 🛠️ Setup & Installation

**Prerequisites:**
- Node.js (v18 or higher)
- NPM (comes with Node.js)

### 1. Install Dependencies
Navigate to the `frontend` directory and run:

```bash
cd frontend
npm install
```

### 2. Run Development Server
Start the local dev server:

```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 3. Build for Production
To create a production build:

```bash
npm run build
```

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components (Navbar, JobCard, etc.)
│   ├── App.jsx           # Main application layout
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML entry point
└── vite.config.js        # Vite configuration & Proxy
```

## 🔌 Backend Integration

The frontend assumes the backend is running on `http://localhost:8080`.
API requests are proxied via `vite.config.js` to avoid CORS issues during development.
