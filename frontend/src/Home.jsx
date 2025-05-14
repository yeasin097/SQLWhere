import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductFilter from './ProductFilter';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [autoFetch, setAutoFetch] = useState(true);
  const location = useLocation();

  // Always read raw category directly from the URL
  const queryParams = new URLSearchParams(location.search);
  const rawCategory = queryParams.get('category') ?? 'all';

  // Update selectedCategory for dropdown (does NOT affect fetch)
  useEffect(() => {
    const categoryParam = queryParams.get('category');
    const manualParam = queryParams.get('manual');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    if (manualParam === 'true') {
      setAutoFetch(false);
    }
  }, [location.search]);

  // Use rawCategory for fetching (allows injections)
  useEffect(() => {
    if (!autoFetch) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('[FETCH] Raw category query:', rawCategory);
        const response = await axios.get(`http://localhost:3000/api/products?category=${encodeURIComponent(rawCategory)}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [rawCategory, autoFetch]);

  // Update URL based on selectedCategory (for dropdown use)
  useEffect(() => {
    if (!autoFetch) return;

    const url = new URL(window.location);
    if (selectedCategory === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', selectedCategory);
    }
    window.history.replaceState({}, '', url);
  }, [selectedCategory, autoFetch]);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-4">Product Catalog</h1>
      {autoFetch && (
        <ProductFilter onFilterChange={handleFilterChange} currentCategory={selectedCategory} />
      )}

      {products.length === 0 ? (
        <div className="alert alert-info">
          No products found. Try a different category or injection payload.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
          {products.map(product => (
            <div key={product.id} className="col">
              <div className="card h-100 shadow-sm product-card">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">
                    <span className="badge bg-success fs-5">${product.price.toFixed(2)}</span>
                    {product.release_status !== 'public' && (
                      <span className="badge bg-warning text-dark ms-2">{product.release_status}</span>
                    )}
                  </p>
                  <Link to={`/product/${product.id}`} className="btn btn-primary">View Details</Link>
                </div>
                <div className="card-footer text-muted">
                  <small>Category ID: {product.category_id}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Query Information</h5>
          <p className="card-text"><strong>Total products shown:</strong> {products.length}</p>
          <p className="card-text"><strong>Raw category parameter:</strong> <code>{rawCategory}</code></p>
          <div className="alert alert-secondary">
            <strong>URL:</strong> <code>{window.location.href}</code><br />
            <strong>Mode:</strong> {autoFetch ? "Auto-fetch enabled" : "Manual test mode (no automatic fetch)"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
