import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Layout = () => {
  const { cartCount } = useCart();
  const version = import.meta.env.VITE_APP_VERSION || 'A';

  const versionInfo = {
    A: { name: 'Traditional', strategy: 'None (Network Only)', class: 'version-a' },
    B: { name: 'Fixed PWA', strategy: 'Stale-While-Revalidate', class: 'version-b' },
    C: { name: 'Adaptive PWA', strategy: 'Dynamic Logic', class: 'version-c' }
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
          <strong>Network:</strong> {navigator.onLine ? 'Online' : 'Offline'}
        </div>
        <div className="status-item">
          <strong>Cache Strategy:</strong> {versionInfo.strategy}
        </div>
      </div>
    </div>
  );
};

export default Layout;
