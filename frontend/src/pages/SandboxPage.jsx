import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Button, Paper, Box,
    TextField, Radio, RadioGroup, FormControlLabel,
    Alert, Chip, CircularProgress
} from '@mui/material';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

function SandboxPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { generatedCode, apiUrl } = location.state || {};

    const [testEndpoint, setTestEndpoint] = useState('GET /users/me');
    const [loading, setLoading] = useState(false);
    const [testResult, setTestResult] = useState(null);

    if (!generatedCode) {
        return (
            <Container sx={{ py: 8 }}>
                <Typography variant="h5">No context found. Please start over.</Typography>
                <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Home</Button>
            </Container>
        );
    }

    const runTest = async () => {
        setLoading(true);
        setTestResult(null);

        try {
            const response = await fetch('http://localhost:8080/api/v1/sandbox/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: "mock_code_reference", // In real app, we'd send ID or full code
                    testConfig: {
                        endpoint: testEndpoint,
                        apiKey: "mock_key"
                    }
                })
            });

            const result = await response.json();
            // Simulate a slight delay for effect if it's too fast
            if (response.ok) {
                setTimeout(() => {
                    setTestResult(result);
                    setLoading(false);
                }, 800);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/results', { state: { generatedCode, apiUrl } })}>
                    Back to Code
                </Button>
                <Chip
                    icon={<SecurityIcon />}
                    label="Safe Mode ON"
                    color="warning"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                />
            </Box>

            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Sandbox Testing Environment
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, mt: 4 }}>
                {/* Left Column: Configuration */}
                <Box>
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Configure Test Credentials</Typography>
                        <TextField
                            fullWidth
                            label="API Token"
                            type="password"
                            defaultValue="sk_test_123456789"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Base URL"
                            defaultValue="https://api.calendly.com"
                            InputProps={{ readOnly: true }}
                            sx={{ bgcolor: '#f5f5f5' }}
                        />
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Select Test Endpoint</Typography>
                        <RadioGroup
                            value={testEndpoint}
                            onChange={(e) => setTestEndpoint(e.target.value)}
                        >
                            <FormControlLabel value="GET /users/me" control={<Radio />} label="GET /users/me" />
                            <FormControlLabel value="GET /users" control={<Radio />} label="GET /users" />
                            <FormControlLabel value="GET /event_types" control={<Radio />} label="GET /event_types" />
                        </RadioGroup>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            onClick={runTest}
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Run Test in Sandbox'}
                        </Button>
                    </Paper>
                </Box>

                {/* Right Column: Results */}
                <Box>
                    <Typography variant="h6" gutterBottom>Test Results</Typography>
                    <Paper elevation={3} sx={{ p: 3, minHeight: '400px', bgcolor: '#1e1e1e', color: '#fff', fontFamily: 'monospace' }}>
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress color="primary" />
                            </Box>
                        )}

                        {!loading && !testResult && (
                            <Typography color="grey.500">Run a test to see results here...</Typography>
                        )}

                        {!loading && testResult && (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#4caf50' }}>
                                    <CheckCircleIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Status: {testResult.status}</Typography>
                                </Box>
                                <Typography sx={{ mb: 2 }}>⏱ Response Time: {testResult.responseTime}ms</Typography>
                                <Typography sx={{ mb: 1 }}>Response Body:</Typography>
                                <Box sx={{ p: 2, bgcolor: '#000', borderRadius: 1, overflowX: 'auto' }}>
                                    <pre style={{ margin: 0 }}>
                                        {JSON.stringify(JSON.parse(testResult.sampleResponse || "{}"), null, 2)}
                                    </pre>
                                </Box>
                            </Box>
                        )}
                    </Paper>

                    {!loading && testResult && testResult.status === 'SUCCESS' && (
                        <Alert severity="success" sx={{ mt: 3 }} icon={<CheckCircleIcon fontSize="inherit" />}>
                            All tests passed! Safe to deploy to production.
                        </Alert>
                    )}

                    {!loading && testResult && testResult.status === 'SUCCESS' && (
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            size="large"
                            endIcon={<RocketLaunchIcon />}
                            sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
                        >
                            Deploy to Production
                        </Button>
                    )}
                </Box>
            </Box>
        </Container>
    );
}

export default SandboxPage;
