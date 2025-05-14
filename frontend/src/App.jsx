import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ProductDetail from './ProductDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="/">SQL Injection Lab: WHERE Clause</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/" data-bs-toggle="modal" data-bs-target="#helpModal">
                    Help
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        
        {/* Help Modal */}
        <div className="modal fade" id="helpModal" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">SQL Injection Lab Instructions</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <h4>Your objective:</h4>
                <ol>
                  <li>Find a way to view all products, including those marked as 'unreleased'</li>
                  <li>Use UNION attacks to retrieve data from other tables in the database</li>
                </ol>
                
                <h4>Tips:</h4>
                <ul>
                  <li>Look at the URL when filtering products by category</li>
                  <li>Try modifying the 'category' parameter in the URL</li>
                  <li>Use techniques like ORDER BY to determine the number of columns</li>
                  <li>Once you know the column count, try UNION SELECT statements</li>
                </ul>
                
                <div className="alert alert-warning">
                  This is a purposely vulnerable application for educational purposes. Never apply these techniques on real websites without permission!
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;