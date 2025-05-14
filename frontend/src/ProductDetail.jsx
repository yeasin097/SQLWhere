import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Product not found or error loading details');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading product details...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger">
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">Back to Products</Link>
      </div>
    );
  }
  
  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <h2 className="mb-0">{product.name}</h2>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-8">
            <p className="lead">{product.description}</p>
          </div>
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body text-center">
                <h3 className="text-success">${product.price.toFixed(2)}</h3>
                <button className="btn btn-success mt-2">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
        
        <hr/>
        
        <div className="row">
          <div className="col-md-6">
            <h5>Product Details</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>Product ID:</strong> {product.id}</li>
              <li className="list-group-item"><strong>Category ID:</strong> {product.category_id}</li>
              <li className="list-group-item">
                <strong>Release Status:</strong> 
                <span className={`badge ${product.release_status === 'public' ? 'bg-success' : 'bg-warning text-dark'} ms-2`}>
                  {product.release_status}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <Link to="/" className="btn btn-secondary">Back to Products</Link>
      </div>
    </div>
  );
}

export default ProductDetail;