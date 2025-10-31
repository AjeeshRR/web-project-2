// Buyer/MobilesList.jsx
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../userSlice';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/mobiles';
// Modal Component (simplified)
const MobileDetailsModal = ({ mobile, onClose }) => {
    if (!mobile) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{mobile.brand} {mobile.model} Details</h3>
                <p><strong>Brand:</strong> {mobile.brand}</p>
                <p><strong>Model:</strong> {mobile.model}</p>
                <p><strong>Description:</strong> {mobile.description}</p>
                <p><strong>Price:</strong> ${mobile.mobilePrice}</p>
                <p><strong>Available Quantity:</strong> {mobile.availableQuantity}</p>
                
                <h4>Seller Details:</h4>
                <p><strong>Posted by:</strong> {mobile.sellerDetails.firstName} {mobile.sellerDetails.lastName}</p>
                <p><strong>Contact Email:</strong> {mobile.sellerDetails.email}</p>
                <p><strong>Contact Phone:</strong> {mobile.sellerDetails.mobileNumber}</p>
                
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};
const MobilesList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [sortValue, setSortValue] = useState(1); // 1 for Asc, -1 for Desc
    const [searchValue, setSearchValue] = useState('');
    const [selectedMobile, setSelectedMobile] = useState(null);

    const { data: mobiles, isLoading, isError, refetch } = useQuery(
        ['mobiles', sortValue, searchValue],
        async () => {
            const { data } = await axios.post(API_URL, {
                sortValue,
                searchValue,
            });
            // Filter to only show mobiles with availableQuantity > 0
            return data.filter(mobile => mobile.availableQuantity > 0);
        },
        {
            refetchOnWindowFocus: false,
            // Initial data structure to ensure it's iterable
            initialData: [],
        }
    );

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    
    const openDetailsModal = (mobile) => {
        setSelectedMobile(mobile);
    };

    const closeDetailsModal = () => {
        setSelectedMobile(null);
    };

    if (isLoading) return <div>Loading available mobiles...</div>;
    if (isError) return <div>Error loading mobiles.</div>;

    return (
        <div className="mobiles-list-container">
            <div className="header-bar">
                <h1>Available Mobiles</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by brand or model"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <select value={sortValue} onChange={(e) => setSortValue(Number(e.target.value))}>
                    <option value={1}>Price: Low to High</option>
                    <option value={-1}>Price: High to Low</option>
                </select>
                <button onClick={refetch}>Search/Sort</button>
            </div>

            <table className="mobiles-table">
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Description</th>
                        <th>Price</th>
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
                                <td>
                                    <button onClick={() => openDetailsModal(mobile)}>View Info</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No mobiles found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {/* Expanded view modal */}
            {selectedMobile && <MobileDetailsModal mobile={selectedMobile} onClose={closeDetailsModal} />}
        </div>
    );
};

export default MobilesList
