import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { OptionEntry, OHLCVResponse, CreateOptionResponse } from './types';
import { optionsDB } from './database';
import { formatOHLCVDataForChart, FET_OHLCV_DATA } from './data/ohlcv-data';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Vite dev server
  credentials: true
}));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Health check endpoint
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Options Visualization API',
    version: '2.0.0',
    runtime: 'Node.js/TypeScript'
  });
});

// OHLCV Data endpoint
app.get('/api/ohlcv-data', (_req, res) => {
  try {
    const ohlcvData = formatOHLCVDataForChart();
    
    const response: OHLCVResponse = {
      symbol: 'FET/USD',
      data: ohlcvData,
      source: 'CoinGecko',
      last_updated: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error formatting OHLCV data:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve OHLCV data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Legacy price data endpoint (for backward compatibility)
app.get('/api/price-data', (_req, res) => {
  try {
    const priceData = FET_OHLCV_DATA.map(([timestampMs, , , , close]) => {
      const timestampSeconds = Math.floor(timestampMs / 1000);
      const dateStr = new Date(timestampSeconds * 1000).toISOString().split('T')[0];
      
      return {
        time: dateStr,
        value: Number(close.toFixed(6))
      };
    });

    const response = {
      symbol: 'FET/USD',
      data: priceData,
      source: 'CoinGecko',
      last_updated: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error formatting price data:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve price data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all options
app.get('/api/options', async (_req, res) => {
  try {
    const options = await optionsDB.getOptions();
    res.json(options);
  } catch (error) {
    console.error('Error retrieving options:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve options',
      message: error instanceof Error ? error.message : 'Database error'
    });
  }
});

// Add new option
app.post('/api/options', async (req, res) => {
  try {
    const optionData: OptionEntry = req.body;
    
    // Validate required fields
    if (!optionData.option_type || !optionData.strike_price || !optionData.expiry_date || !optionData.size) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'option_type, strike_price, expiry_date, and size are required'
      });
      return;
    }

    // Validate option type
    if (!['call', 'put'].includes(optionData.option_type)) {
      res.status(400).json({
        error: 'Invalid option type',
        message: 'option_type must be either "call" or "put"'
      });
      return;
    }

    // Validate numeric fields
    if (typeof optionData.strike_price !== 'number' || optionData.strike_price <= 0) {
      res.status(400).json({
        error: 'Invalid strike price',
        message: 'strike_price must be a positive number'
      });
      return;
    }

    if (typeof optionData.size !== 'number' || optionData.size <= 0) {
      res.status(400).json({
        error: 'Invalid size',
        message: 'size must be a positive number'
      });
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(optionData.expiry_date)) {
      res.status(400).json({
        error: 'Invalid date format',
        message: 'expiry_date must be in YYYY-MM-DD format'
      });
      return;
    }

    const optionId = await optionsDB.addOption(optionData);
    
    const response: CreateOptionResponse = {
      id: optionId,
      message: 'Option added successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error adding option:', error);
    res.status(500).json({ 
      error: 'Failed to add option',
      message: error instanceof Error ? error.message : 'Database error'
    });
  }
});

// Delete option
app.delete('/api/options/:id', async (req, res) => {
  try {
    const optionId = parseInt(req.params.id);
    
    if (isNaN(optionId)) {
      res.status(400).json({
        error: 'Invalid option ID',
        message: 'Option ID must be a valid number'
      });
      return;
    }

    const success = await optionsDB.deleteOption(optionId);
    
    if (success) {
      res.json({ message: 'Option deleted successfully' });
    } else {
      res.status(404).json({ 
        error: 'Option not found',
        message: `No option found with ID ${optionId}`
      });
    }
  } catch (error) {
    console.error('Error deleting option:', error);
    res.status(500).json({ 
      error: 'Failed to delete option',
      message: error instanceof Error ? error.message : 'Database error'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Options Visualization API running on http://localhost:${PORT}`);
  console.log(`📊 OHLCV data available at http://localhost:${PORT}/api/ohlcv-data`);
  console.log(`⚙️  Options API available at http://localhost:${PORT}/api/options`);
  console.log(`🎯 Runtime: Node.js/TypeScript`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  optionsDB.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  optionsDB.close();
  process.exit(0);
});
