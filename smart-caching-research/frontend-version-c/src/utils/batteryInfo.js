/**
 * Battery Information Utility
 * Monitors battery level and charging status.
 * Includes fallback simulation for browsers that don't support the Battery API.
 */
export const getBatteryInfo = async () => {
  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      return {
        level: battery.level,
        charging: battery.charging,
        supported: true
      };
    } catch (e) {
      console.warn('Battery API supported but failed:', e);
    }
  }

  // Fallback / Simulation for Research
  return {
    level: 1.0, // Default to full
    charging: true,
    supported: false,
    note: 'Simulated (API not supported)'
  };
};

export const subscribeToBatteryChanges = async (callback) => {
  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      const handleChange = () => callback({
        level: battery.level,
        charging: battery.charging,
        supported: true
      });

      battery.addEventListener('levelchange', handleChange);
      battery.addEventListener('chargingchange', handleChange);

      return () => {
        battery.removeEventListener('levelchange', handleChange);
        battery.removeEventListener('chargingchange', handleChange);
      };
    } catch (e) {
      console.error('Failed to subscribe to battery changes:', e);
    }
  }
  return () => {}; // No-op fallback
};
