import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNetwork } from '../context/NetworkContext';

const Layout = () => {
  const { cartCount } = useCart();
  const { netInfo, battery, strategy } = useNetwork();
  const version = import.meta.env.VITE_APP_VERSION || 'A';

  const versionInfo = {
    A: { name: 'Traditional', strategy: 'None (Network Only)', class: 'version-a' },
    B: { name: 'Fixed PWA', strategy: 'Stale-While-Revalidate', class: 'version-b' },
    C: { name: 'Adaptive PWA', strategy: strategy, class: 'version-c' }
  }[version];

  // Build a human-readable network label (never trust a stale snapshot)
  const networkLabel = netInfo.online
    ? `Online (${netInfo.effectiveType})`
    : 'Offline';

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
          <strong>Network:</strong> {networkLabel}
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
