import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DataAgeBadge from '../components/DataAgeBadge';
import { calculateDataAge, logDataAge } from '../utils/dataAge';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataInfo, setDataInfo] = useState({ source: 'network', ageMinutes: '0.00' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        const info = calculateDataAge(response.headers);
        setDataInfo(info);
        logDataAge('/api/products', info);
        
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Is the backend running?');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-content">
      <DataAgeBadge source={dataInfo.source} ageMinutes={dataInfo.ageMinutes} />
      <div className="product-grid">
      {products.map(product => (
        <Link to={`/product/${product.id}`} key={product.id} className="product-card">
          <img src={product.image_url} alt={product.name} />
          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="category">{product.category}</p>
            <div className="product-footer">
              <span className="price">${product.price}</span>
              <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </Link>
      ))}
      </div>
    </div>
  );
};

export default Home;
