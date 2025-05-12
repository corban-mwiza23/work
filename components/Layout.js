import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './Layout.css';

function Layout() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        navigate('/'); // Redirect to login page
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <h2 className="sidebar-title">Juice Depot</h2>
                <nav>
                    <ul className="sidebar-nav">
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/stockin">Stock In</Link></li>
                        <li><Link to="/stockout">Stock Out</Link></li>
                        <li><Link to="/report/general">General Report</Link></li>
                        <li><Link to="/report/product">Product Report</Link></li>
                        <li><button className="logout-btn" onClick={logout}>Logout</button></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <header className="main-header">
                    <h1>Juice Depot Management</h1>
                </header>
                <section className="page-content">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}

export default Layout;
