import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { NetworkProvider } from './context/NetworkContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import './index.css';
import { processQueue } from './utils/offlineQueue';
import axios from 'axios';

function App() {
  // Offline Queue Sync: process queued actions when the device comes back online
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Research-C] Back online. Processing offline queue...');
      processQueue(async (action) => {
        if (action.type === 'ADD_TO_CART') {
          await axios.post('http://localhost:8000/api/cart/add', action.payload);
        } else if (action.type === 'CHECKOUT') {
          await axios.post('http://localhost:8000/api/checkout', action.payload);
        }
        await axios.post('http://localhost:8000/api/sync-offline-actions', {
          actions: [action]
        });
      });
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <NetworkProvider>
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
    </NetworkProvider>
  );
}

export default App;
