import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import DataAgeBadge from '../components/DataAgeBadge';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Product not found or API error.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      <DataAgeBadge source="network" ageMinutes="N/A" />
      <div className="detail-layout">
        <img src={product.image_url} alt={product.name} className="detail-img" />
        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          <div className="price-tag">${product.price}</div>
          <p className="description">{product.description}</p>
          <button 
            className="add-to-cart-btn"
            onClick={() => {
              addToCart(product);
              alert('Added to cart!');
            }}
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
