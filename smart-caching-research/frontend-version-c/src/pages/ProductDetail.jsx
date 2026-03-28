import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { queueAction } from '../utils/offlineQueue';
import DataAgeBadge from '../components/DataAgeBadge';
import { calculateDataAge, logDataAge } from '../utils/dataAge';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataInfo, setDataInfo] = useState({ source: 'network', ageMinutes: '0.00' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        const info = calculateDataAge(response.headers);
        setDataInfo(info);
        logDataAge(`/api/products/${id}`, info);

        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Product not found or API error.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    addToCart(product);
    
    // RESEARCH: Attempt to notify backend, queue if offline
    try {
      await axios.post('http://localhost:8000/api/cart/add', {
        product_id: product.id,
        quantity: 1
      });
      alert('Added to cart!');
    } catch (err) {
      if (!navigator.onLine) {
        await queueAction('ADD_TO_CART', { product_id: product.id, quantity: 1 });
        alert('Offline: Action queued for sync!');
      } else {
        alert('Added to local cart (Backend sync failed)');
      }
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      <DataAgeBadge source={dataInfo.source} ageMinutes={dataInfo.ageMinutes} />
      <div className="detail-layout">
        <img src={product.image_url} alt={product.name} className="detail-img" />
        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          <div className="price-tag">${product.price}</div>
          <p className="description">{product.description}</p>
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
