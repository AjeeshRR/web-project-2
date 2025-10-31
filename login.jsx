// Components/Login.jsx
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../userSlice';

const API_URL = 'http://localhost:8080/api/users/login';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loginMutation = useMutation(
        (credentials) => axios.post(API_URL, credentials),
        {
            onSuccess: (data) => {
                const response = data.data;
                if (response.message === 'Login Successful') {
                    // Dispatch login action
                    dispatch(login({ 
                        userId: response.userId, 
                        role: response.role, 
                        token: response.token 
                    }));
                    
                    // Navigate based on role
                    if (response.role === 'seller') {
                        navigate('/seller/mobiles');
                    } else if (response.role === 'buyer') {
                        navigate('/buyer/mobiles');
                    }
                } else {
                    alert(response.message); // Show 'Invalid Credentials!'
                }
            },
            onError: (error) => {
                console.error('Login error:', error);
                alert('An error occurred during login. Please try again.');
            },
        }
    );

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            loginMutation.mutate({ email, password });
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-heading">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>
                <button type="submit" disabled={loginMutation.isLoading}>
                    {loginMutation.isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p className="register-link">
                Don't have an account? <span onClick={() => navigate('/register')}>Register here</span>
            </p>
        </div>
    );
};

export default Login;
