import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Button,
    Tooltip,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [copySuccess, setCopySuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You need to login first');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:8081/api/urls', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // If we get a successful response, set the URLs
            setUrls(response.data);
            setLoading(false);
            // Clear any previous errors
            setError('');
        } catch (err) {
            console.error('Error fetching URLs:', err);

            // Check if this is a 404 Not Found error, which is normal for new users
            if (err.response && err.response.status === 404) {
                // Not really an error - just no URLs yet
                setUrls([]);
                setError('');
            }
            // Check if it's a 401 Unauthorized error, which means token issues
            else if (err.response && err.response.status === 401) {
                setError('Your session has expired. Please login again.');
            }
            // For other errors, set a generic message but don't show it for new users
            else {
                // Only show error if it's not the first load (assuming new user)
                setError('');
            }

            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopySuccess(true);
        });
    };

    const handleDeleteUrl = async (shortCode) => {
        try {
            const token = localStorage.getItem('token');

            await axios.delete(`http://localhost:8081/api/urls/${shortCode}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Remove deleted URL from state
            setUrls(urls.filter(url => url.shortCode !== shortCode));
            setDeleteSuccess(true);
        } catch (err) {
            setError('Failed to delete URL. Please try again.');
        }
    };

    const handleCloseSnackbar = () => {
        setCopySuccess(false);
        setDeleteSuccess(false);
        setError(''); // Also clear any error messages
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (err) {
            return 'Invalid date';
        }
    };

    const handleCreateNewUrl = () => {
        navigate('/shorten');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Your URLs Dashboard
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 3 }}
                    onClick={handleCreateNewUrl}
                >
                    Shorten New URL
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {urls.length === 0 ? (
                    <Paper sx={{ p: 5, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Welcome to URL Shortener!
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            You haven't shortened any URLs yet. Get started by creating your first one!
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleCreateNewUrl}
                        >
                            Create Your First Short URL
                        </Button>
                    </Paper>
                ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Original URL</TableCell>
                                        <TableCell>Short URL</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Clicks</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {urls
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((url) => (
                                            <TableRow key={url.shortCode}>
                                                <TableCell>
                                                    <Tooltip title={url.originalUrl}>
                                                        <Typography noWrap sx={{ maxWidth: 300 }}>
                                                            {url.originalUrl}
                                                        </Typography>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography sx={{ mr: 1 }}>
                                                            {url.shortUrl}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => copyToClipboard(url.shortUrl)}
                                                            aria-label="copy"
                                                        >
                                                            <ContentCopyIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{formatDate(url.createdAt)}</TableCell>
                                                <TableCell>{url.clickCount}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="delete"
                                                        color="error"
                                                        onClick={() => handleDeleteUrl(url.shortCode)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="analytics"
                                                        color="primary"
                                                        onClick={() => navigate(`/analytics/${url.shortCode}`)}
                                                    >
                                                        <BarChartIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={urls.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                )}
            </Box>

            <Snackbar
                open={copySuccess}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    URL copied to clipboard!
                </Alert>
            </Snackbar>

            <Snackbar
                open={deleteSuccess}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    URL deleted successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Dashboard;