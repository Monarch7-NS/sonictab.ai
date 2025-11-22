## Technology Stack Overview

This Client-Side Only version of the application uses the following technologies:

### Frontend

- **React (v18.2.0):** Core UI library  
    _References:_ `package.json`, `index.tsx`, `App.tsx`
- **TypeScript (v5.2.2):** Type safety and improved developer experience  
    _References:_ `tsconfig.json`, `types.ts`
- **Vite (v5.1.4):** Fast build tool and development server  
    _References:_ `vite.config.ts`, `package.json`

### Styling

- **Tailwind CSS (v3.4.1):** Utility-first CSS framework for styling  
    _References:_ `index.html` (CDN), `package.json`
- **Lucide React (v0.344.0):** Icon library (e.g., Guitar, Zap, Upload)  
    _References:_ `components/*.tsx`

### Backend / Database

- **None:** This version is client-side only  
    - No Express server
    - No MongoDB database  
    - `server/index.js` and `server/models/*` are empty/commented out

### AI & API Integration

- **Google GenAI SDK (@google/genai):** Connects directly to Gemini API from the browser  
    _References:_ `services/geminiService.ts`  
    - **Model Used:** `gemini-2.5-flash` (see `services/geminiService.ts`)

### Environment Management

- **Dotenv:** Managed by Vite via `loadEnv` for reading `.env` (API Key)  
    _Reference:_ `vite.config.ts`

---

### Reference Links

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Google Gemini SDK](https://npmjs.com/package/@google/genai)
- [Lucide Icons](https://lucide.dev)

---

> To re-enable the backend (Node/Express) and database (MongoDB), revert to the previous MERN version.  
> _Current version: Pure React + Gemini API._