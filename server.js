const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key'; // Replace in production

app.use(cors());
app.use(bodyParser.json());

// Middleware to authenticate and extract user role from JWT
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = { userId: decoded.userId, userType: decoded.userType };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Middleware to restrict access based on user role
function restrictTo(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ message: "Access forbidden" });
    }
    next();
  };
}

// MySQL2 Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Juice_Depot'
});

// Test DB connection
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL2 database');
});

// Register route
app.post('/register', async (req, res) => {
    const { userName, passWord, userType } = req.body;
    const hashedPassword = await bcrypt.hash(passWord, 10);

    const sql = 'INSERT INTO Users (userName, passWord, userType) VALUES (?, ?, ?)';
    db.query(sql, [userName, hashedPassword, userType], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User registered successfully' });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { userName, passWord } = req.body;
    const sql = 'SELECT * FROM Users WHERE userName = ?';

    db.query(sql, [userName], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid username' });

        const user = results[0];
        const match = await bcrypt.compare(passWord, user.passWord);
        if (!match) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ userId: user.userId, userType: user.userType }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, userType: user.userType });
    });
});

// Add a product (restricted to admin)
app.post('/products', authenticate, restrictTo(['admin']), (req, res) => {
  const { productName, buyUnitPrice, sellUnitPrice } = req.body;
  const sql = 'INSERT INTO Products (productName, buyUnitPrice, sellUnitPrice, quantity) VALUES (?, ?, ?, 0)';
  db.query(sql, [productName, buyUnitPrice, sellUnitPrice], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product added successfully' });
  });
});

// Get all products (restricted to admin)
app.get('/products', authenticate, restrictTo(['admin']), (req, res) => {
  db.query('SELECT * FROM Products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Update product (restricted to admin)
app.put('/products/:productID', authenticate, restrictTo(['admin']), (req, res) => {
  const { productName, buyUnitPrice, sellUnitPrice } = req.body;
  const { productID } = req.params;
  const sql = 'UPDATE Products SET productName = ?, buyUnitPrice = ?, sellUnitPrice = ? WHERE productID = ?';
  db.query(sql, [productName, buyUnitPrice, sellUnitPrice, productID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product updated successfully' });
  });
});

// Delete product (restricted to admin)
app.delete('/products/:productID', authenticate, restrictTo(['admin']), (req, res) => {
  const { productID } = req.params;
  const sql = 'DELETE FROM Products WHERE productID = ?';
  db.query(sql, [productID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted successfully' });
  });
});

// Stock In (restricted to admin)
app.post('/stockin', authenticate, restrictTo(['admin']), (req, res) => {
  const { productID, quantity, date } = req.body;
  const sql = 'INSERT INTO Stock_In (productID, quantity, date) VALUES (?, ?, ?)';
  db.query(sql, [productID, quantity, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const updateQtySql = 'UPDATE Products SET quantity = quantity + ? WHERE productID = ?';
    db.query(updateQtySql, [quantity, productID], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Stock-In recorded and product quantity updated' });
    });
  });
});

// Stock Out (restricted to worker and admin)
app.post('/stockout', authenticate, restrictTo(['worker', 'admin']), (req, res) => {
  const { productID, quantity, date } = req.body;
  const sql = 'INSERT INTO Stock_Out (productID, quantity, date) VALUES (?, ?, ?)';
  db.query(sql, [productID, quantity, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const updateQtySql = 'UPDATE Products SET quantity = quantity - ? WHERE productID = ?';
    db.query(updateQtySql, [quantity, productID], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Stock-Out recorded and product quantity updated' });
    });
  });
});

// General Report (restricted to admin)
app.get('/reports/general', authenticate, restrictTo(['admin']), (req, res) => {
  const { from, to } = req.query;
  const sql = `
    SELECT 
      p.productName,
      IFNULL(SUM(si.quantity), 0) AS purchasedQty,
      IFNULL(SUM(si.quantity) * p.buyUnitPrice, 0) AS purchasedAmount,
      IFNULL(SUM(so.quantity), 0) AS soldQty,
      IFNULL(SUM(so.quantity) * p.sellUnitPrice, 0) AS soldAmount,
      IFNULL(SUM(si.quantity), 0) - IFNULL(SUM(so.quantity), 0) AS remaining
    FROM Products p
    LEFT JOIN Stock_In si ON p.productID = si.productID AND si.date BETWEEN ? AND ?
    LEFT JOIN Stock_Out so ON p.productID = so.productID AND so.date BETWEEN ? AND ?
    GROUP BY p.productID
  `;
  db.query(sql, [from, to, from, to], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Product Report by ID (restricted to admin)
app.get('/reports/product/:id', authenticate, restrictTo(['admin']), (req, res) => {
  const { id } = req.params;
  const { from, to } = req.query;
  const sql = `
    SELECT 
      d.date,
      IFNULL(SUM(CASE WHEN d.type = 'in' THEN d.quantity END), 0) AS purchasedQty,
      IFNULL(SUM(CASE WHEN d.type = 'in' THEN d.quantity * p.buyUnitPrice END), 0) AS purchasedAmount,
      IFNULL(SUM(CASE WHEN d.type = 'out' THEN d.quantity END), 0) AS soldQty,
      IFNULL(SUM(CASE WHEN d.type = 'out' THEN d.quantity * p.sellUnitPrice END), 0) AS soldAmount
    FROM (
      SELECT productID, quantity, date, 'in' AS type FROM Stock_In WHERE productID = ? AND date BETWEEN ? AND ?
      UNION ALL
      SELECT productID, quantity, date, 'out' AS type FROM Stock_Out WHERE productID = ? AND date BETWEEN ? AND ?
    ) d
    JOIN Products p ON p.productID = d.productID
    GROUP BY d.date
    ORDER BY d.date ASC
  `;
  db.query(sql, [id, from, to, id, from, to], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
