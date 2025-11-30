import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Button, Paper, Box, Tabs, Tab, Chip
} from '@mui/material';
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { generatedCode, apiUrl } = location.state || {};
    const [activeTab, setActiveTab] = useState(0);

    if (!generatedCode) {
        return (
            <Container sx={{ py: 8 }}>
                <Typography variant="h5">No code generated. Please go back and try again.</Typography>
                <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Home</Button>
            </Container>
        );
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth={false} sx={{ py: 2, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8f9fa' }}>
            {/* Header Section */}
            <Paper elevation={0} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mr: 2, color: '#555' }}
                >
                    Back
                </Button>

                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: '#1a1a1a', mr: 2 }}>
                        Generated Integration
                    </Typography>
                    <Chip
                        label={`Project: ${apiUrl ? new URL(apiUrl).hostname : 'Unknown Source'}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 'medium' }}
                    />
                </Box>

                <Button
                    variant="contained"
                    color="success"
                    endIcon={<PlayArrowIcon />}
                    onClick={() => navigate('/sandbox', { state: { generatedCode, apiUrl } })}
                    sx={{ px: 3, fontWeight: 'bold', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                >
                    Test in Sandbox
                </Button>
            </Paper>

            <Paper elevation={4} sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                {/* Sidebar / File List */}
                <Box sx={{ width: '300px', borderRight: '1px solid #e0e0e0', bgcolor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Explorer
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {generatedCode.files.length} files generated
                        </Typography>
                    </Box>
                    <Tabs
                        orientation="vertical"
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            borderRight: 1,
                            borderColor: 'divider',
                            flexGrow: 1,
                            '& .MuiTab-root': {
                                alignItems: 'flex-start',
                                textAlign: 'left',
                                textTransform: 'none',
                                fontSize: '0.95rem',
                                pl: 3,
                                minHeight: 48
                            },
                            '& .Mui-selected': {
                                bgcolor: '#e3f2fd',
                                fontWeight: 'bold'
                            }
                        }}
                    >
                        {generatedCode.files.map((file, index) => (
                            <Tab key={index} label={file.filename} />
                        ))}
                    </Tabs>
                </Box>

                {/* Code Editor Area */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#1e1e1e' }}>
                    <Box sx={{
                        p: 2,
                        borderBottom: '1px solid #333',
                        bgcolor: '#252526',
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: 'Consolas, monospace', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#61dafb', marginRight: '8px' }}>📄</span> {generatedCode.files[activeTab].filename}
                        </Typography>
                        <Box>
                            <Button
                                startIcon={<ContentCopyIcon />}
                                size="small"
                                sx={{ mr: 1, color: '#fff', borderColor: '#555' }}
                                variant="outlined"
                            >
                                Copy
                            </Button>
                            <Button
                                startIcon={<DownloadIcon />}
                                size="small"
                                sx={{ color: '#fff', borderColor: '#555' }}
                                variant="outlined"
                            >
                                Download
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Editor
                            height="100%"
                            defaultLanguage="java"
                            theme="vs-dark"
                            value={generatedCode.files[activeTab].content}
                            options={{
                                readOnly: true,
                                minimap: { enabled: true },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                padding: { top: 20, bottom: 20 }
                            }}
                        />
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default ResultsPage;
