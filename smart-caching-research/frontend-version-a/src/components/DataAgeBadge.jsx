import React from 'react';

const DataAgeBadge = ({ source, ageMinutes }) => {
  const isNetwork = source === 'network';
  const displayAge = ageMinutes === 'N/A' ? 'N/A' : `${ageMinutes} min`;

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: isNetwork ? '#e1f5fe' : '#fff3e0',
    color: isNetwork ? '#01579b' : '#e65100',
    border: `1px solid ${isNetwork ? '#b3e5fc' : '#ffe0b2'}`,
    margin: '10px 0',
    fontFamily: 'sans-serif'
  };

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isNetwork ? '#0288d1' : '#fb8c00',
    marginRight: '6px'
  };

  return (
    <div className="research-data-badge" style={badgeStyle}>
      <span style={dotStyle}></span>
      <span style={{ marginRight: '10px' }}>Source: {source}</span>
      <span>Data Age: {displayAge}</span>
    </div>
  );
};

export default DataAgeBadge;
