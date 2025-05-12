import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom'; // To navigate after login
import './index.css';
function Login({ setToken }) {
    const [form, setForm] = useState({ userName: '', passWord: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', form);
            const { token, userType } = response.data;
            setToken(token);
            localStorage.setItem('token', token); // Store token in localStorage

            // Navigate to the home page after successful login
            navigate('/home');
            alert(`Logged in as ${userType}`);
        } catch (error) {
            setError('Login failed! Please check your username and password.');
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="userName"
                    placeholder="Username"
                    value={form.userName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="passWord"
                    placeholder="Password"
                    value={form.passWord}
                    onChange={handleChange}
                    required
                />
                {error && <div className="error">{error}</div>}
                <button type="submit">Login</button>
                <p>Create an account <Link to='/register'>Register</Link></p>
            </form>
        </div>
    );
}

export default Login;
