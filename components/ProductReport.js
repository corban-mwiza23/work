import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductReport() {
    const [productID, setProductID] = useState('');
    const [products, setProducts] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [report, setReport] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:5000/products', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setProducts(res.data));
    }, []);

    const fetchReport = async () => {
        const res = await axios.get(`http://localhost:5000/reports/product/${productID}?from=${from}&to=${to}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setReport(res.data);
    };

    return (
        <div className="form-container">
            <h2>Product Report</h2>
            <select onChange={e => setProductID(e.target.value)} value={productID}>
                <option value="">-- Select Product --</option>
                {products.map(p => (
                    <option key={p.productID} value={p.productID}>{p.productName}</option>
                ))}
            </select>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
            <input type="date" value={to} onChange={e => setTo(e.target.value)} />
            <button onClick={fetchReport}>Generate</button>

            <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                <thead>
                    <tr>
                        <th>Date</th><th>Purchased Qty</th><th>Purchased Amt</th>
                        <th>Sold Qty</th><th>Sold Amt</th>
                    </tr>
                </thead>
                <tbody>
                    {report.map((r, i) => (
                        <tr key={i}>
                            <td>{r.date}</td>
                            <td>{r.purchasedQty}</td>
                            <td>{r.purchasedAmount}</td>
                            <td>{r.soldQty}</td>
                            <td>{r.soldAmount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductReport;
