import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Service/AuthService';
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Button,
    Container
} from '@mui/material';

const LogoutPage = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('Logging you out...');

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Call the logout API endpoint
                await AuthService.logout();
                setStatus('success');
                setMessage('You have been successfully logged out.');

                // Redirect to login page after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (error) {
                console.error('Logout error:', error);
                setStatus('error');
                setMessage('There was an error during logout, but you have been logged out locally.');

                // Still redirect to login after a delay even if the server call fails
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        };

        performLogout();
    }, [navigate]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Logging Out
                    </Typography>

                    {status === 'loading' && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    <Typography variant="body1" paragraph>
                        {message}
                    </Typography>

                    {status !== 'loading' && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/login')}
                            sx={{ mt: 2 }}
                        >
                            Return to Login
                        </Button>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default LogoutPage;