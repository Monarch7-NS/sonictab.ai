# Stage 1: Build the frontend
FROM node:18-alpine AS build
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Serve the backend and frontend
FROM node:18-alpine
WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy the backend source code
COPY backend/ ./backend/

# Copy the built frontend from the build stage
COPY --from=build /app/frontend/dist ./frontend/dist

# Expose the port the app runs on
EXPOSE 5000

# Start the server
CMD ["node", "backend/server.js"]
