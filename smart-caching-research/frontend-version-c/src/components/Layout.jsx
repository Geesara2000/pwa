import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getNetworkInfo, subscribeToNetworkChanges } from '../utils/networkInfo';
import { getBatteryInfo, subscribeToBatteryChanges } from '../utils/batteryInfo';
import { determineStrategy } from '../utils/adaptiveCaching';

const Layout = () => {
  const { cartCount } = useCart();
  const version = import.meta.env.VITE_APP_VERSION || 'A';
  
  const [network, setNetwork] = useState(getNetworkInfo());
  const [battery, setBattery] = useState({ level: 1.0, charging: true });
  const [strategy, setStrategy] = useState('network-first');

  useEffect(() => {
    const update = async () => {
      const b = await getBatteryInfo();
      const n = getNetworkInfo();
      setNetwork(n);
      setBattery(b);
      setStrategy(determineStrategy(n, b));
    };

    update();
    const unsubN = subscribeToNetworkChanges(update);
    const unsubB = subscribeToBatteryChanges(update);
    return () => { unsubN(); unsubB(); };
  }, []);

  const versionInfo = {
    A: { name: 'Traditional', strategy: 'None (Network Only)', class: 'version-a' },
    B: { name: 'Fixed PWA', strategy: 'Stale-While-Revalidate', class: 'version-b' },
    C: { name: 'Adaptive PWA', strategy: strategy, class: 'version-c' }
  }[version];

  return (
    <div className="app-container">
      <header>
        <div className="header-left">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1>Smart Caching Research</h1>
            <p>Experimenting with Progressive Web App strategies</p>
          </Link>
        </div>
        <nav>
          <Link to="/">Products</Link>
          <Link to="/cart" className="cart-link">
            Cart ({cartCount})
          </Link>
        </nav>
        <div className={`version-badge ${versionInfo.class}`}>
          VERSION {version}: {versionInfo.name}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <div className="status-indicator">
        <div className="status-item">
          <strong>Network:</strong> {network.online ? `Online (${network.effectiveType})` : 'Offline'}
        </div>
        <div className="status-item">
          <strong>Battery:</strong> {Math.round(battery.level * 100)}% {battery.charging ? '(Charging)' : ''}
        </div>
        <div className="status-item">
          <strong>Strategy:</strong> <span style={{ textTransform: 'capitalize' }}>{versionInfo.strategy}</span>
        </div>
      </div>
    </div>
  );
};

export default Layout;
