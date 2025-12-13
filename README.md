# TabSense AI

TabSense is an AI-powered guitar tablature studio that listens to audio, researches official charts online, and generates professional ASCII tabs using the Gemini Flash 2.5 model.

## Project Structure

This project is organized into a consolidated Full-Stack structure:

```
/
├── backend/             # Node.js & Express API
│   ├── models/          # Mongoose Schemas (User.js, Tab.js)
│   ├── db.js            # MongoDB Connection Logic
│   └── server.js        # Server Entry Point & Routes
├── frontend/            # React Frontend Source
│   ├── components/      # UI Components (Visuals & Logic)
│   ├── services/        # Service Layer
│   │   ├── backend.ts   # API Client (Fetch Wrapper)
│   │   └── gemini.ts    # AI Generation Service
│   ├── App.tsx          # Main Application State
│   └── types.ts         # TypeScript Definitions
├── .env                 # API Keys & Config (Create this file!)
├── index.html           # Application Entry Point
└── vite.config.ts       # Build Configuration
```

## Setup & Installation

### 1. Configuration (.env)
Create a `.env` file in the root directory and add your keys:

```ini
API_KEY=AIzaSy... (Your Google Gemini API Key)
MONGODB_URI=mongodb://localhost:27017/tabsense
JWT_SECRET=mysecretkey
```

### 2. Backend (Server)
1. Navigate to `backend/`
2. `npm install`
3. Run `node server.js`
   * *Note: Ensure you have MongoDB installed and running locally, or update the MONGODB_URI.*

### 3. Frontend (Client)
1. From the project root: `npm install`
2. Run `npm run dev`

The application uses a proxy to forward `/api` requests from the frontend (port 3000) to the backend (port 5000).
