#!/bin/bash

# Kill any existing processes on ports 8000 and 5173 to ensure a clean start
echo "Cleaning up ports..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "Starting LegalOS 4.0 Services..."

# Use npx concurrently to run both services
# Backend: port 8000 (standard)
# Frontend: default vite port
npx concurrently \
  -n "BACKEND,FRONTEND" \
  -c "blue,green" \
  "cd backend && ./venv/bin/python -m uvicorn app.main:app --reload --port 8000" \
  "cd frontend && npm run dev"
