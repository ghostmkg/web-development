import React, { useState } from 'react';
import zlib from 'browserify-zlib';
import { Buffer } from 'buffer';
import { Box, Button, Typography, Card, CardContent, CircularProgress, Snackbar, Alert } from '@mui/material';
import './FileCompression.css'; 
function FileCompression() {
    const [compressedFile, setCompressedFile] = useState(null);
    const [decompressedFile, setDecompressedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // Compress File
    const handleCompress = (file) => {
        setLoading(true); // Start loading indicator
        const reader = new FileReader();
        reader.onload = () => {
            const fileData = Buffer.from(reader.result);
            const compressedData = zlib.deflateSync(fileData); // Compress data
            setCompressedFile(new Blob([compressedData], { type: 'application/octet-stream' }));
            setLoading(false); // Stop loading indicator
            setSnackbarMessage('File compressed successfully!');
            setSnackbarOpen(true); // Show success message
        };
        reader.readAsArrayBuffer(file);
    };

    // Decompress File
    const handleDecompress = (file) => {
        setLoading(true); // Start loading indicator
        const reader = new FileReader();
        reader.onload = () => {
            const fileData = Buffer.from(reader.result);
            const decompressedData = zlib.inflateSync(fileData); // Decompress data
            setDecompressedFile(new Blob([decompressedData], { type: 'text/plain' }));
            setLoading(false); // Stop loading indicator
            setSnackbarMessage('File decompressed successfully!');
            setSnackbarOpen(true); // Show success message
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
            <Card sx={{ maxWidth: 400, p: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        File Compression & Decompression
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Compress your files quickly and download them as compressed .zlib files. 
                        Or, decompress your compressed files back to their original format.
                    </Typography>

                    {/* Compress File Section */}
                    <input accept=".txt,.json,.csv" style={{ display: 'none' }} id="upload-compress" type="file" onChange={(e) => handleCompress(e.target.files[0])} />
                    <label htmlFor="upload-compress">
                        <Button variant="contained" component="span" color="primary" fullWidth sx={{ mt: 2 }}>
                            Upload and Compress File
                        </Button>
                    </label>

                    {/* Decompress File Section */}
                    <input accept=".zlib" style={{ display: 'none' }} id="upload-decompress" type="file" onChange={(e) => handleDecompress(e.target.files[0])} />
                    <label htmlFor="upload-decompress">
                        <Button variant="contained" component="span" color="secondary" fullWidth sx={{ mt: 2 }}>
                            Upload and Decompress File
                        </Button>
                    </label>

                    {/* Loading Indicator */}
                    {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                            <CircularProgress />
                        </Box>
                    )}

                    {/* Download Link for Compressed File */}
                    {compressedFile && !loading && (
                        <Box mt={2} textAlign="center">
                            <Button variant="outlined" color="success" href={URL.createObjectURL(compressedFile)} download="compressed_file.zlib">
                                Download Compressed File
                            </Button>
                        </Box>
                    )}

                    {/* Download Link for Decompressed File */}
                    {decompressedFile && !loading && (
                        <Box mt={2} textAlign="center">
                            <Button variant="outlined" color="success" href={URL.createObjectURL(decompressedFile)} download="decompressed_file.txt">
                                Download Decompressed File
                            </Button>
                        </Box>
                    )}

                    {/* Success Message Snackbar */}
                    <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </CardContent>
            </Card>
        </Box>
    );
}

export default FileCompression;
