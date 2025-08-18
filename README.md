# Options Visualization Tool

A frontend-only options visualization tool with TradingView-style charts for treasury teams to analyze their options positions overlaid on real FET/USD historical price data.

## ✨ Features

- **📊 TradingView Candlestick Charts**: Professional financial charting with real FET/USD OHLC data
- **🎯 Modal Option Entry**: Easy-to-use interface for entering option data (calls/puts)
- **📈 Smart Overlays**: Strike price lines + arrow markers at expiry dates with size-based styling
- **🎨 Color-coded Visualization**: Visual representation of option types and sizes on price charts
- **⏰ Extended Timeline**: 2+ years historical data + extended timeline through 2027 for planning
- **📱 Responsive Design**: Modern, dark-themed UI optimized for financial analysis
- **💾 Data Persistence**: Options saved automatically with portfolio summary dashboard

## 🏗️ Frontend-Only Structure

```
optionsviz/
├── src/
│   └── client/                # React/Vite frontend application
│       ├── components/        # React components (OptionModal)
│       ├── App.tsx            # Main application with TradingView charts
│       ├── main.tsx           # React entry point
│       └── *.css              # Styling and themes
├── dist/client/               # Vite production build output
├── docs/                      # Project documentation
├── public/                    # Static assets
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── vite.config.ts             # Build configuration
```

## 🚀 Quick Start

### Simple Setup
```bash
npm install && npm run dev
```
**That's it!** This starts the frontend application:
- 🌐 **Application**: `http://localhost:5173` (React/Vite)
- 📊 **Data**: All FET/USD historical data embedded
- 💾 **Options**: Stored in browser localStorage
- 🔄 **Hot Reload**: Automatically updates on code changes

### Development Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

**Access Points**:
- 🌐 **Application**: `http://localhost:5173`
- 📊 **Data Source**: Embedded FET/USD historical data + localStorage options

## 📖 Usage Guide

### 📊 Chart Interface
- **Real FET/USD Data**: Professional candlestick chart with 2+ years of historical data (2023-2025)
- **Extended Timeline**: Projects through 2027 for long-term option planning
- **Chart Controls**: Timeframe selector, volume toggle, zoom reset
- **Professional Theme**: Dark gradient design with TradingView-style interface

### ➕ Adding Options
1. **Click "Add Option"** to open the modal interface
2. **Fill Option Details**:
   - Option Type: Call or Put
   - Strike Price: Target price level (in USDT)
   - Expiry Date: Must be future date (after Dec 19, 2024)
   - Position Size: Amount in FET tokens (supports millions)
3. **Submit**: Option appears immediately on chart

### 👁️ Visual Overlays
**Options appear as smart overlays**:
- **📏 Strike Lines**: Horizontal lines at strike price levels
  - Solid lines for larger positions
  - Color: Green (calls) / Red (puts)
  - Brightness indicates position size
- **📍 Expiry Markers**: Arrow markers at expiry dates
  - ⬆️ Upward arrows for calls
  - ⬇️ Downward arrows for puts
  - Size scales with position amount

### 🎨 Color & Size Coding
- **🟢 Small Positions**: < 2M FET (standard styling)
- **🔶 Medium Positions**: 2M-5M FET (enhanced thickness)
- **🔴 Large Positions**: > 5M FET (bright colors, thick lines)

### 📊 Portfolio Dashboard
- **Summary Stats**: Total options, size, calls/puts breakdown
- **Option List**: All positions with details and delete buttons
- **Real-time Updates**: Automatically syncs with chart overlays
- **Persistent Storage**: Options saved in browser localStorage

## 🛠️ Technology Stack

**Frontend-Only Application**:
- **Language**: TypeScript throughout
- **Framework**: React 18 + Vite with modern hooks pattern
- **Charts**: TradingView Lightweight Charts (professional financial charting)
- **Build System**: Vite with TypeScript
- **Development**: Hot reload development server
- **Styling**: Modern dark theme, responsive design, CSS custom properties
- **Data Storage**: Browser localStorage for options, embedded historical data

**Architecture Highlights**:
- 🎯 **Pure Frontend**: No server required - runs entirely in the browser
- ⚡ **Performance**: Fast builds, efficient memory usage, instant startup
- 🔒 **Type Safety**: Strict TypeScript configuration with full type coverage
- 🔄 **Hot Reload**: Instant updates during development
- 📦 **Deployable**: Works on any static hosting platform

## ✅ Project Status

**🎯 Production Ready** - Frontend-only options visualization tool

**Recently Completed**:
- ✅ **Frontend-Only Architecture**: Pure browser-based application with embedded data
- ✅ **TypeScript Configuration**: Optimized for frontend development
- ✅ **Development Workflow**: Single `npm run dev` starts the application
- ✅ **Build System**: Production builds generate optimized static assets
- ✅ **Professional UI**: Enhanced chart controls, portfolio dashboard, responsive design

**Core Features**:
- ✅ **Real FET/USD Data**: 2+ years historical OHLCV data embedded in application
- ✅ **TradingView Charts**: Professional candlestick visualization with volume
- ✅ **Options Overlays**: Circular markers at strike/expiry intersections with size-based styling
- ✅ **Modal Interface**: User-friendly option entry with validation
- ✅ **Portfolio Management**: Summary dashboard with CRUD operations
- ✅ **Data Persistence**: Browser localStorage for seamless experience
- ✅ **Type Safety**: Full TypeScript with strict configuration

**🚀 Ready For**:
- Treasury team deployment on any static hosting
- Instant setup and usage (no server required)
- Offline usage after initial load

**🔮 Future Enhancements**:
- 📊 Option profit/loss calculations and Greeks
- 📈 Additional cryptocurrencies and trading pairs  
- 📤 CSV export functionality for portfolio data
- 📊 Advanced chart indicators and technical analysis
- 🔔 Expiration alerts and notifications
