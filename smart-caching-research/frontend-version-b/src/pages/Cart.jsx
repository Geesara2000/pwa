import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, cartTotal, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/" className="back-btn">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image_url} alt={item.name} />
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="item-price">${item.price} x {item.quantity}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="total">
          <span>Total:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <button onClick={() => navigate('/checkout')} className="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
