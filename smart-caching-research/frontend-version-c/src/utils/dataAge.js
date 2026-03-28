export const calculateDataAge = (headers) => {
  // Axios headers are lowercase
  const source = headers['x-cache-source'] || 'network';
  const cachedAt = headers['x-cache-at'];
  
  let ageMinutes = 'N/A';
  if (cachedAt) {
    ageMinutes = ((Date.now() - parseInt(cachedAt)) / 60000).toFixed(2);
  } else if (source === 'network') {
    ageMinutes = '0.00';
  }

  return { source, ageMinutes, cachedAt };
};

export const logDataAge = (endpoint, info) => {
  console.log(`[RESEARCH_DATA_AGE] endpoint=${endpoint} source=${info.source} ageMinutes=${info.ageMinutes}`);
};
