#!/bin/bash

echo "🚀 Starting Options Visualization Tool (Unified TypeScript Stack)..."

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

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build server TypeScript
echo "🔨 Building TypeScript server..."
npm run server:build

echo "🎯 Starting development servers..."
echo "📊 Server will be available at: http://localhost:8000"
echo "🎨 Client will be available at: http://localhost:5173"
echo ""
echo "⚡ Running 'npm run dev' - this starts both client and server!"

# Start both client and server in development mode
npm run dev
