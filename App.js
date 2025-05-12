import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import Products from './components/Products';
import StockIn from './components/Stockin';
import StockOut from './components/StockOut';
import GeneralReport from './components/GeneralReport';
import ProductReport from './components/ProductReport';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register';
function App() {
    const [token, setToken] = useState(localStorage.getItem('token')); // Token state to track if the user is logged in

    return (
        <Router>
            <Routes>
                {/* Public Route: Login */}
                <Route path="/" element={<Login setToken={setToken} />} />

                {/* Protected Route: Only accessible if user is logged in */}
                <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                    {/* Protected Routes */}
                    <Route path="home" element={<div>Welcome to Juice Depot!</div>} />
                    <Route path="products" element={<Products />} />
                    <Route path="register" element={<Register />} />
                    {/* Add more protected routes here */}
                    {/* Example: */}
                    <Route path="stockin" element={<StockIn />} />
                    <Route path="stockout" element={<StockOut />} />
                    <Route path="report/general" element={<GeneralReport />} />
                    <Route path="report/product" element={<ProductReport />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
