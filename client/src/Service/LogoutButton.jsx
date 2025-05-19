import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Service/AuthService';
import { Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = ({ variant = "contained", color = "primary", size = "medium" }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const handleLogout = () => {
        setLoading(true);

        AuthService.logout()
            .then(() => {
                // Redirect to login page on successful logout
                navigate('/login');
            })
            .catch(err => {
                console.error('Logout error:', err);
                setError('Failed to logout. You have been logged out locally.');
                setShowError(true);

                // Still redirect to login even if the server call fails
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    return (
        <>
            <Button
                variant={variant}
                color={color}
                size={size}
                onClick={handleLogout}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon />}
                disabled={loading}
            >
                {loading ? 'Logging out...' : 'Logout'}
            </Button>

            <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default LogoutButton;