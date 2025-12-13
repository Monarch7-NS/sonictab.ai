# Week 4 Progress Report - TabSense AI
**Team:** Anas Mohamed Draoui
**Date:** December 11, 2025

## Accomplishments This Week
- Successfully transitioned from client-side mock services to a fully operational Node.js & Express API
- Connected application to live MongoDB database using mongoose
- Implemented automated admin seeding logic that creates default admin credentials (admin/admin) on server startup
- Configured Vite proxy to route `/api` requests to backend (port 5000), resolving CORS issues
- Developed `safeFetch` utility in `services/backend.ts` to handle non-JSON error responses and prevent frontend crashes
- Implemented `.env` file support for secure API_KEY and MONGODB_URI configuration
- Fixed critical module import conflicts by removing manual importmap from `index.html`
- Refactored API routes to ensure consistent JSON error responses (500/400 status codes)
- Generated comprehensive Technical Architecture Report documenting system design and data flow
- [Repository Link](GitHub Link)

## Challenges Faced
- **"Unexpected end of JSON input" crashes**: Frontend crashed when backend returned plain text or HTML errors instead of JSON
  - **Resolved**: Implemented `safeFetch` wrapper to inspect response headers and safely parse text/HTML errors
- **Module Import Conflicts**: Application failed to load due to conflict between Vite's bundler and manual `<script type="importmap">`
  - **Resolved**: Removed manual import map and configured `vite.config.ts` to handle all dependency aliases natively
- **Environment Variable Exposure**: React requires different configuration than Node.js for environment variables
  - **Resolved**: Configured `vite.config.ts` to properly expose `process.env.API_KEY` to client build
- **Admin Access in Fresh Database**: Difficulty creating first administrative user
  - **Resolved**: Created self-executing `seedAdmin()` function in backend entry point

## AI Tool Usage This Week
- **Gemini 2.5 Flash (Debugging)**: Analyzed "Unexpected end of JSON" stack trace and generated the `safeFetch` wrapper code
- **Gemini 2.5 Flash (Documentation)**: Analyzed entire codebase to generate academic-style Technical Architecture Report
- **AI Coding Assistant**: Refactored `server.js` for better error status codes and generated secure `.env` configuration structure
- **Gemini 3 Pro**: Consulted for Vite Proxy configuration best practices for seamless local development between ports 3000 and 5000
- **Key Learning**: Learned how to properly handle error response types in full-stack applications and implement robust error boundaries

## Individual Contributions
- **Anas Mohamed Draoui**: 
  - System Integration (React Frontend ↔ Express Backend, Vite Proxy, Environment Variables, Fetch logic debugging) - 10 hours
  - Backend Engineering (server.js, db.js connectivity, Admin Seeding, Auth Middleware) - 6 hours
  - Documentation (System Architecture Report compilation and formatting) - 1 hour
  - **Total: ~ 17 hours**

## Plan for Next Week
- **Cloud Deployment**: Migrate local MongoDB to MongoDB Atlas and deploy Node.js server to hosting provider (Render/Vercel)
  - Acceptance Criteria: Application accessible via public URL with persistent cloud database
- **Export Functionality**: Implement "Download as PDF" feature for generated tabs (currently only .txt supported)
  - Acceptance Criteria: Users can download tabs in both .txt and .pdf formats
- **User Profile Management**: Allow users to update passwords and view saved tab statistics
  - Acceptance Criteria: Profile page with functional password update form and tab statistics dashboard

## Questions/Blockers
- **Audio Storage Strategy**: As we move to cloud deployment, storing large Base64 audio strings in MongoDB is inefficient. Need to decide between:
  - Implementing MongoDB GridFS for binary storage
  - Using external S3 bucket for audio persistence
  - Seeking guidance on best practice for audio file storage in production environment

## Link to Commits
- github : https://github.com/Monarch7-NS/Tabsense.ai.git

-git commit -m "feat: integrate full-stack architecture with Node.js/Express and MongoDB

Major overhaul transitioning from client-side mock services to fully operational backend.

Backend:
- Initialize Express.js server with JWT authentication and bcrypt password hashing
- Implement MongoDB connection via Mongoose with automated admin seeding
- Create REST API endpoints for user auth (register/login) and tab CRUD operations
- Add error handling middleware for consistent JSON responses

Frontend:
- Configure Vite proxy to bridge port 3000 -> 5000
- Replace mock backend.ts with safeFetch utility for robust error handling
- Implement secure environment variable loading via .env
- Fix module resolution conflicts in index.html

Documentation:
- Add comprehensive System Architecture Report (Week 4)

BREAKING CHANGE: Backend now requires MongoDB instance and .env configuration"

- github : https://github.com/Monarch7-NS/Tabsense.ai.git