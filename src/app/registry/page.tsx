'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import PageFade from '../components/PageFade';

interface RegistryItem {
  id: string;
  itemName: string;
  itemUrl: string;
  itemImageUrl: string;
  status: string;
  purchaserName?: string;
  purchaserMessage?: string;
  purchasedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const RegistryPage = () => {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserMessage, setPurchaserMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available registry items from database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/registry/items');
        if (!response.ok) {
          throw new Error('Failed to fetch registry items');
        }
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch {
        setError('Failed to load registry data');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleCheckboxChange = (index: number) => {
    setSelectedItemIndex(index);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItemIndex(null);
    setPurchaserName('');
    setPurchaserMessage('');
    setError(null);
  };

  const handleDialogSubmit = async () => {
    if (selectedItemIndex === null) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const item = items[selectedItemIndex];
      const response = await fetch('/api/registry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: item.itemName,
          itemUrl: item.itemUrl,
          itemImageUrl: item.itemImageUrl,
          purchaserName,
          purchaserMessage
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark item as purchased');
      }
      
      // Remove the purchased item from the list
      const updatedItems = items.filter((_, i) => i !== selectedItemIndex);
      setItems(updatedItems);
      
      handleDialogClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark item as purchased');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageFade>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            py: 8
          }}>
            <CircularProgress sx={{ mb: 2, color: 'secondary.main' }} />
            <Typography>Loading registry...</Typography>
          </Box>
        </Container>
      </PageFade>
    );
  }

  return (
    <PageFade>
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            mt: 5, 
            mb: 8,
            px: { xs: 2, md: 4 }
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: 'secondary.main',
              mb: 4,
              textAlign: 'left'
            }}
          >
            Gifts
          </Typography>

          <Typography variant="body1" component="h5" gutterBottom align="left" 
            sx={{
              fontFamily: 'var(--font-cinzel)',
              color: 'black',
              fontSize: '1.25rem'
            }}>
            Your presence is our present.
            <br />
            <br />
            If you would still like to get us a gift, we've put together a list of things for all sorts of budgets, which you can see below.
            <br />
            If you have bought an item from the list, please check the box next to the item to say you've purchased it.
          </Typography>

          {/* Registry Table */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 4,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              mt: 4
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      color: 'secondary.main', 
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      Purchased
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'secondary.main', 
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      Item
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'secondary.main', 
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                        opacity: item.status === 'purchased' ? 0.6 : 1
                      }}
                    >
                      <TableCell sx={{ width: '100px' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.status === 'purchased'}
                              onChange={() => handleCheckboxChange(index)}
                              disabled={item.status === 'purchased'}
                              sx={{
                                color: 'secondary.main',
                                '&.Mui-checked': {
                                  color: 'secondary.main',
                                },
                              }}
                            />
                          }
                          label=""
                        />
                      </TableCell>
                      <TableCell sx={{ width: '120px' }}>
                        <Box
                          component="img"
                          src={item.itemImageUrl}
                          alt={item.itemName}
                          sx={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          href={item.itemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'secondary.main',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            '&:hover': {
                              textDecoration: 'underline',
                              color: 'secondary.dark'
                            }
                          }}
                        >
                          {item.itemName}
                        </Link>
                        {item.status === 'purchased' && item.purchaserName && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block',
                              color: 'text.secondary',
                              mt: 1
                            }}
                          >
                            Purchased by: {item.purchaserName}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Purchase Dialog */}
          <Dialog 
            open={dialogOpen} 
            onClose={handleDialogClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
              Thank you so much! Please enter your name and a message so this item can be taken off the list.
            </DialogTitle>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={purchaserName}
                  onChange={(e) => setPurchaserName(e.target.value)}
                  required
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'secondary.main',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'secondary.main',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Message (optional)"
                  value={purchaserMessage}
                  onChange={(e) => setPurchaserMessage(e.target.value)}
                  multiline
                  rows={3}
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'secondary.main',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'secondary.main',
                    },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={handleDialogClose}
                disabled={submitting}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDialogSubmit}
                variant="contained"
                disabled={!purchaserName.trim() || submitting}
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'secondary.dark'
                  }
                }}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </PageFade>
  );
};

export default RegistryPage; 