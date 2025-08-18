import { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';
import OptionModal from './components/OptionModal';
import { formatOHLCVDataForChart } from '../server/data/ohlcv-data';
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
  const optionsSeries = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [showVolume, setShowVolume] = useState(true);

  const [dataSource, setDataSource] = useState<'loading' | 'api' | 'fallback'>('loading');

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

      // Add volume series (hide last-value tag and price line)
      volumeSeries.current = chart.current.addHistogramSeries({
        color: 'rgba(76, 175, 80, 0.6)',
        priceFormat: {
          type: 'custom',
          formatter: (price: number) => {
            if (price >= 1000000) return (price / 1000000).toFixed(1) + 'M';
            if (price >= 1000) return (price / 1000).toFixed(0) + 'K';
            return price.toFixed(0);
          },
        },
        priceScaleId: 'volume',
        lastValueVisible: false,
        priceLineVisible: false,
      });

      // Configure volume scale
      chart.current.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.82,
          bottom: 0,
        },
        visible: true,
        borderColor: '#2a2e39',
        textColor: '#858ca2',
        entireTextOnly: false,
        ticksVisible: true,
        alignLabels: true,
      });

      // Create a hidden line series just for extending the time scale
      console.log('🎨 Creating options series with custom price scale...');
      optionsSeries.current = chart.current.addLineSeries({
        color: 'transparent',
        lineWidth: 0,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
        visible: true, // keep series visible so markers render
        priceScaleId: 'options'
      });

      // Hide options price scale entirely
      console.log('⚙️ Configuring options price scale to be hidden...');
      chart.current.priceScale('options').applyOptions({
        visible: false,
        scaleMargins: { top: 0.82, bottom: 0 }
      });
      
      console.log('✅ Options series created successfully');

      // Load OHLCV data and initialize chart
      const initializeChart = async () => {
        const ohlcvData = await loadOHLCVData();
        
        let candlestickData;
        let volumeData;
        
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
          
          // Process volume data with scaling and colors
          const volumes = ohlcvData.map((item: any) => item.volume);
          const maxVolume = Math.max(...volumes);
          const minVolume = Math.min(...volumes);
          const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
          const capVolume = percentile(volumes, 0.95);
          
          console.log('📊 Volume Statistics:', {
            max: `${(maxVolume / 1000000).toFixed(1)}M`,
            min: `${(minVolume / 1000000).toFixed(1)}M`,
            avg: `${(avgVolume / 1000000).toFixed(1)}M`,
            cap95: `${(capVolume / 1000000).toFixed(1)}M`,
            samples: volumes.length
          });
          
          volumeData = ohlcvData.map((item: any) => {
            const isUpDay = item.close >= item.open;
            const volumeRatio = item.volume / avgVolume;
            
            let color;
            if (volumeRatio > 1.5) color = isUpDay ? 'rgba(38, 166, 154, 0.8)' : 'rgba(239, 83, 80, 0.8)';
            else if (volumeRatio > 0.7) color = isUpDay ? 'rgba(38, 166, 154, 0.6)' : 'rgba(239, 83, 80, 0.6)';
            else color = isUpDay ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
            
            const renderValue = Math.min(item.volume, capVolume);
            return { time: item.time, value: renderValue, color };
          });
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
          
          const fallbackVolumes = fallbackData.map(candle => candle.volume);
          const avgFallbackVolume = fallbackVolumes.reduce((sum, vol) => sum + vol, 0) / fallbackVolumes.length;
          const capFallback = percentile(fallbackVolumes, 0.95);
          
          volumeData = fallbackData.map(candle => {
            const isUpDay = candle.close >= candle.open;
            const volumeRatio = candle.volume / avgFallbackVolume;
            let color;
            if (volumeRatio > 1.5) color = isUpDay ? 'rgba(38, 166, 154, 0.8)' : 'rgba(239, 83, 80, 0.8)';
            else if (volumeRatio > 0.7) color = isUpDay ? 'rgba(38, 166, 154, 0.6)' : 'rgba(239, 83, 80, 0.6)';
            else color = isUpDay ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
            const renderValue = Math.min(candle.volume, capFallback);
            return { time: candle.time, value: renderValue, color };
          });
        }

        // Set candlestick and volume data
        candlestickSeries.current.setData(candlestickData);
        volumeSeries.current.setData(volumeData);
        volumeSeries.current.applyOptions({ visible: showVolume });
        
        // Add phantom future data points to extend the time scale to 2027
        // This ensures options with future expiry dates display correctly
        const lastDataPoint = candlestickData[candlestickData.length - 1];
        if (lastDataPoint && optionsSeries.current) {
          const lastDate = new Date(lastDataPoint.time);
          const phantomPoints = [];
          
          // Add monthly phantom points from last data to end of 2027
          let currentDate = new Date(lastDate);
          currentDate.setDate(1); // Start of next month
          currentDate.setMonth(currentDate.getMonth() + 1);
          
          const endDate = new Date('2027-12-31');
          
          while (currentDate <= endDate) {
            phantomPoints.push({
              time: currentDate.toISOString().split('T')[0],
              value: 0, // Invisible data point for time scale extension only
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
          
          // Set phantom data on hidden options series to extend time scale
          if (phantomPoints.length > 0) {
            optionsSeries.current.setData(phantomPoints);
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
        window.removeEventListener('resize', handleResize);
        if (chart.current) chart.current.remove();
      };
  }, [showVolume]);

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



  const saveOptionsToStorage = (newOptions: Option[]) => {
    localStorage.setItem('options', JSON.stringify(newOptions));
  };

  const renderOptionsOnChart = (optionsData: Option[]) => {
    console.log('🎯 renderOptionsOnChart called with', optionsData.length, 'options');
    
    if (!chart.current || !optionsSeries.current) {
      console.error('❌ Chart or options series not available');
      return;
    }

    // Build phantom points to ensure time scale up to 2027
    let combinedData: any[] = [];
    try {
      // Use known last data point since candlestickSeries.data() might not be available yet
      const lastDataPoint = { time: '2025-08-17' }; // We know this from the OHLCV data
      console.log('📊 Using known last candlestick data point:', lastDataPoint);
      
      const lastDate = new Date(lastDataPoint.time);
      const endDate = new Date('2027-12-31');
      let currentDate = new Date(lastDate);
      currentDate.setDate(1);
      currentDate.setMonth(currentDate.getMonth() + 1);
      
      console.log('👻 Creating phantom points from', currentDate.toISOString().split('T')[0], 'to 2027-12-31');
      
      while (currentDate <= endDate) {
        const timeStr = currentDate.toISOString().split('T')[0];
        combinedData.push({ time: timeStr, value: 0 });
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      console.log('👻 Created', combinedData.length, 'phantom points');
    } catch (error) {
      console.error('Error preparing phantom points for options series:', error);
    }

    // Add real option anchor points so markers have exact times in this series
    console.log('📍 Adding option anchor points...');
    for (const option of optionsData) {
      const anchorPoint = { time: option.expiry_date, value: option.strike_price };
      combinedData.push(anchorPoint);
      console.log('📍 Added option anchor:', option.expiry_date, 'strike:', option.strike_price);
    }

    // Sort by time to keep series data ordered
    combinedData.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));
    console.log('📋 Total combined data points:', combinedData.length);

    // Prepare markers (placed on the options series)
    console.log('🎨 Creating markers...');
    const markers: any[] = optionsData.map((option) => {
      let color = '#ff9800';
      if (option.size >= 2000000 && option.size < 5000000) color = '#ff8c00';
      else if (option.size >= 5000000) color = '#ff6600';

      let markerSize = 'small';
      if (option.size >= 2000000 && option.size < 5000000) markerSize = 'medium';
      else if (option.size >= 5000000) markerSize = 'large';

      const marker = {
        time: option.expiry_date,
        position: 'inBar',
        color,
        shape: 'circle',
        size: markerSize,
        text: `${option.option_type.toUpperCase()} ${(option.size / 1000000).toFixed(1)}M @ $${option.strike_price}`,
      };
      
      console.log('🎨 Created marker for', option.expiry_date, 'color:', color, 'size:', markerSize);
      return marker;
    });

    try {
      console.log('⚙️ Setting data on options series...');
      optionsSeries.current.setData(combinedData);
      
      console.log('⚙️ Setting markers on options series...');
      optionsSeries.current.setMarkers(markers);
      
      console.log('✅ Successfully set', combinedData.length, 'data points and', markers.length, 'markers');
    } catch (error) {
      console.error('❌ Error setting options series data/markers:', error);
    }
  };

  const handleAddOption = (optionData: Omit<Option, 'id' | 'created_at'>) => {
    console.log('➕ handleAddOption called with:', optionData);
    
    try {
      // Validate future dates - current data goes to August 17, 2025
      const expiryDate = new Date(optionData.expiry_date);
      const currentDate = new Date('2025-08-17');
      
      console.log('📅 Validating expiry date:', optionData.expiry_date, 'vs current:', '2025-08-17');
      
      if (expiryDate <= currentDate) {
        console.warn('⚠️ Invalid expiry date - too early');
        alert('Expiry date must be in the future (after August 17, 2025)');
        return;
      }
      
      // Create new option with generated ID
      const optionId = Date.now();
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

  const handleDeleteOption = (optionId: number | undefined) => {
    console.log('🗑️ handleDeleteOption called with ID:', optionId);
    
    if (!optionId) {
      console.error('❌ Cannot delete option: ID is undefined');
      return;
    }
    
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
      volumeSeries.current.applyOptions({ visible: newShowVolume });
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
            {dataSource === 'api' && <span className="status api">📊 Historical Data</span>}
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
              options.filter(option => option.id).map((option) => {
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
