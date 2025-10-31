// Components/Register.jsx
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/users/register';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        role: 'buyer', // Default role
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const registerMutation = useMutation(
        (userData) => axios.post(API_URL, userData),
        {
            onSuccess: () => {
                alert('Registration successful! Please log in.');
                navigate('/login');
            },
            onError: (error) => {
                console.error('Registration error:', error.response ? error.response.data : error.message);
                // Try to extract Mongoose validation error message if available
                const errorMessage = error.response?.data?.message || 'Registration failed. Please check your details.';
                alert(errorMessage);
            },
        }
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First Name is required';
        if (!formData.lastName) newErrors.lastName = 'Last Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
        // Add basic mobile number format check here to pass FE test
        if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Mobile Number must be 10 digits';

        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const { confirmPassword, ...dataToSend } = formData;
            registerMutation.mutate(dataToSend);
        }
    };

    return (
        <div className="register-container">
            <h2>Create Your Account</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}

                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}

                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="error-message">{errors.email}</p>}

                <input type="text" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
                {errors.mobileNumber && <p className="error-message">{errors.mobileNumber}</p>}

                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>

                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                {errors.password && <p className="error-message">{errors.password}</p>}

                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

                <button type="submit" disabled={registerMutation.isLoading}>
                    {registerMutation.isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className="login-link">
                Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
            </p>
        </div>
    );
};

export default Register;
