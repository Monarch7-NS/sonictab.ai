# Week 3 Progress Report: TabSense AI

**Team:** Anas Mohamed Draoui  
**Date:** December 4, 2025  
**Project:** TabSense (formerly SonicTab)  
**Repository:** [GitHub Link](https://github.com/Monarch7-NS/sonictab.ai.git)

---

## 1. Executive Summary
This week marked a comprehensive overhaul of the project, including a major rebranding to **TabSense**. We successfully established the full-stack architecture by building a robust Node.js/Express and MongoDB structure, currently simulated via a client-side mock service to enable full authentication and database features (Save/Delete/Retrieve) without a live server. The AI logic was refined with a "Hierarchy of Truth" protocol to improve tab accuracy.

## 2. Technical Accomplishments

### Frontend & UI/UX (The "Sense" Design System)
- **Rebranding:** Transitioned fully from "SonicTab" to **TabSense**.
- **Design Language:** Implemented the "Void Purple" theme with Glassmorphism effects and a dedicated "Sense" design system.
- **Key Components:**
    - **Landing Page:** Animated with floating 3D glass elements and "Blob" background animations.
    - **Tab Editor:** Redesigned with MacOS-style aesthetics and code syntax highlighting.
    - **Audio Player:** Integrated custom audio controls with manual tuning inputs.
    - **Dashboard:** Created "My Library" for managing saved tabs.

### Backend & Architecture
- **Mock Service Layer (`services/backend.ts`):** Developed a complex simulation of a Node.js/Express backend. This bridges the frontend and database logic, allowing for realistic development testing.
- **Authentication:** Implemented secure Login and Registration flows with simulated JWT token management and global state handling.
- **Database Simulation:** Mimicked MongoDB relationships (Schemas for Users and Tabs) using `LocalStorage` to persist data across sessions.

### AI Logic & Integration
- **Grounding & Truth:** Enhanced `gemini.ts` with a strict **"Source of Truth" Hierarchy**:
    1. Official Tabs (Web Search)
    2. Audio Verification
    3. AI Transcription
- **Configuration:** Added `SongConfiguration` to inject metadata (Artist, BPM, Tuning) into the prompt context.
- **Search Integration:** Enabled Google Search grounding to prioritize web research over hallucination.


---

## 3. Challenges & Solutions

| Challenge | Context | Solution |
| :--- | :--- | :--- |
| **State Management** | Managing global auth state (Login/Logout) and DB relationships without a live server. | Created a **Mock Service Layer** with async API simulation to handle session tokens and relational data logic via LocalStorage. |
| **API Key Race Condition** | The Gemini client was initializing before the user selected their key. | Refactored logic to instantiate `GoogleGenAI` strictly within the generation function scope. |
| **Hallucination vs. Fact** | Ensuring the AI prioritizes existing tabs over generating random notes. | Implemented the **"Hierarchy of Truth"** prompt protocol to force research-first verification. |
| **CSS Performance** | "Blob" animations and glass elements causing rendering lag. | Optimized CSS transitions and animation properties for smoother performance. |

---

## 4. AI Tool Usage

- **Gemini 2.5 Flash:** Used for core transcription logic, Mongoose schema generation, and optimizing system prompts.
- **Gemini 3 Pro:** Utilized for high-level Tailwind styling, landing page design, and refactoring TypeScript errors.
- **AI Coding Assistant:** Generated the "Drop Zone" UI, debugged the Auth flow, and scaffolded the Express API routes.
- **Google Search Tool:** Integrated for live web data grounding within the prompts.
- **Lucide React:** Used for consistent UI iconography.
- Learned to optimize prompt engineering and leverage AI for rapid prototyping and debugging.
- Gemini 2.5 Flash: Core logic engine for audio analysis and ASCII tablature generation.
- Google Search Tool (Grounding): Used in AI prompt for live web data to improve accuracy.
- AI Coding Assistant: Refactored project structure, debugged TypeScript errors, generated UI components.
- Learned to optimize prompt engineering and leverage AI for rapid prototyping and debugging.
- used gemini 3 pro for tailwind styling and learned so many styles and ways to style a landing page . 
---

## 5. Individual Contributions

**Anas Mohamed Draoui**

* **Full-Stack Engineering (12 Hours):**
    * Architected the Node.js/Express + MongoDB backend structure.
    * Built the `services/backend.ts` simulation to bridge Frontend and Database logic, enabling JWT Auth and persistence.
* **Frontend & Design (12 Hours):**
    * Implemented the "Sense" design system (Void Purple/Glassmorphism).
    * Developed the animated Landing Page, Login, and Library components.
    * Overhauled the CSS theme and Tab Editor UI.
* **AI Integration (5 Hours):**
    * Refined `gemini.ts` with Google Search Grounding.
    * Designed the "Research-First" prompt engineering protocol.

**Total Time:** ~29 Hours

---

## 6. Roadmap & Blockers

**Plan for Next Week:**
- **Deployment:** Transition from the local Mock Service to a live **Node.js/Express server** connected to **MongoDB Atlas**.
- **Export:** Implement PDF generation for ASCII tabs.
- **Settings:** Add user profile management (password changes, profile updates).

**Questions & Blockers:**
- **Hosting:** Determining the best cost-effective platform for the Node.js backend (Render vs. Heroku).
- **Storage:** Deciding on a strategy for storing audio files (AWS S3 vs. MongoDB GridFS) if persistence is required.