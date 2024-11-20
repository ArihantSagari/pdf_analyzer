import React, { useState, useEffect } from 'react';
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
  Grid,
} from '@mui/material';

const Dashboard = () => {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [extractionTags, setExtractionTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [reviewData, setReviewData] = useState([
    { Name: 'Root', FileName: 'Resume.pdf', YOE: '2 years', JobTitle: 'Developer' },
  ]);
  const [error, setError] = useState('');

  const suggestedTags = ['File name', 'YOE', 'Job Title'];

  useEffect(() => {
    const savedStep = localStorage.getItem('step');
    const savedTags = JSON.parse(localStorage.getItem('extractionTags'));
    const savedFiles = JSON.parse(localStorage.getItem('files'));

    if (savedStep) setStep(parseInt(savedStep));
    if (savedTags) setExtractionTags(savedTags);
    if (savedFiles) setFiles(savedFiles);
  }, []);

  useEffect(() => {
    localStorage.setItem('step', step);
    localStorage.setItem('extractionTags', JSON.stringify(extractionTags));
    localStorage.setItem('files', JSON.stringify(files));
  }, [step, extractionTags, files]);

  const handleFileUpload = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setStep(2);
  };

  const addExtractionTag = () => {
    if (newTag && !extractionTags.includes(newTag)) {
      setExtractionTags((prevTags) => [...prevTags, newTag]);
      setNewTag('');
      setError('');
    }
  };

  const handleTagClick = (tag) => {
    if (!extractionTags.includes(tag)) {
      setExtractionTags((prevTags) => [...prevTags, tag]);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setExtractionTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleDownloadCSV = () => {
    if (extractionTags.length === 0) {
      alert('No tags selected for extraction');
      return;
    }

    const filteredData = reviewData.map((data) => {
      const filteredItem = {};
      extractionTags.forEach((tag) => {
        filteredItem[tag] = data[tag] || 'NA';
      });
      return filteredItem;
    });

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'extracted_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNext = () => {
    if (extractionTags.length < 3) {
      setError('Please enter a minimum of 3 extraction tags');
    } else {
      setStep(3);
      setError('');
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleReset = () => {
    setFiles([]);
    setExtractionTags([]);
    setNewTag('');
    setStep(1);
    setError('');
    localStorage.clear();
  };

  return (
    <Box sx={{ width: '100%', padding: { xs: 2, sm: 4, md: 6 }, overflow: 'hidden' }}>
      <Paper elevation={5} sx={{ padding: { xs: 3, sm: 4, md: 6 }, borderRadius: '12px', backgroundColor: '#f5f5f5' }}>
        <Typography variant="h3" gutterBottom color="primary" sx={{ fontWeight: 'bold', fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' } }}>
          Document Extractor Tool
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ color: '#555', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
          Effortlessly extract key information from your documents and export it into a structured format.
        </Typography>
        <Stepper activeStep={step - 1} alternativeLabel sx={{ marginBottom: 4, fontSize: { xs: '12px', sm: '14px' } }}>
          {['Upload Files', 'Add Extraction Tags', 'Review & Download'].map((label) => (
            <Step key={label}>
              <StepLabel sx={{ color: '#1976d2' }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1 - File Upload */}
        {step === 1 && (
          <Box sx={{ marginTop: 2 }}>
            <Dropzone onDrop={handleFileUpload}>
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed #1976d2',
                    borderRadius: '10px',
                    padding: { xs: '20px', sm: '30px', md: '40px' },
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#1565c0',
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography sx={{ color: '#1976d2', fontSize: { xs: '14px', sm: '16px' } }}>
                    Drag & Drop files here, or click to select files
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
            <Box sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                onClick={() => setStep(2)}
                color="primary"
                sx={{
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 2 - Add Extraction Tags */}
        {step === 2 && (
          <Box sx={{ marginTop: 2, overflow: 'auto', maxHeight: '400px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
              Select or Add Extraction Tags
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
              (Double-click on a tag to remove it from the list.)
            </Typography>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              {extractionTags.map((tag, index) => (
                <Grid item key={index}>
                  <Chip
                    label={tag}
                    variant="outlined"
                    onDoubleClick={() => handleTagRemove(tag)}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                        color: '#fff',
                        cursor: 'pointer',
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <Typography variant="body1" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Suggested Tags:
            </Typography>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              {suggestedTags.map((tag, index) => (
                <Grid item key={index}>
                  <Chip
                    label={tag}
                    onClick={() => handleTagClick(tag)}
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#90caf9',
                        color: '#fff',
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <TextField
              label="Add Custom Tag"
              variant="outlined"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={addExtractionTag}
              sx={{
                marginTop: 2,
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Add Tag
            </Button>
            {error && (
              <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                color="primary"
                sx={{
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 3 - Review & Download */}
        {step === 3 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Extracted Data
            </Typography>
            {reviewData.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    {extractionTags.map((tag, i) => (
                      <TableCell key={i} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                        {tag}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData.map((row, index) => (
                    <TableRow key={index}>
                      {extractionTags.map((tag, i) => (
                        <TableCell key={i}>{row[tag] || 'NA'}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography>No data available for review</Typography>
            )}
            <Box sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                onClick={handleDownloadCSV}
                color="primary"
                sx={{
                  marginRight: 2,
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                Download CSV
              </Button>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  marginLeft: 2,
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                Back
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{
                  marginLeft: 2,
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
