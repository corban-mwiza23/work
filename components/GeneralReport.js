import React, { useState } from 'react';
import axios from 'axios';

function GeneralReport() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [report, setReport] = useState([]);

    const token = localStorage.getItem('token');

    const fetchReport = async () => {
        const res = await axios.get(`http://localhost:5000/reports/general?from=${from}&to=${to}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setReport(res.data);
    };

    return (
        <div className="form-container">
            <h2>General Report</h2>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
            <input type="date" value={to} onChange={e => setTo(e.target.value)} />
            <button onClick={fetchReport}>Generate</button>

            <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                <thead>
                    <tr>
                        <th>Product</th><th>Purchased Qty</th><th>Purchased Amt</th>
                        <th>Sold Qty</th><th>Sold Amt</th><th>Remaining</th>
                    </tr>
                </thead>
                <tbody>
                    {report.map(r => (
                        <tr key={r.productName}>
                            <td>{r.productName}</td>
                            <td>{r.purchasedQty}</td>
                            <td>{r.purchasedAmount}</td>
                            <td>{r.soldQty}</td>
                            <td>{r.soldAmount}</td>
                            <td>{r.remaining}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GeneralReport;
