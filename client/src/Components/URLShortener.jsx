import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography, Paper, Snackbar, IconButton, Alert, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const urlValidationSchema = Yup.object({
    url: Yup.string()
        .url('Enter a valid URL')
        .required('URL is required')
});

const UrlShortener = () => {
    const [shortUrl, setShortUrl] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setError(''); // Clear any previous errors

            // Get the token from local storage
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You need to login first');
                setSubmitting(false);
                return;
            }

            const response = await axios.post(
                'http://localhost:8081/api/shorten',
                { originalUrl: values.url },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setShortUrl(response.data.shortUrl);
            setSubmitting(false);

        } catch (error) {
            console.error('Error shortening URL:', error);

            // Handle different error cases
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 401) {
                    setError('Your session has expired. Please login again.');
                } else if (error.response.status === 400) {
                    setError('Invalid URL format. Please enter a valid URL.');
                } else {
                    setError(`Error: ${error.response.data.message || 'Failed to shorten URL'}`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                setError('No response from server. Please check your internet connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError('Error creating request. Please try again.');
            }

            setSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl).then(() => {
            setCopySuccess(true);
        });
    };

    const handleCloseSnackbar = () => {
        setCopySuccess(false);
    };

    const handleCloseError = () => {
        setError('');
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', py: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    URL Shortener
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseError}>
                        {error}
                    </Alert>
                )}

                <Formik
                    initialValues={{ url: '' }}
                    validationSchema={urlValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <Field
                                as={TextField}
                                name="url"
                                label="Enter URL to shorten"
                                placeholder="https://example.com"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                error={touched.url && Boolean(errors.url)}
                                helperText={touched.url && errors.url}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : null}
                            >
                                {isSubmitting ? 'Shortening...' : 'Shorten URL'}
                            </Button>
                        </Form>
                    )}
                </Formik>

                {shortUrl && (
                    <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Your shortened URL:
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <TextField
                                value={shortUrl}
                                variant="outlined"
                                fullWidth
                                InputProps={{ readOnly: true }}
                            />
                            <IconButton
                                color="primary"
                                onClick={copyToClipboard}
                                sx={{ ml: 1 }}
                                aria-label="copy to clipboard"
                            >
                                <ContentCopyIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => window.open(shortUrl, '_blank')}
                            >
                                Test Link
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setShortUrl('');
                                }}
                            >
                                Create Another
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>

            <Snackbar
                open={copySuccess}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message="URL copied to clipboard!"
            />
        </Box>
    );
};

export default UrlShortener;