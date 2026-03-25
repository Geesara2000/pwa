/**
 * Adaptive Caching Logic
 * Determines the best caching strategy based on environmental triggers.
 */
export const determineStrategy = (network, battery) => {
  // Triggers for "Low Resource" mode (Cache-First)
  const isSlowNetwork = ['slow-2g', '2g', '3g'].includes(network.effectiveType);
  const isLowBattery = battery.level < 0.20 && !battery.charging;
  const isOffline = !network.online;

  if (isOffline || isSlowNetwork || isLowBattery) {
    return 'cache-first';
  }

  // Standard mode
  return 'network-first';
};

export const notifyServiceWorker = (strategy) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'UPDATE_STRATEGY',
      strategy: strategy
    });
    console.log(`[Research-C] Notified SW to use: ${strategy}`);
  }
};
