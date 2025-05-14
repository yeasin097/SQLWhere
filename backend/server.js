const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create an in-memory database
const db = new sqlite3.Database(':memory:');

// Initialize the database with tables and sample data
db.serialize(() => {
  // Create products table
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY, 
    name TEXT, 
    description TEXT, 
    price REAL, 
    category_id INTEGER,
    release_status TEXT
  )`);
  
  // Insert public products (normal visibility)
  db.run("INSERT INTO products VALUES (1, 'Basic Laptop', 'Entry-level laptop for everyday use', 499.99, 1, 'public')");
  db.run("INSERT INTO products VALUES (2, 'Premium Smartphone', 'High-end smartphone with advanced features', 999.99, 2, 'public')");
  db.run("INSERT INTO products VALUES (3, 'Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 3, 'public')");
  db.run("INSERT INTO products VALUES (7, 'Gaming Laptop', 'High Performance Gaming Laptop', 999.99, 1, 'public')");
  db.run("INSERT INTO products VALUES (8, 'Smartphone', 'Medium-end smartphone with advanced features', 299.99, 2, 'public')");
  db.run("INSERT INTO products VALUES (9, 'Wired Headphones', 'Noise-cancelling wired headphones', 99.99, 3, 'public')");
  
  // Insert unreleased products (should be hidden)
  db.run("INSERT INTO products VALUES (4, 'Next-Gen Gaming Console', 'Unreleased next generation gaming platform', 599.99, 4, 'unreleased')");
  db.run("INSERT INTO products VALUES (5, 'Prototype Smartwatch', 'Advanced health monitoring prototype', 299.99, 3, 'unreleased')");
  db.run("INSERT INTO products VALUES (6, 'Future Phone Model X', 'Upcoming flagship smartphone with revolutionary features', 1299.99, 2, 'unreleased')");

  // Create categories table
  db.run(`CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name TEXT
  )`);

  db.run("INSERT INTO categories VALUES (1, 'Laptops')");
  db.run("INSERT INTO categories VALUES (2, 'Smartphones')");
  db.run("INSERT INTO categories VALUES (3, 'Audio')");
  db.run("INSERT INTO categories VALUES (4, 'Gaming')");
});

// API endpoint for products with SQL Injection vulnerability
app.get('/api/products', (req, res) => {
  const categoryId = req.query.category || 'all';
  let query;

  if (categoryId === 'all') {
    query = `SELECT * FROM products WHERE release_status = 'public'`;
  } else {
    query = `SELECT * FROM products WHERE category_id = '${categoryId}' AND release_status = 'public'`;
  }

  console.log("Executing SQL:", query);

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    // ✅ Send both the query and the data
    res.json({ sql: query, data: rows });
  });
});


// API endpoint for categories
app.get('/api/categories', (req, res) => {
  const query = `SELECT * FROM categories`;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ sql: query, data: rows });
  });
});

// API endpoint for product details
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const query = `SELECT * FROM products WHERE id = ?`;
  
  db.get(query, [productId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(row);
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});