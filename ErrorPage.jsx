// Components/ErrorPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();
    
    // NOTE: The expected text is slightly different from the screenshot:
    // Screenshot: "Something Went Wrong. We're sorry but an error occurred. Please try again."
    // Test case: /We're sorry, but an error occurred. Please try again later./i
    
    const handleGoBack = () => {
        navigate(-1); // Go back one step in history
    };
    
    return (
        <div className="error-container">
            <h1>Something Went Wrong</h1>
            <p>We're sorry, but an error occurred. Please try again later.</p>
            <button onClick={handleGoBack}>Go Back</button>
        </div>
    );
};

export default ErrorPage;

