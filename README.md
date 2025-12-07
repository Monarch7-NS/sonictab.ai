# TabSense AI

TabSense is an AI-powered guitar tablature studio that listens to audio, researches official charts online, and generates professional ASCII tabs using the Gemini Flash 2.5 model.

## Project Structure

This project is organized as a full-stack application.

```
/
├── components/          # React UI Components
│   ├── AudioRecorder.tsx
│   ├── Header.tsx
│   ├── Library.tsx
│   ├── Login.tsx
│   ├── SongConfiguration.tsx
│   └── TabDisplay.tsx
├── server/              # Backend API (Express + MongoDB)
│   ├── models/          # Mongoose Schemas
│   │   ├── Tab.js
│   │   └── User.js
│   └── server.js        # Express App Entry Point
├── services/            # Frontend Services
│   ├── backend.ts       # API Client (Currently using LocalStorage Mock)
│   └── gemini.ts        # AI Generation Service
├── App.tsx             # Main Application Logic
├── index.html          # Entry Point
├── index.tsx           # React Root
└── types.ts            # TypeScript Definitions
```

## Setup & Installation

### Frontend (Client)
The frontend is built with React, Tailwind CSS, and Vite.
1. `npm install`
2. `npm run dev`

### Backend (Server)
The `server/` folder contains the production-ready Node.js code requested.
1. Navigate to `server/`
2. `npm install express mongoose cors dotenv jsonwebtoken bcryptjs`
3. Create a `.env` file with `MONGODB_URI` and `JWT_SECRET`.
4. Run `node server.js`

> **Note:** The current live demo uses a **Mock Backend** (`services/backend.ts`) that simulates the Express/MongoDB behavior using browser LocalStorage so you can test the full flow (Login, Save, Library) without setting up a local database.
