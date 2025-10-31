// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromStorage, logout } from './userSlice';
import Login from './Components/Login';
import Register from './Components/Register';
import ErrorPage from './Components/ErrorPage';
import MobilesList from './Buyer/MobilesList';
import SellerMobiles from './Seller/SellerMobiles';
import CreateMobile from './Seller/CreateMobile';

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, role } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);
  
  // Custom Protected Route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/error" replace />; // Error page for unauthorized role
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/logout" element={() => { dispatch(logout()); return <Navigate to="/login" replace />; }} />

        {/* Home/Default route based on role or login status */}
        <Route path="/" element={
            isLoggedIn ? (
                role === 'seller' ? <Navigate to="/seller/mobiles" replace /> : <Navigate to="/buyer/mobiles" replace />
            ) : (
                <Navigate to="/login" replace />
            )
        } />

        {/* Buyer Routes */}
        <Route 
            path="/buyer/mobiles" 
            element={<ProtectedRoute allowedRoles={['buyer']}>
                <MobilesList />
            </ProtectedRoute>} 
        />
        
        {/* Seller Routes */}
        <Route 
            path="/seller/mobiles" 
            element={<ProtectedRoute allowedRoles={['seller']}>
                <SellerMobiles />
            </ProtectedRoute>} 
        />
        <Route 
            path="/seller/create" 
            element={<ProtectedRoute allowedRoles={['seller']}>
                <CreateMobile />
            </ProtectedRoute>} 
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;	
