import React, { useState } from 'react';
import axios from 'axios';

function StockOut() {
    const [form, setForm] = useState({ productID: '', quantity: '', date: '' });
    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/stockout', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Stock Out recorded');
            setForm({ productID: '', quantity: '', date: '' });
        } catch {
            alert('Error recording sale');
        }
    };

    return (
        <div className="form-container">
            <h2>Record Stock-Out (Sale)</h2>
            <form onSubmit={handleSubmit}>
                <input name="productID" placeholder="Product ID" onChange={handleChange} value={form.productID} required />
                <input name="quantity" placeholder="Quantity" type="number" onChange={handleChange} value={form.quantity} required />
                <input name="date" type="date" onChange={handleChange} value={form.date} required />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default StockOut;
