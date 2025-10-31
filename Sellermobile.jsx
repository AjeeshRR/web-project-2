// Seller/SellerMobiles.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../userSlice';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/mobiles';

const SellerMobiles = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { userId, token } = useSelector(state => state.user);

    const [sortValue, setSortValue] = useState(1); // 1 for Asc, -1 for Desc
    const [searchValue, setSearchValue] = useState('');

    const fetchMobiles = async () => {
        const { data } = await axios.post(`${API_URL}/seller`, { userId, sortValue, searchValue }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    };

    const { data: mobiles, isLoading, isError } = useQuery(
        ['sellerMobiles', userId, sortValue, searchValue],
        fetchMobiles,
        {
            enabled: !!userId, // Only run query if userId exists
            initialData: [],
        }
    );
    
    const deleteMutation = useMutation(
        (mobileId) => axios.delete(`${API_URL}/${mobileId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }),
        {
            onSuccess: () => {
                alert('Mobile deleted successfully');
                queryClient.invalidateQueries('sellerMobiles');
            },
            onError: (error) => {
                alert(`Error deleting mobile: ${error.response?.data?.message || error.message}`);
            },
        }
    );

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    
    const handleEdit = (mobileId) => {
        localStorage.setItem('editId', mobileId);
        navigate('/seller/create');
    };
    
    const handleDelete = (mobileId) => {
        if (window.confirm('Are you sure you want to delete this mobile?')) {
            deleteMutation.mutate(mobileId);
        }
    };

    if (isLoading) return <div>Loading your mobiles...</div>;
    if (isError) return <div>Error loading your mobiles.</div>;

    return (
        <div className="seller-mobiles-container">
            <header className="navbar">
                <h1>MyMobiles</h1>
                <div className="nav-buttons">
                    <button onClick={() => navigate('/seller/create')}>Add Mobile</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <div className="search-sort-controls">
                <input
                    type="text"
                    placeholder="Search by brand or model"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <label>Sort by Price:</label>
                <select value={sortValue} onChange={(e) => setSortValue(Number(e.target.value))}>
                    <option value={1}>Low to High</option>
                    <option value={-1}>High to Low</option>
                </select>
            </div>

            <table className="mobiles-table">
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {mobiles.length > 0 ? (
                        mobiles.map((mobile) => (
                            <tr key={mobile._id}>
                                <td>{mobile.brand}</td>
                                <td>{mobile.model}</td>
                                <td>{mobile.description}</td>
                                <td>${mobile.mobilePrice}</td>
                                <td>{mobile.availableQuantity}</td>
                                <td>
                                    <button onClick={() => handleEdit(mobile._id)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(mobile._id)} className="delete-btn" disabled={deleteMutation.isLoading}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">You have no mobiles listed.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SellerMobiles;
