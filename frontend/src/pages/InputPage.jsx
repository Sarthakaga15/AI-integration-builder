import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button,
    Paper, Box, Checkbox, FormControlLabel,
    CircularProgress, Alert, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';

function InputPage() {
    const navigate = useNavigate();
    const [apiUrl, setApiUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [targetLanguage, setTargetLanguage] = useState('java');
    const [options, setOptions] = useState({
        includeAuth: true,
        includePagination: true,
        includeErrorHandling: true,
        includeLogging: true,
        includeRateLimiting: false
    });

    const generateCode = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/v1/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiDocUrl: apiUrl,
                    options: options
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate code (Backend might be down or error occurred)');
            }

            const code = await response.json();
            // Navigate to results page with generated code
            navigate('/results', { state: { generatedCode: code, apiUrl } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    IntegrationAI Builder
                </Typography>
                <Box>
                    <Button sx={{ mr: 1 }}>Profile</Button>
                    <Button>Settings</Button>
                </Box>
            </Box>

            <Paper elevation={3} sx={{ p: 5, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Generate Integration Code Automatically
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Paste your API documentation URL below to get started.
                </Typography>

                <TextField
                    fullWidth
                    label="API Documentation URL"
                    variant="outlined"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://developer.calendly.com/api-docs/..."
                    sx={{ mb: 4 }}
                />

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Advanced Options
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4 }}>
                    <FormControlLabel
                        control={<Checkbox checked={options.includeAuth} onChange={(e) => setOptions({ ...options, includeAuth: e.target.checked })} />}
                        label="Include Authentication Setup"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={options.includeErrorHandling} onChange={(e) => setOptions({ ...options, includeErrorHandling: e.target.checked })} />}
                        label="Include Error Handling"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={options.includePagination} onChange={(e) => setOptions({ ...options, includePagination: e.target.checked })} />}
                        label="Include Pagination"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={options.includeLogging} onChange={(e) => setOptions({ ...options, includeLogging: e.target.checked })} />}
                        label="Include Logging"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={options.includeRateLimiting} onChange={(e) => setOptions({ ...options, includeRateLimiting: e.target.checked })} />}
                        label="Include Rate Limiting"
                    />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel id="language-select-label">Target Language</InputLabel>
                        <Select
                            labelId="language-select-label"
                            value={targetLanguage}
                            label="Target Language"
                            onChange={(e) => setTargetLanguage(e.target.value)}
                        >
                            <MenuItem value="java">Java (Spring Boot)</MenuItem>
                            <MenuItem value="python">Python</MenuItem>
                            <MenuItem value="nodejs">Node.js</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={generateCode}
                    disabled={loading || !apiUrl}
                    sx={{ py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Code →'}
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                    </Alert>
                )}
            </Paper>
        </Container>
    );
}

export default InputPage;
