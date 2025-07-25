# Stage 1: Build the React Vite application
# Use a Node.js image as the base for building the frontend application.
FROM node:20-alpine AS build

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory.
# This allows Docker to cache the npm install step if these files haven't changed.
COPY package*.json ./

# Install project dependencies.
RUN npm install

# Copy the rest of the application source code to the working directory.
COPY . .

# Build the React Vite application for production.
# This command generates the static assets in the 'dist' folder.
RUN npm run build

# Stage 2: Serve the built application
# Use a lightweight web server to serve the static files.
# 'serve' is a simple static file server often used with single-page applications.
FROM node:20-alpine AS serve

# Set the working directory inside the container.
WORKDIR /app

# Install 'serve' globally.
RUN npm install -g serve

# Copy the built application from the 'build' stage.
# The 'dist' directory contains the optimized static files.
COPY --from=build /app/dist ./dist

# Expose port 5173. This tells Docker that the container listens on the specified network port at runtime.
# Vite's dev server typically runs on 5173, and we're maintaining that consistency for serving the built app.
EXPOSE 5173

# Define the command to run when the container starts.
# 'serve -s dist -l 5173' serves the static files from the 'dist' directory on port 5173.
CMD ["serve", "-s", "dist", "-l", "5173"]

