import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { queueAction } from '../utils/offlineQueue';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const orderData = {
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await axios.post('http://localhost:8000/api/checkout', orderData);
      setSuccess(true);
      clearCart();
    } catch (err) {
      if (!navigator.onLine) {
        await queueAction('CHECKOUT', orderData);
        setSuccess(true);
        clearCart();
        alert('Offline: Your order has been queued and will be sent when you are back online.');
      } else {
        setError(err.response?.data?.message || 'Checkout failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-success">
        <h2>Order Successful!</h2>
        <p>Your order has been placed and is being processed.</p>
        <button onClick={() => navigate('/')} className="back-btn">Return to Store</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Customer Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label>Shipping Address</label>
            <textarea required placeholder="123 Street, City, Country"></textarea>
          </div>
          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Processing...' : `Place Order ($${cartTotal.toFixed(2)})`}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
