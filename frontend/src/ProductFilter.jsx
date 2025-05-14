import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductFilter({ onFilterChange, currentCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sql, setSql] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data.data); // ✅ access correct array
        setSql(response.data.sql);         // ✅ store SQL string
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row mb-4">
      <div className="col-md-6 offset-md-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Filter Products</h5>
            <select 
              className="form-select" 
              value={currentCategory} 
              onChange={(e) => onFilterChange(e.target.value)}
            >
              <option value="all">All Categories</option>
              {Array.isArray(categories) && categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {/* Show SQL Query */}
            <pre className="mt-3 text-muted small">{sql}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
