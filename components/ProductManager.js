import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductManager() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        productID: '',
        productName: '',
        buyUnitPrice: '',
        sellUnitPrice: ''
    });
    const [editMode, setEditMode] = useState(false);

    const token = localStorage.getItem('token');

    const fetchProducts = async () => {
        const res = await axios.get('http://localhost:5000/products', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.put(`http://localhost:5000/products/${form.productID}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Product updated');
            } else {
                await axios.post('http://localhost:5000/products', form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Product added');
            }
            fetchProducts();
            setForm({ productID: '', productName: '', buyUnitPrice: '', sellUnitPrice: '' });
            setEditMode(false);
        } catch (error) {
            alert('Error saving product');
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await axios.delete(`http://localhost:5000/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        }
    };

    return (
        <div className="form-container">
            <h2>Manage Products</h2>
            <form onSubmit={handleSubmit}>
                <input name="productID" placeholder="ID" value={form.productID} onChange={handleChange} required />
                <input name="productName" placeholder="Name" value={form.productName} onChange={handleChange} required />
                <input name="buyUnitPrice" placeholder="Buy Price" value={form.buyUnitPrice} onChange={handleChange} required />
                <input name="sellUnitPrice" placeholder="Sell Price" value={form.sellUnitPrice} onChange={handleChange} required />
                <button type="submit">{editMode ? 'Update' : 'Add'} Product</button>
            </form>

            <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>Buy</th><th>Sell</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.productID}>
                            <td>{p.productID}</td>
                            <td>{p.productName}</td>
                            <td>{p.buyUnitPrice}</td>
                            <td>{p.sellUnitPrice}</td>
                            <td>
                                <button onClick={() => handleEdit(p)}>Edit</button>
                                <button onClick={() => handleDelete(p.productID)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductManager;
