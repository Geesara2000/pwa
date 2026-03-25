/**
 * Network Information Utility
 * Monitors connection type and online status for adaptive research.
 */
export const getNetworkInfo = () => {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    online: navigator.onLine,
    effectiveType: conn ? conn.effectiveType : '4g', // Default to 4g if API not supported
    rtt: conn ? conn.rtt : 0,
    saveData: conn ? conn.saveData : false,
  };
};

export const subscribeToNetworkChanges = (callback) => {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  const handleChange = () => callback(getNetworkInfo());
  
  window.addEventListener('online', handleChange);
  window.addEventListener('offline', handleChange);
  if (conn) conn.addEventListener('change', handleChange);

  return () => {
    window.removeEventListener('online', handleChange);
    window.removeEventListener('offline', handleChange);
    if (conn) conn.removeEventListener('change', handleChange);
  };
};
