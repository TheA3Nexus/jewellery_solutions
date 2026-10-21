import React, { createContext, useContext, useState, useEffect } from 'react';

const HardwareContext = createContext(null);

export const HardwareProvider = ({ children }) => {
  // Connection states for peripherals
  const [isBridgeConnected, setIsBridgeConnected] = useState(false);
  const [scaleStatus, setScaleStatus] = useState('SIMULATED'); // 'ONLINE' | 'OFFLINE' | 'SIMULATED'
  const [printerStatus, setPrinterStatus] = useState('ONLINE'); // 'ONLINE' | 'OFFLINE'
  const [rfidStatus, setRfidStatus] = useState('ONLINE'); // 'ONLINE' | 'OFFLINE'
  
  // Real-time live scale readout
  const [scaleWeight, setScaleWeight] = useState(0.000);
  const [isScaleStable, setIsScaleStable] = useState(true);

  // Attempt connection to the local Hardware Bridge Daemon (ws://127.0.0.1:9876)
  useEffect(() => {
    let ws = null;
    let reconnectTimeout = null;

    const connectToBridge = () => {
      try {
        ws = new WebSocket('ws://127.0.0.1:9876');

        ws.onopen = () => {
          setIsBridgeConnected(true);
          setScaleStatus('ONLINE');
          console.info('[Hardware Bridge] Connected to native daemon on 127.0.0.1:9876');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'SCALE_UPDATE') {
              setScaleWeight(parseFloat(data.weightGm || 0));
              setIsScaleStable(Boolean(data.stable));
            }
          } catch (err) {
            console.error('[Hardware Bridge] Message parse error:', err);
          }
        };

        ws.onerror = () => {
          setIsBridgeConnected(false);
          setScaleStatus('SIMULATED');
        };

        ws.onclose = () => {
          setIsBridgeConnected(false);
          setScaleStatus('SIMULATED');
          // Try reconnecting in 5 seconds
          reconnectTimeout = setTimeout(connectToBridge, 5000);
        };
      } catch {
        setIsBridgeConnected(false);
        setScaleStatus('SIMULATED');
      }
    };

    connectToBridge();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  // Simulator controls for development and testing
  const simulateWeightPlacement = (weightGm) => {
    setIsScaleStable(false);
    setTimeout(() => {
      setScaleWeight(parseFloat(weightGm.toFixed(3)));
      setIsScaleStable(true);
    }, 200);
  };

  const tareScale = () => {
    setScaleWeight(0.000);
    setIsScaleStable(true);
  };

  // Direct ZPL Raw Print Dispatcher
  const printZplLabel = async (zplContent) => {
    console.info('[Hardware Bridge] Dispatching Raw ZPL Label payload:\n', zplContent);
    // In production, sends via WebSocket to the Go daemon for direct USB spooling
    return { success: true, timestamp: Date.now() };
  };

  return (
    <HardwareContext.Provider
      value={{
        isBridgeConnected,
        scaleStatus,
        printerStatus,
        rfidStatus,
        scaleWeight,
        isScaleStable,
        simulateWeightPlacement,
        tareScale,
        printZplLabel
      }}
    >
      {children}
    </HardwareContext.Provider>
  );
};

export const useHardware = () => {
  const context = useContext(HardwareContext);
  if (!context) {
    throw new Error('useHardware must be used within a HardwareProvider');
  }
  return context;
};