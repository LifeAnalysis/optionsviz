import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';
import OptionModal from './components/OptionModal';
import { formatOHLCVDataForChart } from '../shared/data/ohlcv-data';
import './App.css';

interface Option {
  id: number; // Made required to prevent undefined issues
  option_type: 'call' | 'put';
  strike_price: number;
  expiry_date: string;
  size: number;
  created_at: string; // Made required for consistency
}

function App() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<any>(null);
  const candlestickSeries = useRef<any>(null);
  // const volumeSeries = useRef<any>(null);
  const strikeLinesRef = useRef<any[]>([]);
  // const payoffSeriesRef = useRef<any>(null);
  const timeExtensionSeriesRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  // const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  // const [showVolume, setShowVolume] = useState(true);
  // Options always shown - no need for display mode toggle

  const [dataSource, setDataSource] = useState<'loading' | 'api' | 'fallback'>('loading');
  
  // Memoize expensive calculations
  const optionStats = React.useMemo(() => {
    const totalSize = options.reduce((sum, opt) => sum + opt.size, 0);
    const callCount = options.filter(opt => opt.option_type === 'call').length;
    const putCount = options.filter(opt => opt.option_type === 'put').length;
    
    return {
      totalOptions: options.length,
      totalSize: (totalSize / 1000000).toFixed(1),
      callCount,
      putCount
    };
  }, [options]);

  const loadOHLCVData = async () => {
    try {
      console.log('📊 Loading real OHLCV data from local file...');
      const realData = formatOHLCVDataForChart();
      setDataSource('api');
      console.log('✅ Loaded real OHLCV data:', realData.length, 'candles');
      console.log('📅 Data range: from', realData[0]?.time, 'to', realData[realData.length - 1]?.time);
      return realData;
    } catch (error) {
      console.error('⚠️ Failed to load real OHLCV data:', error);
      setDataSource('fallback');
      console.log('🔄 Falling back to demo data');
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

      // Volume series disabled
      // volumeSeries.current = chart.current.addHistogramSeries({
      //   color: 'rgba(76, 175, 80, 0.6)',
      //   priceFormat: {
      //     type: 'custom',
      //     formatter: (price: number) => {
      //       if (price >= 1000000) return (price / 1000000).toFixed(1) + 'M';
      //       if (price >= 1000) return (price / 1000).toFixed(0) + 'K';
      //       return price.toFixed(0);
      //     },
      //   },
      //   priceScaleId: 'volume',
      //   lastValueVisible: false,
      //   priceLineVisible: false,
      // });

      // // Configure volume scale
      // chart.current.priceScale('volume').applyOptions({
      //   scaleMargins: {
      //     top: 0.82,
      //     bottom: 0,
      //   },
      //   visible: true,
      //   borderColor: '#2a2e39',
      //   textColor: '#858ca2',
      //   entireTextOnly: false,
      //   ticksVisible: true,
      //   alignLabels: true,
      // });

      // No need for separate options series - markers will be placed on candlestick series
      console.log('✅ Chart series setup complete');

      // Load OHLCV data and initialize chart
      const initializeChart = async () => {
        const ohlcvData = await loadOHLCVData();
        
        let candlestickData;
        // let volumeData;
        
        // Helper: percentile (e.g., 0.95 for 95th)
        const percentile = (arr: number[], p: number) => {
          if (arr.length === 0) return 0;
          const sorted = [...arr].sort((a, b) => a - b);
          const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))));
          return sorted[idx];
        };
        
        if (ohlcvData && ohlcvData.length > 0) {
          console.log('📊 Using real OHLCV data:', ohlcvData.length, 'daily candles');
          candlestickData = ohlcvData.map((item: any) => ({
            time: item.time,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close
          }));
          
          // Volume processing disabled
          // const volumes = ohlcvData.map((item: any) => item.volume);
          // const maxVolume = Math.max(...volumes);
          // const minVolume = Math.min(...volumes);
          // const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
          // const capVolume = percentile(volumes, 0.95);
          // 
          // console.log('📊 Volume Statistics:', {
          //   max: `${(maxVolume / 1000000).toFixed(1)}M`,
          //   min: `${(minVolume / 1000000).toFixed(1)}M`,
          //   avg: `${(avgVolume / 1000000).toFixed(1)}M`,
          //   cap95: `${(capVolume / 1000000).toFixed(1)}M`,
          //   samples: volumes.length
          // });
          // 
          // volumeData = ohlcvData.map((item: any) => {
          //   const isUpDay = item.close >= item.open;
          //   const volumeRatio = item.volume / avgVolume;
          //   
          //   let color;
          //   if (volumeRatio > 1.5) color = isUpDay ? 'rgba(38, 166, 154, 0.8)' : 'rgba(239, 83, 80, 0.8)';
          //   else if (volumeRatio > 0.7) color = isUpDay ? 'rgba(38, 166, 154, 0.6)' : 'rgba(239, 83, 80, 0.6)';
          //   else color = isUpDay ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
          //   
          //   const renderValue = Math.min(item.volume, capVolume);
          //   return { time: item.time, value: renderValue, color };
          // });
        } else {
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
            return { time, open: Number(open.toFixed(4)), high: Number(high.toFixed(4)), low: Number(low.toFixed(4)), close: Number(close.toFixed(4)), volume: Math.floor(Math.random() * 10000000) + 1000000 };
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
          
          // Fallback volume processing disabled
          // const fallbackVolumes = fallbackData.map(candle => candle.volume);
          // const avgFallbackVolume = fallbackVolumes.reduce((sum, vol) => sum + vol, 0) / fallbackVolumes.length;
          // const capFallback = percentile(fallbackVolumes, 0.95);
          // 
          // volumeData = fallbackData.map(candle => {
          //   const isUpDay = candle.close >= candle.open;
          //   const volumeRatio = candle.volume / avgFallbackVolume;
          //   let color;
          //   if (volumeRatio > 1.5) color = isUpDay ? 'rgba(38, 166, 154, 0.8)' : 'rgba(239, 83, 80, 0.8)';
          //   else if (volumeRatio > 0.7) color = isUpDay ? 'rgba(38, 166, 154, 0.6)' : 'rgba(239, 83, 80, 0.6)';
          //   else color = isUpDay ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
          //   const renderValue = Math.min(candle.volume, capFallback);
          //   return { time: candle.time, value: renderValue, color };
          // });
        }

        // Set candlestick data only (volume disabled)
        candlestickSeries.current.setData(candlestickData);
        // volumeSeries.current.setData(volumeData);
        // volumeSeries.current.applyOptions({ visible: showVolume });
        
        // Add phantom future data points to extend the time scale to 2027
        // Create invisible time extension series to force chart to show future dates
        console.log('⏰ Creating time extension series for future option expiries...');
        timeExtensionSeriesRef.current = chart.current.addLineSeries({
          color: 'transparent',
          lineWidth: 0,
          crosshairMarkerVisible: false,
          lastValueVisible: false,
          priceLineVisible: false,
          visible: false, // Completely invisible
          priceScaleId: 'timeExtension'
        });

        // Hide the time extension price scale
        chart.current.priceScale('timeExtension').applyOptions({
          visible: false,
        });

        // This ensures options with future expiry dates display correctly
        const lastDataPoint = candlestickData[candlestickData.length - 1];
        if (lastDataPoint && timeExtensionSeriesRef.current) {
          const lastDate = new Date(lastDataPoint.time);
          const phantomPoints = [];
          
          console.log('📅 Last data point:', lastDataPoint.time);
          
          // Add daily phantom points from last data point to end of 2027
          let currentDate = new Date(lastDate);
          currentDate.setDate(currentDate.getDate() + 1); // Start from next day
          
          const endDate = new Date('2027-12-31');
          
          while (currentDate <= endDate) {
            phantomPoints.push({
              time: currentDate.toISOString().split('T')[0],
              value: lastDataPoint.close, // Use last known price to maintain scale
            });
            // Add points every week for performance
            currentDate.setDate(currentDate.getDate() + 7);
          }
          
          console.log('👻 Creating', phantomPoints.length, 'phantom points to extend time scale to', endDate.toISOString().split('T')[0]);
          
          // Set phantom data on invisible series to extend time scale
          if (phantomPoints.length > 0) {
            timeExtensionSeriesRef.current.setData(phantomPoints);
          }
        }
        
        // Configure time scale
        chart.current?.timeScale().applyOptions({ 
          rightOffset: 50,
          leftOffset: 10,
          timeVisible: true,
          secondsVisible: false,
        });
        
        // Set visible range to show data plus future
        const first = candlestickData[0]?.time || '2023-01-01';
        const last = candlestickData[candlestickData.length - 1]?.time || '2025-08-17';
        
        console.log('📅 Setting visible range from', first, 'to 2027-12-31');
        console.log('📅 Actual data range:', first, 'to', last);
        
        chart.current?.timeScale().setVisibleRange({
          from: first,
          to: '2027-12-31',
        });
        
        console.log('✅ Chart initialization complete');
      };

      initializeChart();

      const handleResize = () => {
        if (chartContainerRef.current && chart.current) {
          chart.current.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        console.log('🧹 Cleaning up chart and event listeners...');
        window.removeEventListener('resize', handleResize);
        
        // Ensure proper cleanup of chart instance
        if (chart.current) {
          try {
            chart.current.remove();
            chart.current = null;
          } catch (error) {
            console.warn('⚠️ Error cleaning up chart:', error);
          }
        }
        
        // Clean up option visualization series
        strikeLinesRef.current.forEach(line => {
          try {
            if (chart.current) chart.current.removeSeries(line);
          } catch (e) {
            console.warn('Could not remove strike line during cleanup:', e);
          }
        });
        strikeLinesRef.current = [];
        
        // Payoff series cleanup removed
        
        if (timeExtensionSeriesRef.current) {
          try {
            if (chart.current) chart.current.removeSeries(timeExtensionSeriesRef.current);
            timeExtensionSeriesRef.current = null;
          } catch (e) {
            console.warn('Could not remove time extension series during cleanup:', e);
          }
        }
        
        // Clean up series references
        candlestickSeries.current = null;
        // volumeSeries.current = null;
      };
  }, []);

  useEffect(() => {
    // Load options from localStorage on startup
    console.log('💾 Loading options from localStorage on startup...');
    const savedOptions = localStorage.getItem('options');
    if (savedOptions) {
      const parsedOptions = JSON.parse(savedOptions);
      console.log('💾 Found', parsedOptions.length, 'saved options:', parsedOptions);
      setOptions(parsedOptions);
      
      console.log('🎯 Rendering saved options on chart...');
      renderOptionsOnChart(parsedOptions);
    } else {
      console.log('💾 No saved options found in localStorage');
    }
  }, []);

  // Re-render options when options array changes
  useEffect(() => {
    if (options.length > 0) {
      console.log('🔄 Re-rendering options due to options change');
      renderOptionsOnChart(options);
    }
  }, [options]);



  const saveOptionsToStorage = (newOptions: Option[]) => {
    localStorage.setItem('options', JSON.stringify(newOptions));
  };

  const renderOptionsOnChart = (optionsData: Option[]) => {
    console.log('🎯 renderOptionsOnChart called with', optionsData.length, 'options');
    
    if (!chart.current || !candlestickSeries.current) {
      console.error('❌ Chart or candlestick series not available');
      return;
    }

    // Clear existing option visualizations first
    console.log('🧹 Clearing existing option visualizations...');
    strikeLinesRef.current.forEach(line => {
      try {
        chart.current.removeSeries(line);
      } catch (e) {
        console.warn('Could not remove existing visualization:', e);
      }
    });
    strikeLinesRef.current = [];

    if (optionsData.length === 0) {
      // Clear markers when no options
      candlestickSeries.current.setMarkers([]);
      return;
    }

    // Extend time scale to show future expiry dates
    const furthestExpiry = optionsData.reduce((latest, option) => {
      return option.expiry_date > latest ? option.expiry_date : latest;
    }, optionsData[0].expiry_date);
    
    console.log('📅 Furthest option expiry:', furthestExpiry);
    
    // TECHNIQUE 1: Strike Price Circles on Expiry Dates (always show options)
    if (optionsData.length > 0) {
      console.log('🟠 Creating orange strike price circles on expiry dates...');
      
      optionsData.forEach((option, index) => {
        try {
          // Create a line series with just one point to show a circle at the strike price on expiry date
          const strikeSeries = chart.current.addLineSeries({
            color: '#ff9500', // Orange color for all strike points
            lineWidth: 0, // No line, just the point
            crosshairMarkerVisible: true,
            lastValueVisible: false,
            priceLineVisible: false,
            pointMarkersVisible: true,
            title: `${option.option_type.toUpperCase()} Strike $${option.strike_price.toFixed(4)} (${option.expiry_date})`
          });
          
          // Create a single data point at the expiry date and strike price
          const strikeData = [{
            time: option.expiry_date,
            value: option.strike_price
          }];
          
          strikeSeries.setData(strikeData);
          strikeLinesRef.current.push(strikeSeries);
          
          console.log(`🟠 Added orange circle for ${option.option_type} at $${option.strike_price} expiring ${option.expiry_date}`);
          
        } catch (error) {
          console.warn('⚠️ Could not add strike price circle:', option, error);
        }
      });
    }

    // Clear any existing markers since we're using orange circles now
    candlestickSeries.current.setMarkers([]);
    
    // TECHNIQUE 2: Extend visible range intelligently to show future expiries
    try {
      const timeScale = chart.current.timeScale();
      
      // Calculate optimal range that shows both data and options
      const dataStart = '2023-01-01'; // Fixed start
      const optionEnd = new Date(furthestExpiry);
      optionEnd.setMonth(optionEnd.getMonth() + 3); // Add 3 months buffer past furthest expiry
      
      const targetEndDate = optionEnd.toISOString().split('T')[0];
      
      console.log('📅 Setting visible range to show option expiry:', furthestExpiry);
      console.log('📅 Extending view to:', targetEndDate);
      
      // Force the time scale to show the extended range
      timeScale.setVisibleRange({
        from: dataStart,
        to: targetEndDate
      });
      
      // Also adjust the right offset to ensure future dates are visible
      timeScale.applyOptions({
        rightOffset: 100, // Increase right offset to make room for future dates
        fixLeftEdge: false,
        fixRightEdge: false
      });
      
      console.log('✅ Extended time range to show all option expiries until', targetEndDate);
    } catch (error) {
      console.warn('⚠️ Could not extend time scale:', error);
    }
    
    // Payoff visualization removed for simplicity
    
    console.log('✅ Option visualization complete:', {
      'Orange Strike Circles': strikeLinesRef.current.length
    });
  };

  const handleAddOption = (optionData: Omit<Option, 'id' | 'created_at'>) => {
    console.log('➕ handleAddOption called with:', optionData);
    
    try {
      // Validate future dates - must be after today
      const expiryDate = new Date(optionData.expiry_date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
      
      console.log('📅 Validating expiry date:', optionData.expiry_date, 'vs current:', currentDate.toISOString().split('T')[0]);
      
      if (expiryDate <= currentDate) {
        console.warn('⚠️ Invalid expiry date - must be in the future');
        alert('Expiry date must be in the future');
        return;
      }
      
      // Create new option with generated ID using crypto.randomUUID for better uniqueness
      const optionId = Date.now() + Math.floor(Math.random() * 1000); // More robust ID generation
      const newOption: Option = {
        ...optionData,
        id: optionId, // Ensure ID is always set
        created_at: new Date().toISOString(),
      };
      
      console.log('🆕 Created new option with ID:', optionId, newOption);
      
      // Add to current options list
      const updatedOptions = [...options, newOption];
      console.log('📋 Updated options array length:', updatedOptions.length);
      
      setOptions(updatedOptions);
      saveOptionsToStorage(updatedOptions);
      
      console.log('🎯 Calling renderOptionsOnChart with updated options...');
      renderOptionsOnChart(updatedOptions);
      
      setIsModalOpen(false);
      console.log('✅ Option added successfully');
    } catch (error) {
      console.error('❌ Error adding option:', error);
      alert('Error adding option. Please check your input.');
    }
  };

  const handleDeleteOption = (optionId: number) => {
    console.log('🗑️ handleDeleteOption called with ID:', optionId);
    
    console.log('📋 Current options before delete:', options.length);
    const updatedOptions = options.filter(option => option.id !== optionId);
    
    if (updatedOptions.length === options.length) {
      console.warn('⚠️ Option not found for deletion, ID:', optionId);
      return;
    }
    
    console.log('📋 Options after delete:', updatedOptions.length);
    
    setOptions(updatedOptions);
    saveOptionsToStorage(updatedOptions);
    
    console.log('🎯 Calling renderOptionsOnChart after deletion...');
    renderOptionsOnChart(updatedOptions);
    
    console.log('✅ Option deleted successfully');
  };

  const handleClearAllOptions = () => {
    console.log('🧹 handleClearAllOptions called');
    
    if (options.length === 0) {
      console.log('ℹ️ No options to clear');
      return;
    }
    
    const confirmed = window.confirm(`Are you sure you want to remove all ${options.length} options? This action cannot be undone.`);
    
    if (!confirmed) {
      console.log('❌ Clear all options cancelled by user');
      return;
    }
    
    console.log('🧹 Clearing', options.length, 'options from memory and chart');
    
    setOptions([]);
    saveOptionsToStorage([]);
    renderOptionsOnChart([]);
    
    console.log('✅ All options cleared successfully');
  };

  // Chart type toggle removed for simplicity

  // Volume toggle disabled
  // const toggleVolume = () => {
  //   const newShowVolume = !showVolume;
  //   setShowVolume(newShowVolume);
  //   if (chart.current && volumeSeries.current) {
  //     volumeSeries.current.applyOptions({ visible: newShowVolume });
  //   }
  // };

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
              className="control-btn"
              onClick={resetChart}
              title="Reset Chart View"
            >
              🔄 Reset View
            </button>
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
                <span className="stat-value">{optionStats.totalOptions}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Size</span>
                <span className="stat-value">
                  {optionStats.totalSize}M
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Calls</span>
                <span className="stat-value call">
                  {optionStats.callCount}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Puts</span>
                <span className="stat-value put">
                  {optionStats.putCount}
                </span>
              </div>
            </div>
          </div>
          
          <div className="options-actions">
            {options.length > 0 && (
              <button 
                className="clear-all-btn"
                onClick={handleClearAllOptions}
                title={`Clear all ${options.length} options`}
              >
                🧹 Clear All Options
              </button>
            )}
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
                      onClick={() => handleDeleteOption(option.id)}
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
