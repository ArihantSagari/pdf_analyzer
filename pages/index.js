import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Chip,
} from '@mui/material';

const Dashboard = () => {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [extractionTags, setExtractionTags] = useState(['Name', 'Date', 'Amount']);
  const [newTag, setNewTag] = useState('');
  const [reviewData] = useState([{ Name: 'John Doe', Date: '2024-11-18', Amount: '$500' }]);

  const handleFileUpload = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setStep(2);
  };

  const addExtractionTag = () => {
    if (newTag && !extractionTags.includes(newTag)) {
      setExtractionTags((prevTags) => [...prevTags, newTag]);
      setNewTag('');
    }
  };

  const handleDownloadCSV = () => {
    if (reviewData.length === 0) {
      alert('No data available for download');
      return;
    }
    const csv = Papa.unparse(reviewData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'extracted_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: '10px' }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          Extract Tool
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Automated data extraction tool for organizing key information from documents
        </Typography>
        <Stepper activeStep={step - 1} alternativeLabel sx={{ marginBottom: 4 }}>
          {['Upload Files', 'Add Extraction Tags', 'View Data'].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {step === 1 && (
          <Box sx={{ marginTop: 2 }}>
            <Dropzone onDrop={handleFileUpload}>
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed #90caf9',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#42a5f5',
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography sx={{ color: '#1976d2' }}>
                    Drag and drop files here, or click to select files
                  </Typography>
                </Box>
              )}
            </Dropzone>
            {files.length > 0 && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6">Uploaded Files:</Typography>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>
              Extraction Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 2 }}>
              {extractionTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  variant="outlined"
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#90caf9',
                      color: '#ffffff',
                      cursor: 'pointer',
                    },
                  }}
                />
              ))}
            </Box>
            <TextField
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" onClick={addExtractionTag} color="primary">
              Add Tag
            </Button>
            <Button
              variant="contained"
              onClick={() => setStep(3)}
              color="secondary"
              sx={{ marginLeft: 2 }}
            >
              Next
            </Button>
          </Box>
        )}

        {step === 3 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Data
            </Typography>
            {reviewData.length > 0 ? (
              <Table sx={{ marginBottom: 2 }}>
                <TableHead>
                  <TableRow>
                    {Object.keys(reviewData[0]).map((header, index) => (
                      <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography>No data available for review</Typography>
            )}
            <Button variant="contained" onClick={handleDownloadCSV} color="primary">
              Download CSV
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
