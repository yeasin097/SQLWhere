#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Go to backend directory
echo "🔧 Setting up backend..."
cd backend
npm install
npm start > backend.log 2>&1 &  # run in background and redirect output

# Go back to the root and go to frontend
cd ../frontend
echo "🎨 Setting up frontend..."
npm install
npm run dev > frontend.log 2>&1 &  # run in background and redirect output

echo "✅ Both backend and frontend are running in the background."
