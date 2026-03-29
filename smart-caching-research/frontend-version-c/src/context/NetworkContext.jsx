/**
 * NetworkContext.jsx
 * Centralised single source of truth for adaptive network state & strategy.
 * Both the UI badge (Layout) and the SW notification (App) read from this context.
 * This prevents split-brain where they independently evaluate different snapshots.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getBatteryInfo } from '../utils/batteryInfo';
import { determineStrategy, notifyServiceWorker } from '../utils/adaptiveCaching';

const NetworkContext = createContext(null);

/** Read the latest connection snapshot defensively */
const getSnapshot = () => {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const online = navigator.onLine;
  // Only trust effectiveType when we are actually online
  const effectiveType = online
    ? (conn?.effectiveType ?? '4g')   // null/undefined-safe fallback
    : 'offline';

  return { online, effectiveType, rtt: conn?.rtt ?? 0, saveData: conn?.saveData ?? false };
};

export const NetworkProvider = ({ children }) => {
  const [netInfo, setNetInfo] = useState(getSnapshot);
  const [battery, setBattery] = useState({ level: 1.0, charging: true });
  const [strategy, setStrategy] = useState('network-first');

  /** Master recompute: one place, one truth. */
  const recompute = useCallback(async () => {
    const n = getSnapshot();
    const b = await getBatteryInfo();
    const s = determineStrategy(n, b);

    console.log(`[Research-C] Network snapshot: online=${n.online} effectiveType=${n.effectiveType}`);
    console.log(`[Research-C] Battery: level=${Math.round(b.level * 100)}% charging=${b.charging}`);
    console.log(`[Research-C] Adaptive strategy computed: ${s}`);

    setNetInfo(n);
    setBattery(b);
    setStrategy(s);
    notifyServiceWorker(s);
  }, []);

  useEffect(() => {
    // Run immediately on mount
    recompute();

    // Listen for online/offline
    window.addEventListener('online', recompute);
    window.addEventListener('offline', recompute);

    // Listen for connection changes (Chrome only)
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    conn?.addEventListener('change', recompute);

    // Battery changes: subscribeToBatteryChanges wraps the async Battery API
    let unsubBattery;
    import('../utils/batteryInfo').then(({ subscribeToBatteryChanges }) => {
      subscribeToBatteryChanges(recompute).then(unsub => {
        unsubBattery = unsub;
      });
    });

    return () => {
      window.removeEventListener('online', recompute);
      window.removeEventListener('offline', recompute);
      conn?.removeEventListener('change', recompute);
      if (unsubBattery) unsubBattery();
    };
  }, [recompute]);

  return (
    <NetworkContext.Provider value={{ netInfo, battery, strategy }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used inside <NetworkProvider>');
  return ctx;
};
