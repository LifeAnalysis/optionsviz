# Options Visualization Tool

A professional options visualization tool with TradingView-style charts for treasury teams to analyze their options positions.

## Features

- **TradingView Candlestick Charts**: Professional financial charting with OHLC data
- **Modal Option Entry**: Easy-to-use interface for entering option data
- **Dual Visualization**: Strike price lines + circle markers at expiry dates
- **Color-coded Overlays**: Visual representation of option sizes on price charts
- **Extended Timeline**: Historical + projected data through June 2027
- **Responsive Design**: Modern, dark-themed UI optimized for financial analysis

## Project Structure

```
optionsviz/
├── backend/                    # TypeScript/Express backend
│   ├── src/
│   │   ├── types/             # TypeScript interfaces
│   │   ├── database/          # SQLite operations
│   │   ├── data/              # OHLCV data
│   │   └── server.ts          # Express server
│   ├── package.json           # Backend dependencies
│   └── tsconfig.json          # TypeScript config
├── frontend/                  # React/TypeScript frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.tsx            # Main application
│   │   └── main.tsx           # Entry point
│   └── package.json           # Frontend dependencies
└── docs/                      # Project documentation
```

## Quick Start

### Option 1: Super Simple (Recommended) 
```bash
npm run dev
```
**That's it!** This single command:
- Installs all dependencies automatically
- Builds the TypeScript backend
- Starts both backend (port 8000) and frontend (port 5173)
- Enables hot reload for both servers

### Option 2: Easy Start Script
```bash
./start.sh
```
Does the same as Option 1 with additional Node.js version checking.

### Option 3: Manual Setup

1. **Install everything**:
```bash
npm run install:all  # Installs root + backend + frontend deps
```

2. **Build backend**:
```bash
npm run backend:build
```

3. **Start development**:
```bash
npm run dev          # Starts both servers with hot reload
```

### Option 4: Individual Control
```bash
npm run backend:dev   # Backend only (port 8000)
npm run frontend:dev  # Frontend only (port 5173)
```

- Backend API: `http://localhost:8000`
- Frontend App: `http://localhost:5173`

## Usage

1. **View FET/USD Candlestick Chart**: Professional OHLC candlestick chart
   - 📊 **Historical Data**: Real candlesticks from 2023 to August 17, 2025 (today)
   - 📅 **Future Timeline**: Empty timeline extends to June 2027 for option planning
   - 🟢 Green candles: price closed higher than opened
   - 🔴 Red candles: price closed lower than opened
2. **Add Options**: Click the "Add Option" button to open the modal interface
3. **Enter Data**: Fill in option type (call/put), strike price, expiry date, and size
   - ⚠️ **Important**: Expiry date must be after August 17, 2025 (today)
4. **View Overlays**: Options appear as:
   - **Horizontal dashed lines** at strike price levels
   - **Circle markers** at expiry dates on the timeline
5. **Delete Options**: Click the × button on any option to remove it
6. **Color Coding & Sizing**:
   - 🟢 Green: Size < 2M (small circles)
   - 🟠 Orange: Size 2M-5M (medium circles)
   - 🔴 Red: Size > 5M (large circles)
7. **Timeline**: Extended to June 2027 for long-term option planning
8. **Data Persistence**: Options are saved in your browser's local storage

## Technology Stack

- **Backend**: Node.js, Express, TypeScript, SQLite3
- **Frontend**: React, TypeScript, TradingView Lightweight Charts
- **Data Storage**: SQLite database + embedded OHLCV data
- **Runtime**: 100% TypeScript/JavaScript stack
- **Styling**: Modern dark theme with responsive design

## Development Status

✅ **Completed**: 
- **Full TypeScript Stack**: Express backend + React frontend (unified language)
- **TradingView Charts**: Real FET/USD OHLCV candlestick data visualization
- **Complete API**: RESTful endpoints with full CRUD operations for options
- **Type Safety**: End-to-end TypeScript with strict typing and interfaces
- **Professional UI**: Modal interface, portfolio dashboard, enhanced chart controls
- **SQLite Database**: Persistent option storage with proper database operations
- **Modern Architecture**: Clean separation of concerns with modular TypeScript code
- **Performance**: Fast startup, efficient memory usage, rate limiting
- **Error Handling**: Comprehensive validation and error responses
- **Developer Experience**: Hot reload, source maps, strict TypeScript config

🔄 **Production Ready**: Fully typed, performant TypeScript application

📋 **Potential Enhancements**: 
- Export to CSV functionality
- Additional cryptocurrencies
- Advanced chart indicators
- Option profit/loss calculations
