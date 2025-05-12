import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function Register() {
    const [form, setForm] = useState({ userName: '', passWord: '', userType: 'worker' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', form);
            alert(response.data.message);
        } catch (error) {
            alert('Registration failed!');
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="userName" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="passWord" placeholder="Password" onChange={handleChange} required />
                <select name="userType" onChange={handleChange}>
                    <option value="owner">Owner</option>
                    <option value="worker">Worker</option>
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
