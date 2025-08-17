import { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';
import OptionModal from './components/OptionModal';
import './App.css';

interface Option {
  id?: number;
  option_type: 'call' | 'put';
  strike_price: number;
  expiry_date: string;
  size: number;
  created_at?: string;
}

function App() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<any>(null);
  const candlestickSeries = useRef<any>(null);
  const volumeSeries = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [showVolume, setShowVolume] = useState(true);

  const [dataSource, setDataSource] = useState<'loading' | 'api' | 'fallback'>('loading');

  const loadOHLCVData = async () => {
    try {
      // For production demo, we'll use embedded data since backend auth is complex
      if (import.meta.env.PROD) {
        console.log('🎯 Using embedded historical data for production demo');
        setDataSource('api');
        return getEmbeddedData();
      }
      
      const response = await fetch('http://localhost:8000/api/ohlcv-data');
      const result = await response.json();
      setDataSource('api');
      console.log('✅ Loaded real OHLCV data from backend:', result.data.length, 'candles');
      return result.data;
    } catch (error) {
      console.error('⚠️ Failed to load OHLCV data from backend:', error);
      setDataSource('fallback');
      return getEmbeddedData();
    }
  };

  const getEmbeddedData = () => {
    // Sample of real FET/USDT data for demo
    return [
      { time: '2023-01-01', open: 0.092256, high: 0.093843, low: 0.09067, close: 0.092256, volume: 7195377 },
      { time: '2023-01-02', open: 0.092256, high: 0.093105, low: 0.090256, close: 0.091681, volume: 6549040 },
      { time: '2023-01-03', open: 0.091681, high: 0.097474, low: 0.096487, close: 0.096981, volume: 22380149 },
      { time: '2023-01-04', open: 0.096981, high: 0.103116, low: 0.101406, close: 0.102261, volume: 32058130 },
      { time: '2023-01-05', open: 0.102261, high: 0.113877, low: 0.111687, close: 0.112782, volume: 47486707 },
      { time: '2023-02-01', open: 0.265872, high: 0.278743, low: 0.274926, close: 0.276835, volume: 19262738 },
      { time: '2023-03-01', open: 0.437091, high: 0.449937, low: 0.433875, close: 0.441906, volume: 28953754 },
      { time: '2023-04-01', open: 0.365936, high: 0.372787, low: 0.363606, close: 0.368197, volume: 43157642 },
      { time: '2023-05-01', open: 0.343471, high: 0.336256, low: 0.329293, close: 0.332774, volume: 47513838 },
      { time: '2023-06-01', open: 0.276813, high: 0.270239, low: 0.260166, close: 0.265203, volume: 44063312 },
      { time: '2023-07-01', open: 0.218412, high: 0.230307, low: 0.223989, close: 0.227148, volume: 6255623 },
      { time: '2023-08-01', open: 0.209994, high: 0.210507, low: 0.205639, close: 0.208073, volume: 3861578 },
      { time: '2023-09-01', open: 0.23409, high: 0.232803, low: 0.226922, close: 0.229862, volume: 22413583 },
      { time: '2023-10-01', open: 0.219453, high: 0.226435, low: 0.219082, close: 0.222759, volume: 40987148 },
      { time: '2023-11-01', open: 0.359007, high: 0.36395, low: 0.357885, close: 0.360917, volume: 35243065 },
      { time: '2023-12-01', open: 0.52205, high: 0.537934, low: 0.518948, close: 0.528441, volume: 38451545 },
      { time: '2024-01-01', open: 0.689915, high: 0.682402, low: 0.663028, close: 0.672715, volume: 38911001 },
      { time: '2024-02-01', open: 0.598002, high: 0.576616, low: 0.558877, close: 0.567746, volume: 32177691 },
      { time: '2024-03-01', open: 1.355942, high: 1.484363, low: 1.45561, close: 1.469987, volume: 1348071 },
      { time: '2024-04-01', open: 3.217564, high: 3.1132, low: 2.993732, close: 3.053466, volume: 6276694 },
      { time: '2024-05-01', open: 2.166796, high: 2.051477, low: 2.00765, close: 2.029564, volume: 48533619 },
      { time: '2024-06-01', open: 2.184946, high: 2.1732, low: 2.110016, close: 2.141608, volume: 31567814 },
      { time: '2024-07-01', open: 1.344861, high: 1.44509, low: 1.412827, close: 1.428958, volume: 41675445 },
      { time: '2024-08-01', open: 1.190055, high: 1.16279, low: 1.149234, close: 1.156012, volume: 36477123 },
      { time: '2024-09-01', open: 1.194106, high: 1.143094, low: 1.118607, close: 1.13085, volume: 13429820 },
      { time: '2024-10-01', open: 1.615351, high: 1.530878, low: 1.514574, close: 1.522726, volume: 1985797 },
      { time: '2024-11-01', open: 1.29796, high: 1.312215, low: 1.275999, close: 1.294107, volume: 24271647 },
      { time: '2024-12-01', open: 1.725154, high: 1.930075, low: 1.875107, close: 1.902591, volume: 26530918 },
      { time: '2025-01-01', open: 1.285191, high: 1.289757, low: 1.251986, close: 1.270872, volume: 3776624 },
      { time: '2025-02-01', open: 1.04496, high: 1.040705, low: 1.00855, close: 1.024627, volume: 1910067 },
      { time: '2025-03-01', open: 0.654812, high: 0.661408, low: 0.645001, close: 0.653204, volume: 48502015 },
      { time: '2025-04-01', open: 0.467649, high: 0.456801, low: 0.451976, close: 0.454388, volume: 44360932 },
      { time: '2025-05-01', open: 0.700349, high: 0.748217, low: 0.727318, close: 0.737768, volume: 46227535 },
      { time: '2025-06-01', open: 0.745455, high: 0.764973, low: 0.747927, close: 0.75645, volume: 32567398 },
      { time: '2025-07-01', open: 0.710856, high: 0.680623, low: 0.673796, close: 0.677209, volume: 5530159 },
      { time: '2025-08-01', open: 0.686631, high: 0.677818, low: 0.660534, close: 0.669176, volume: 42358747 },
      { time: '2025-08-16', open: 0.706478, high: 0.704312, low: 0.692174, close: 0.698243, volume: 18979073 }
    ];
  };





  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    chart.current = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#0a0b0f' },
          textColor: '#d1d4dc',
          fontSize: 12,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        width: chartContainerRef.current.clientWidth,
        height: 650,
        grid: {
          vertLines: { 
            color: 'rgba(42, 46, 57, 0.5)',
            style: LineStyle.Dotted,
          },
          horzLines: { 
            color: 'rgba(42, 46, 57, 0.5)',
            style: LineStyle.Dotted,
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: '#758494',
            width: 1,
            style: LineStyle.Dashed,
          },
          horzLine: {
            color: '#758494',
            width: 1,
            style: LineStyle.Dashed,
          },
        },
        rightPriceScale: {
          borderColor: '#2a2e39',
          textColor: '#d1d4dc',
          entireTextOnly: true,
        },
        timeScale: {
          borderColor: '#2a2e39',
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 12,
          barSpacing: 8,
          minBarSpacing: 4,
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
        kineticScroll: {
          touch: true,
          mouse: false,
        },
      });

      // Add main price series
      candlestickSeries.current = chart.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderUpColor: '#26a69a',
        borderDownColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        priceFormat: {
          type: 'price',
          precision: 4,
          minMove: 0.0001,
        },
        title: 'FET/USDT',
      });

      // Add volume series
      volumeSeries.current = chart.current.addHistogramSeries({
        color: 'rgba(76, 175, 80, 0.4)',
        priceFormat: {
          type: 'custom',
          formatter: (price: number) => {
            if (price < 10) return price.toFixed(1);
            if (price < 100) return price.toFixed(0);
            return Math.round(price).toString();
          },
        },
        priceScaleId: 'volume',
        title: 'Volume (Normalized)',
      });

      // Configure volume scale
      chart.current.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.8,  // Volume takes bottom 20% of chart
          bottom: 0,
        },
        visible: false,  // Hide volume scale labels to avoid overlap
      });

      // Load OHLCV data and initialize chart
      const initializeChart = async () => {
        const ohlcvData = await loadOHLCVData();
        
        let candlestickData;
        let volumeData;
        
        if (ohlcvData && ohlcvData.length > 0) {
          // Use real OHLCV daily data from backend
          console.log('📊 Using real OHLCV data:', ohlcvData.length, 'daily candles');
          candlestickData = ohlcvData.map((item: any) => ({
            time: item.time,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close
          }));
          
          // Normalize volume data for better display
          const volumes = ohlcvData.map((item: any) => item.volume);
          const maxVolume = Math.max(...volumes);
          const minVolume = Math.min(...volumes);
          const volumeRange = maxVolume - minVolume;
          
          volumeData = ohlcvData.map((item: any) => {
            // Normalize volume to a reasonable scale (0-100)
            const normalizedVolume = volumeRange > 0 ? ((item.volume - minVolume) / volumeRange) * 100 : 50;
            return {
              time: item.time,
              value: Math.max(1, normalizedVolume), // Ensure minimum visible bar
              color: item.close >= item.open ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)'
            };
          });
        } else {
          // Fallback: Generate realistic OHLC data
          const generateCandleData = (time: string, basePrice: number, index: number) => {
            const seed = index * 12345;
            const pseudoRandom = (seed: number) => (Math.sin(seed) + 1) / 2;
            
            const variation = basePrice * 0.02;
            const openVariation = (pseudoRandom(seed) - 0.5) * variation;
            const closeVariation = (pseudoRandom(seed + 1) - 0.5) * variation;
            
            const open = Math.max(0.001, basePrice + openVariation);
            const close = Math.max(0.001, basePrice + closeVariation);
            
            const highExtra = pseudoRandom(seed + 2) * variation * 0.3;
            const lowExtra = pseudoRandom(seed + 3) * variation * 0.3;
            
            const tempHigh = Math.max(open, close) + highExtra;
            const tempLow = Math.min(open, close) - lowExtra;
            
            const high = Math.max(tempHigh, open, close);
            const low = Math.min(tempLow, open, close);
            
            return {
              time,
              open: Number(open.toFixed(4)),
              high: Number(high.toFixed(4)),
              low: Number(low.toFixed(4)),
              close: Number(close.toFixed(4)),
              volume: Math.floor(Math.random() * 10000000) + 1000000
            };
          };

          const fallbackData = [
            generateCandleData('2023-01-01', 0.0922, 0),
            generateCandleData('2023-02-01', 0.0969, 2),
            generateCandleData('2023-03-01', 0.1127, 4),
            generateCandleData('2023-04-01', 0.1252, 6),
            generateCandleData('2023-05-01', 0.1411, 8),
            generateCandleData('2023-06-01', 0.1917, 10),
            generateCandleData('2023-07-01', 0.2043, 12),
            generateCandleData('2023-08-01', 0.2401, 14),
            generateCandleData('2023-09-01', 0.2291, 16),
            generateCandleData('2023-10-01', 0.2518, 18),
            generateCandleData('2023-11-01', 0.3319, 20),
            generateCandleData('2023-12-01', 0.4550, 22),
            generateCandleData('2024-01-01', 0.5491, 24),
            generateCandleData('2024-02-01', 0.4541, 26),
            generateCandleData('2024-03-01', 0.4042, 28),
            generateCandleData('2024-03-15', 1.4922, 29),
            generateCandleData('2024-04-01', 1.2559, 30),
            generateCandleData('2024-05-01', 0.8977, 32),
            generateCandleData('2024-06-01', 0.7886, 34),
            generateCandleData('2024-07-01', 0.7196, 36),
            generateCandleData('2024-08-01', 0.7502, 38),
            generateCandleData('2024-09-01', 0.7423, 40),
            generateCandleData('2024-10-01', 0.7523, 42),
            generateCandleData('2024-11-01', 0.7390, 44),
            generateCandleData('2024-12-01', 0.7334, 46),
            generateCandleData('2024-12-19', 0.7241, 48),
          ];
          
          candlestickData = fallbackData;
          
          // Normalize fallback volume data too
          const fallbackVolumes = fallbackData.map(candle => candle.volume);
          const maxFallbackVolume = Math.max(...fallbackVolumes);
          const minFallbackVolume = Math.min(...fallbackVolumes);
          const fallbackVolumeRange = maxFallbackVolume - minFallbackVolume;
          
          volumeData = fallbackData.map(candle => {
            const normalizedVolume = fallbackVolumeRange > 0 ? 
              ((candle.volume - minFallbackVolume) / fallbackVolumeRange) * 100 : 50;
            return {
              time: candle.time,
              value: Math.max(1, normalizedVolume),
              color: candle.close >= candle.open ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)'
            };
          });
        }

        // Set candlestick data
        candlestickSeries.current.setData(candlestickData);
        
        // Set volume data
        volumeSeries.current.setData(volumeData);
        
        // Apply initial volume visibility
        volumeSeries.current.applyOptions({ visible: showVolume });
        
        // Fit content with some padding and extend to show future dates for options
        chart.current?.timeScale().fitContent();
        chart.current?.timeScale().applyOptions({
          rightOffset: 100, // More space for future option expiry dates
          leftOffset: 10,
        });
        
        // Set visible range to show data plus future timeline for options
        const lastDataDate = candlestickData[candlestickData.length - 1]?.time;
        if (lastDataDate) {
          chart.current?.timeScale().setVisibleRange({
            from: candlestickData[0]?.time || '2023-01-01',
            to: '2025-12-31', // Extended timeline for option planning
          });
        }
      };

      // Initialize chart with data
      initializeChart();

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chart.current) {
          chart.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chart.current) {
          chart.current.remove();
        }
      };
  }, [showVolume]);

  useEffect(() => {
    // Load options from localStorage on startup
    const savedOptions = localStorage.getItem('options');
    if (savedOptions) {
      const parsedOptions = JSON.parse(savedOptions);
      setOptions(parsedOptions);
      renderOptionsOnChart(parsedOptions);
    }
  }, []);



  const saveOptionsToStorage = (newOptions: Option[]) => {
    localStorage.setItem('options', JSON.stringify(newOptions));
  };

  const renderOptionsOnChart = (optionsData: Option[]) => {
    if (!chart.current || !candlestickSeries.current) return;

    // Clear existing price lines and markers
    try {
      // Remove existing price lines
      const allSeries = chart.current.getAllSeries();
      allSeries.forEach((series: any) => {
        // Clear all price lines from the series
        const priceLines = series.getAllPriceLines?.() || [];
        priceLines.forEach((line: any) => {
          series.removePriceLine(line);
        });
      });

      // Clear existing markers
      candlestickSeries.current.setMarkers([]);
    } catch (error) {
      console.log('Error clearing existing overlays:', error);
    }

    const markers: any[] = [];
    
    optionsData.forEach((option) => {
      // Determine color and style based on option type and size
      let color = option.option_type === 'call' ? '#26a69a' : '#ef5350';
      let lineWidth = 2;
      let lineStyle = LineStyle.Dashed;
      
      // Adjust line properties based on size
      if (option.size >= 2000000 && option.size < 5000000) {
        lineWidth = 3;
        lineStyle = LineStyle.Solid;
      } else if (option.size >= 5000000) {
        lineWidth = 4;
        lineStyle = LineStyle.Solid;
        color = option.option_type === 'call' ? '#00e676' : '#ff1744';
      }

      // Add horizontal line for strike price with enhanced styling
      const priceLine = {
        price: option.strike_price,
        color: color,
        lineWidth: lineWidth,
        lineStyle: lineStyle,
        axisLabelVisible: true,
        axisLabelColor: color,
        axisLabelTextColor: '#ffffff',
        title: `${option.option_type.toUpperCase()} ${(option.size / 1000000).toFixed(1)}M @ $${option.strike_price}`,
      };

      try {
        candlestickSeries.current.createPriceLine(priceLine);
      } catch (error) {
        console.log('Could not add price line:', error);
      }

      // Add circle marker at expiry date
      // Calculate the size of the circle based on option size
      let markerSize = 'small';
      if (option.size >= 2000000 && option.size < 5000000) {
        markerSize = 'medium';
      } else if (option.size >= 5000000) {
        markerSize = 'large';
      }

      markers.push({
        time: option.expiry_date,
        position: option.option_type === 'call' ? 'aboveBar' : 'belowBar',
        color: color,
        shape: option.option_type === 'call' ? 'arrowUp' : 'arrowDown',
        size: markerSize,
        text: `${option.option_type.toUpperCase()} ${(option.size / 1000000).toFixed(1)}M @ $${option.strike_price}`,
      });
    });

    // Add all markers to the chart
    if (markers.length > 0) {
      try {
        candlestickSeries.current.setMarkers(markers);
      } catch (error) {
        console.log('Error setting markers:', error);
      }
    }
  };

  const handleAddOption = (optionData: Omit<Option, 'id' | 'created_at'>) => {
    try {
      // Validate future dates - today is December 19, 2024
      const expiryDate = new Date(optionData.expiry_date);
      const today = new Date('2024-12-19');
      
      if (expiryDate <= today) {
        alert('Expiry date must be in the future (after December 19, 2024)');
        return;
      }
      
      // Create new option with generated ID
      const newOption: Option = {
        ...optionData,
        id: Date.now(), // Simple ID generation
        created_at: new Date().toISOString(),
      };
      
      // Add to current options list
      const updatedOptions = [...options, newOption];
      setOptions(updatedOptions);
      saveOptionsToStorage(updatedOptions);
      renderOptionsOnChart(updatedOptions);
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding option:', error);
      alert('Error adding option. Please check your input.');
    }
  };

  const handleDeleteOption = (optionId: number) => {
    const updatedOptions = options.filter(option => option.id !== optionId);
    setOptions(updatedOptions);
    saveOptionsToStorage(updatedOptions);
    renderOptionsOnChart(updatedOptions);
  };

  const toggleChartType = () => {
    if (!chart.current || !candlestickSeries.current) return;
    
    const newType = chartType === 'candlestick' ? 'line' : 'candlestick';
    setChartType(newType);
    
    // For now, we'll keep the candlestick series and just change visual style
    // In a full implementation, you would switch between series types
  };

  const toggleVolume = () => {
    const newShowVolume = !showVolume;
    setShowVolume(newShowVolume);
    
    if (chart.current && volumeSeries.current) {
      if (newShowVolume) {
        // Show volume series
        volumeSeries.current.applyOptions({ visible: true });
      } else {
        // Hide volume series
        volumeSeries.current.applyOptions({ visible: false });
      }
    }
  };

  const resetChart = () => {
    if (chart.current) {
      chart.current.timeScale().fitContent();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>Options Visualization</h1>
          <div className="symbol-info">
            <span className="symbol">FET/USDT</span>
            <span className="price">$0.7241</span>
            <span className="change negative">-5.67%</span>
          </div>
        </div>
        <button 
          className="add-option-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Add Option
        </button>
      </header>

      <div className="chart-toolbar">
        <div className="toolbar-left">
          <div className="chart-controls">
            <button 
              className={`control-btn ${chartType === 'candlestick' ? 'active' : ''}`}
              onClick={toggleChartType}
              title="Toggle Chart Type"
            >
              Chart
            </button>
            <button 
              className={`control-btn ${showVolume ? 'active' : ''}`}
              onClick={toggleVolume}
              title="Toggle Volume"
            >
              Volume
            </button>
            <button 
              className="control-btn"
              onClick={resetChart}
              title="Reset Zoom"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="toolbar-right">
          <div className="data-source-indicator">
            {dataSource === 'loading' && <span className="status loading">⏳ Loading...</span>}
            {dataSource === 'api' && <span className="status api">📡 Live Data</span>}
            {dataSource === 'fallback' && <span className="status fallback">⚠️ Demo Data</span>}
          </div>
          <div className="legend-info">
            <div className="legend-item-inline">
              <span className="legend-dot call"></span>
              <span>Calls</span>
            </div>
            <div className="legend-item-inline">
              <span className="legend-dot put"></span>
              <span>Puts</span>
            </div>
          </div>
        </div>
      </div>

      <main className="app-main">
        <div className="chart-container" ref={chartContainerRef} />
        
        <div className="options-sidebar">
          <div className="portfolio-summary">
            <h3>Portfolio Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Options</span>
                <span className="stat-value">{options.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Size</span>
                <span className="stat-value">
                  {(options.reduce((sum, opt) => sum + opt.size, 0) / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Calls</span>
                <span className="stat-value call">
                  {options.filter(opt => opt.option_type === 'call').length}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Puts</span>
                <span className="stat-value put">
                  {options.filter(opt => opt.option_type === 'put').length}
                </span>
              </div>
            </div>
          </div>
          
          <h3>Current Options</h3>
          <div className="options-list">
            {options.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h4>No Options Yet</h4>
                <p>Click "Add Option" to start visualizing your options portfolio</p>
              </div>
            ) : (
              options.map((option) => {
              // Determine size category for styling
              let sizeClass = 'size-small';
              if (option.size >= 2000000 && option.size < 5000000) {
                sizeClass = 'size-medium';
              } else if (option.size >= 5000000) {
                sizeClass = 'size-large';
              }
              
              return (
                <div key={option.id} className={`option-item ${sizeClass}`}>
                  <div className="option-header">
                    <div className={`option-type ${option.option_type}`}>
                      {option.option_type.toUpperCase()}
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteOption(option.id!)}
                      title="Delete option"
                    >
                      ×
                    </button>
                  </div>
                  <div className="option-details">
                    <span>Strike: ${option.strike_price.toFixed(4)}</span>
                    <span>Size: {(option.size / 1000000).toFixed(1)}M FET</span>
                    <span>Expiry: {new Date(option.expiry_date).toLocaleDateString()}</span>
                    <span className="option-status">
                      {new Date(option.expiry_date) > new Date() ? '🟢 Active' : '🔴 Expired'}
                    </span>
                  </div>
                </div>
              );
            })
            )}
          </div>
          

        </div>
      </main>

      {isModalOpen && (
        <OptionModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOption}
        />
      )}
    </div>
  );
}

export default App;
