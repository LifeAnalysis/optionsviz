#!/bin/bash

echo "🚀 Starting Options Visualization Tool (TypeScript Stack)..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "📥 Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Node.js version (require >= 18)
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "📥 Please update Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install all dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing all dependencies..."
    npm run install:all
fi

# Build backend TypeScript
echo "🔨 Building TypeScript backend..."
npm run backend:build

echo "🎯 Starting development servers..."
echo "📊 Backend will be available at: http://localhost:8000"
echo "🎨 Frontend will be available at: http://localhost:5173"
echo ""
echo "⚡ Running 'npm run dev' - this starts both servers!"

# Start both backend and frontend in development mode
npm run dev
