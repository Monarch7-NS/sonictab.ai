# TabSense AI

TabSense is an AI-powered guitar tablature studio that listens to audio, researches official charts online, and generates professional ASCII tabs using the Gemini Flash 2.5 model.

## Project Structure

This project is organized as a full-stack application.

```
/
├── components/          # React UI Components
├── server/              # Backend API (Express + MongoDB) for production
│   ├── models/          # Mongoose Schemas
│   └── server.js        # Express App Entry Point
├── services/            # Frontend Services
│   ├── backend.ts       # Mock API Client (Simulates Backend in Browser)
│   └── gemini.ts        # AI Generation Service
├── App.tsx             # Main Application Logic
├── index.html          # Entry Point
└── types.ts            # TypeScript Definitions
```

## Setup & Installation

### Frontend (Client)
The frontend is built with React, Tailwind CSS, and Vite.
1. `npm install`
2. `npm run dev`

### Backend (Server)
The `server/` folder contains the production-ready Node.js code.
1. Navigate to `server/`
2. `npm install`
3. Create a `.env` file with `MONGODB_URI` and `JWT_SECRET`.
4. Run `node server.js`

> **Note:** The current live preview uses a **Mock Backend** (`services/backend.ts`) that simulates the Express/MongoDB behavior using browser LocalStorage so you can test the full flow without setting up a database.