import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthService from './Service/AuthService';

// Components
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import UrlShortener from './Components/URLShortener';
import NotFound from './Components/NotFound';
import Layout from './Components/Layout';
import LogoutPage from './Components/LogoutPage';  // Import the new logout page

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
    const isLoggedIn = AuthService.isLoggedIn();

    if (!isLoggedIn) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<LogoutPage />} />  {/* Add the logout route */}

                {/* Protected routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/shorten" element={
                    <ProtectedRoute>
                        <Layout>
                            <UrlShortener />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/analytics/:shortCode" element={
                    <ProtectedRoute>
                        <Layout>
                            {/* You'll need to create an Analytics component */}
                            <div>Analytics (To be implemented)</div>
                        </Layout>
                    </ProtectedRoute>
                } />

                {/* Not found route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;