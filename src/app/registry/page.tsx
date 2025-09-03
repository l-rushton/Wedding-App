'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container,
  Link,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia
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

  // Fetch all registry items from database
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
    const item = items[index];
    if (item.status === 'purchased') {
      return; // Don't open dialog for already purchased items
    }
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
      
      // Update the item status in the local state instead of removing it
      const updatedItems = [...items];
      updatedItems[selectedItemIndex] = {
        ...updatedItems[selectedItemIndex],
        status: 'purchased',
        purchaserName,
        purchaserMessage,
        purchasedAt: new Date().toISOString()
      };
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

          {/* Registry Items Grid */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3
            }}>
              {items.map((item, index) => (
                <Card 
                  key={item.id}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: item.status === 'purchased' ? 0.6 : 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: item.status === 'purchased' ? 'none' : 'translateY(-2px)',
                      boxShadow: item.status === 'purchased' ? 1 : 3
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.itemImageUrl}
                    alt={item.itemName}
                    sx={{
                      objectFit: 'cover'
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'secondary.main',
                          flex: 1,
                          mr: 1
                        }}
                      >
                        {item.itemName}
                      </Typography>
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
                    </Box>
                    
                    <Link
                      href={item.itemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'secondary.main',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: 'secondary.dark'
                        },
                        mt: 'auto'
                      }}
                    >
                      View Item →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

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