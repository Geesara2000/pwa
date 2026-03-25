import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import './index.css';

// Adaptive Utilities 

import { subscribeToNetworkChanges } from './utils/networkInfo';
import { getBatteryInfo, subscribeToBatteryChanges } from './utils/batteryInfo';
import { determineStrategy, notifyServiceWorker } from './utils/adaptiveCaching';
import { processQueue } from './utils/offlineQueue';
import axios from 'axios';

function App() {
  const version = import.meta.env.VITE_APP_VERSION;

  useEffect(() => {
    if (version !== 'C') return;

    const updateStrategy = async () => {
      const battery = await getBatteryInfo();
      const network = { online: navigator.onLine, effectiveType: navigator.connection?.effectiveType || '4g' };
      const strategy = determineStrategy(network, battery);
      notifyServiceWorker(strategy);
    };

    // Subscriptions
    const unsubNetwork = subscribeToNetworkChanges(updateStrategy);
    const unsubBattery = subscribeToBatteryChanges(updateStrategy);

    // Initial check
    updateStrategy();

    // Offline Queue Sync
    const handleOnline = () => {
      console.log('[Research-C] Back online. Processing offline queue...');
      processQueue(async (action) => {
        // Map types to backend endpoints
        if (action.type === 'ADD_TO_CART') {
          await axios.post('http://localhost:8000/api/cart/add', action.payload);
        } else if (action.type === 'CHECKOUT') {
          await axios.post('http://localhost:8000/api/checkout', action.payload);
        }
        // Research Sync: also notify the dedicated sync endpoint
        await axios.post('http://localhost:8000/api/sync-offline-actions', {
          actions: [action]
        });
      });
    };

    window.addEventListener('online', handleOnline);

    return () => {
      unsubNetwork();
      unsubBattery();
      window.removeEventListener('online', handleOnline);
    };
  }, [version]);

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
