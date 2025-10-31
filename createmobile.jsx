// Seller/CreateMobile.jsx
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/mobiles';

const CreateMobile = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { userId, token } = useSelector(state => state.user);
    
    // Check for edit mode
    const editId = localStorage.getItem('editId');
    const isEditMode = !!editId;
    
    const initialFormData = {
        brand: '',
        model: '',
        mobilePrice: '',
        description: '',
        availableQuantity: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    // Fetch mobile data for editing
    const { data: mobileToEdit, isFetching } = useQuery(
        ['mobile', editId],
        async () => {
            const { data } = await axios.get(`${API_URL}/${editId}`);
            return data;
        },
        {
            enabled: isEditMode,
            onSuccess: (data) => {
                // Populate form with fetched data
                setFormData({
                    brand: data.brand || '',
                    model: data.model || '',
                    mobilePrice: data.mobilePrice || '',
                    description: data.description || '',
                    availableQuantity: data.availableQuantity || '',
                });
            },
            onError: (error) => {
                alert('Could not load mobile for editing.');
                console.error(error);
            }
        }
    );

    // Mutation for Add/Create
    const createMutation = useMutation(
        (newMobile) => axios.post(`${API_URL}/add`, newMobile, {
            headers: { Authorization: `Bearer ${token}` }
        }),
        {
            onSuccess: () => {
                alert('Mobile added successfully');
                queryClient.invalidateQueries('sellerMobiles');
                setFormData(initialFormData); // Reset form
                navigate('/seller/mobiles');
            },
            onError: (error) => {
                const message = error.response?.data?.message || error.message;
                alert(`Error adding mobile: ${message}`);
            }
        }
    );

    // Mutation for Update/Edit
    const updateMutation = useMutation(
        (updatedMobile) => axios.put(`${API_URL}/${editId}`, updatedMobile, {
            headers: { Authorization: `Bearer ${token}` }
        }),
        {
            onSuccess: () => {
                alert('Mobile updated successfully');
                queryClient.invalidateQueries('sellerMobiles');
                localStorage.removeItem('editId'); // Clear edit mode
                navigate('/seller/mobiles');
            },
            onError: (error) => {
                const message = error.response?.data?.message || error.message;
                alert(`Error updating mobile: ${message}`);
            }
        }
    );

    useEffect(() => {
        // Cleanup localStorage on component unmount if navigating away without completing edit
        return () => {
            if (isEditMode) {
                // You might want to remove it here or only upon successful save
                // For this scenario, we rely on the save function to clear it.
            }
        };
    }, [isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.brand) newErrors.brand = 'Brand is required';
        if (!formData.model) newErrors.model = 'Model is required';
        if (!formData.mobilePrice) newErrors.mobilePrice = 'Price is required';
        if (!formData.availableQuantity) newErrors.availableQuantity = 'Quantity is required';
        if (!formData.description) newErrors.description = 'Description is required';

        if (formData.mobilePrice && (isNaN(formData.mobilePrice) || Number(formData.mobilePrice) <= 0)) 
            newErrors.mobilePrice = 'Price must be a positive number';
        if (formData.availableQuantity && (isNaN(formData.availableQuantity) || Number(formData.availableQuantity) < 0)) 
            newErrors.availableQuantity = 'Quantity must be 0 or greater';
            
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const dataToSend = {
                ...formData,
                mobilePrice: Number(formData.mobilePrice),
                availableQuantity: Number(formData.availableQuantity),
                userId: userId, // Ensure userId is included
            };
            
            if (isEditMode) {
                updateMutation.mutate(dataToSend);
            } else {
                createMutation.mutate(dataToSend);
            }
        }
    };
    
    if (isEditMode && isFetching) return <div>Loading mobile details for edit...</div>;

    const actionText = isEditMode ? 'Update' : 'Add';

    return (
        <div className="create-mobile-container">
            <h2>{actionText} {isEditMode ? formData.brand : 'New'} Mobile</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="brand">Brand:</label>
                <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} />
                {errors.brand && <p className="error-message">{errors.brand}</p>}

                <label htmlFor="model">Model:</label>
                <input type="text" id="model" name="model" value={formData.model} onChange={handleChange} />
                {errors.model && <p className="error-message">{errors.model}</p>}
                
                <label htmlFor="mobilePrice">Price:</label>
                <input type="number" id="mobilePrice" name="mobilePrice" value={formData.mobilePrice} onChange={handleChange} />
                {errors.mobilePrice && <p className="error-message">{errors.mobilePrice}</p>}
                
                <label htmlFor="availableQuantity">Available Quantity:</label>
                <input type="number" id="availableQuantity" name="availableQuantity" value={formData.availableQuantity} onChange={handleChange} />
                {errors.availableQuantity && <p className="error-message">{errors.availableQuantity}</p>}

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
                {errors.description && <p className="error-message">{errors.description}</p>}

                <button type="submit" disabled={createMutation.isLoading || updateMutation.isLoading}>
                    {isEditMode ? (updateMutation.isLoading ? 'Updating...' : 'Update Mobile') : (createMutation.isLoading ? 'Adding...' : 'Add Mobile')}
                </button>
                <button type="button" onClick={() => { localStorage.removeItem('editId'); navigate('/seller/mobiles'); }}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default CreateMobile;
