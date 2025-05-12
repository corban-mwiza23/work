import React, { useState } from 'react';
import axios from 'axios';

function StockIn() {
    const [form, setForm] = useState({ productID: '', quantity: '', date: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/stockin', form); // No headers
            alert('Stock In recorded');
            setForm({ productID: '', quantity: '', date: '' }); // Reset form
        } catch (err) {
            alert('Error recording stock');
            console.error(err);
        }
    };

    return (
        <div className="form-container">
            <h2>Record Stock-In (Purchase)</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    name="productID" 
                    placeholder="Product ID" 
                    onChange={handleChange} 
                    value={form.productID} 
                    required 
                />
                <input 
                    name="quantity" 
                    placeholder="Quantity" 
                    type="number" 
                    onChange={handleChange} 
                    value={form.quantity} 
                    required 
                />
                <input 
                    name="date" 
                    type="date" 
                    onChange={handleChange} 
                    value={form.date} 
                    required 
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default StockIn;
