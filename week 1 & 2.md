# Week 1 and 2 Progress Report - SonicTab AI
**Team:** anas mohamed draoui
**Date:** November 27, 2025

## Accomplishments This Week
- Initialized React + Vite + TypeScript project structure with Tailwind CSS.
- Integrated @google/genai SDK for client-side audio processing.
- Engineered "Hybrid Research" system prompt to cross-reference Ultimate-Guitar, Songsterr, and GuitareTab.
- Created Drag & Drop FileUploader.
- Built custom AudioPlayer with seeking.
- Developed TuningConfig for Song Title/Artist metadata.
- Implemented TabViewer with "Copy to Clipboard" and "Download .txt".
- Resolved local dev issues by removing CDN importmap conflicts and standardizing npm packages.
- Switched from gemini-3-pro to gemini-2.5-flash for stable, free-tier AI.
- [Initial Commit: Project Setup]
- [Feat: Add Deep Research Protocol to Gemini Service]
- [Fix: Revert to Gemini Flash 2.5 to fix Quota 429]
- [Fix: Repair TuningConfig.tsx and remove ImportMaps]

## Challenges Faced
- API quota limits with gemini-3-pro-preview (Error 429).
    - Resolved by migrating to gemini-2.5-flash.
- Dependency conflicts switching between OpenAI and Google GenAI.
    - Resolved by cleaning package.json and fresh npm install.
- Local dev vs CDN importmap issues.
    - Resolved by removing importmap and configuring vite.config.ts.
- Corrupted TuningConfig.tsx file.
    - Regenerated full component.

## AI Tool Usage This Week
- Gemini 2.5 Flash: Core logic engine for audio analysis and ASCII tablature generation.
- Google Search Tool (Grounding): Used in AI prompt for live web data to improve accuracy.
- AI Coding Assistant: Refactored project structure, debugged TypeScript errors, generated UI components.
- Learned to optimize prompt engineering and leverage AI for rapid prototyping and debugging.
- used gemini 3 pro for tailwind styling and learned so many styles and ways to style a landing page . 

## Individual Contributions
- Frontend Dev: Built TuningConfig and TabViewer interfaces for metadata. - 10 hours
- Backend/Integration: Configured geminiService.ts for file conversion and prompt engineering. - 8 hours
- DevOps: Fixed vite.config.ts polyfills and package.json dependencies. - 2 hours

## Plan for Next Week
- Run "Deep Research" protocol on complex songs to verify AI accuracy.
- Add export options for tabs (PDF, MusicXML if possible).
- Improve UI error handling for network timeouts during "Thinking" phase.

## Questions/Blockers
-api version and accuracy looking for more accurate solutions
-usage of google search and specific tabs website to make the tablature result more accurate
-

## Link to Commits
- [Initial Commit: Project Setup]
- [Feat: Add Deep Research Protocol to Gemini Service]
- [Fix: Revert to Gemini Flash 2.5 to fix Quota 429]
- [Fix: Repair TuningConfig.tsx and remove ImportMaps]

- github : https://github.com/Monarch7-NS/Tabsense.ai.git