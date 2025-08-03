'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Snackbar,
  Tabs,
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import PageFade from '../components/PageFade';

interface Guest {
  id: string;
  name: string;
  rsvp: boolean | null;
  dietaryReqs: string | null;
  addressId: string | null;
  address: {
    id: string;
    address: string;
  } | null;
  menuChoices?: {
    id: string;
    appetiser: string | null;
    main: string | null;
    dessert: string | null;
  } | null;
}

interface RegistryPurchase {
  id: string;
  itemName: string;
  itemUrl: string;
  itemImageUrl: string;
  purchaserName: string;
  purchaserMessage?: string;
  purchasedAt: string;
}

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

const AdminPage = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [registryPurchases, setRegistryPurchases] = useState<RegistryPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState('all'); // all, attending, not-attending
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBulkImportDialog, setShowBulkImportDialog] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState({ name: '', address: '' });
  const [bulkImportData, setBulkImportData] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [activeTab, setActiveTab] = useState(0);
  const [registryItems, setRegistryItems] = useState<RegistryItem[]>([]);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({ itemName: '', itemUrl: '', itemImageUrl: '' });



  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
        setError(null);
        fetchGuests();
        fetchRegistryPurchases();
      } else {
        setError('Incorrect password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/admin/guests');
      if (!response.ok) {
        throw new Error('Failed to fetch guests');
      }
      const data = await response.json();
      setGuests(data);
      setLoading(false);
    } catch {
      setError('Failed to load guest data');
      setLoading(false);
    }
  };

  const fetchRegistryPurchases = async () => {
    try {
      const response = await fetch('/api/registry');
      if (response.ok) {
        const data = await response.json();
        setRegistryPurchases(data);
      }
    } catch {
      console.error('Failed to fetch registry purchases');
    }
  };

  const fetchRegistryItems = async () => {
    try {
      const response = await fetch('/api/registry/items?all=1');
      if (response.ok) {
        const data = await response.json();
        setRegistryItems(data);
      }
    } catch {
      console.error('Failed to fetch registry items');
    }
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value);
  };

  const filteredGuests = guests.filter(guest => {
    if (filter === 'attending') return guest.rsvp === true;
    if (filter === 'not-attending') return guest.rsvp === false;
    return true; // 'all'
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Address', 'Attending', 'Starter', 'Main', 'Dessert', 'Dietary Requirements'];
    const csvData = filteredGuests.map(guest => [
      guest.name,
      guest.address?.address || '',
      guest.rsvp ? 'Yes' : 'No',
      guest.menuChoices?.appetiser || '',
      guest.menuChoices?.main || '',
      guest.menuChoices?.dessert || '',
      guest.dietaryReqs || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-rsvp-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddGuest = async () => {
    try {
      const response = await fetch('/api/admin/guests/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuest)
      });

      if (!response.ok) {
        throw new Error('Failed to add guest');
      }

      await fetchGuests();
      setShowAddDialog(false);
      setNewGuest({ name: '', address: '' });
      setSnackbar({ open: true, message: 'Guest added successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to add guest', severity: 'error' });
    }
  };

  const handleEditGuest = async () => {
    if (!editingGuest) return;

    try {
      const response = await fetch(`/api/admin/guests/${editingGuest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingGuest.name,
          address: editingGuest.address?.address || ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update guest');
      }

      await fetchGuests();
      setShowEditDialog(false);
      setEditingGuest(null);
      setSnackbar({ open: true, message: 'Guest updated successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update guest', severity: 'error' });
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      const response = await fetch(`/api/admin/guests/${guestId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete guest');
      }

      await fetchGuests();
      setSnackbar({ open: true, message: 'Guest deleted successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete guest', severity: 'error' });
    }
  };

  const handleBulkImport = async () => {
    try {
      // Parse CSV data
      const lines = bulkImportData.trim().split('\n');
      
      // If no header row is provided, assume first row is data and use default headers
      let headers: string[];
      let dataLines: string[];
      
      if (lines.length === 0) {
        throw new Error('No data provided');
      }
      
      // Check if first line looks like headers (contains 'name' or 'address')
      const firstLine = lines[0].toLowerCase();
      if (firstLine.includes('name') || firstLine.includes('address')) {
        headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        dataLines = lines.slice(1);
      } else {
        // No headers provided, use default headers
        headers = ['name', 'address'];
        dataLines = lines;
      }
      
      console.log('Headers:', headers);
      console.log('Data lines:', dataLines);
      
      const guestData = dataLines.map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const guest: Record<string, string> = {};
        headers.forEach((header, index) => {
          guest[header.toLowerCase()] = values[index] || '';
        });
        return guest;
      });

      console.log('Parsed guest data:', guestData);

      const response = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests: guestData })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Import failed:', errorText);
        throw new Error(`Failed to import guests: ${errorText}`);
      }

      const result = await response.json();
      console.log('Import result:', result);
      await fetchGuests();
      setShowBulkImportDialog(false);
      setBulkImportData('');
      setSnackbar({ 
        open: true, 
        message: `Bulk import completed: ${result.results.created} created, ${result.results.updated} updated. Check console for QR code URLs.`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Import error:', error);
      setSnackbar({ open: true, message: `Failed to import guests: ${error}`, severity: 'error' });
    }
  };

  const handleDeleteRegistryPurchase = async (purchaseId: string) => {
    if (!confirm('Are you sure you want to remove this purchase record?')) return;

    try {
      const response = await fetch(`/api/registry/${purchaseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete purchase');
      }

      await fetchRegistryPurchases();
      setSnackbar({ open: true, message: 'Purchase record removed successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to remove purchase record', severity: 'error' });
    }
  };

  const handleAddRegistryItem = async () => {
    try {
      const response = await fetch('/api/registry/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (!response.ok) throw new Error('Failed to add item');
      await fetchRegistryItems();
      setShowAddItemDialog(false);
      setNewItem({ itemName: '', itemUrl: '', itemImageUrl: '' });
      setSnackbar({ open: true, message: 'Item added successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to add item', severity: 'error' });
    }
  };

  const handleDeleteRegistryItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`/api/registry/items/${itemId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete item');
      await fetchRegistryItems();
      setSnackbar({ open: true, message: 'Item deleted successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete item', severity: 'error' });
    }
  };

  const handleToggleRegistryItemStatus = async (item: RegistryItem) => {
    try {
      const response = await fetch(`/api/registry/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: item.status === 'available' ? 'purchased' : 'available',
          purchaserName: item.status === 'available' ? 'Admin' : null,
          purchaserMessage: null,
          purchasedAt: item.status === 'available' ? new Date().toISOString() : null
        })
      });
      if (!response.ok) throw new Error('Failed to update item');
      await fetchRegistryItems();
      setSnackbar({ open: true, message: 'Item status updated', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update item', severity: 'error' });
    }
  };

  const getAttendanceStats = () => {
    const total = guests.length;
    const attending = guests.filter(g => g.rsvp === true).length;
    const notAttending = guests.filter(g => g.rsvp === false).length;
    const pending = guests.filter(g => g.rsvp === null).length;
    return { total, attending, notAttending, pending };
  };

  const getRSVPUrl = (guest: Guest) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    // If guest has an address, use address ID for group RSVP
    if (guest.addressId) {
      return `${baseUrl}/rsvp?id=${guest.addressId}`;
    }
    // Otherwise use individual guest ID
    return `${baseUrl}/rsvp?id=${guest.id}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ 
        open: true, 
        message: 'RSVP URL copied to clipboard!', 
        severity: 'success' 
      });
    }).catch(() => {
      setSnackbar({ 
        open: true, 
        message: 'Failed to copy URL', 
        severity: 'error' 
      });
    });
  };

  const stats = getAttendanceStats();

  useEffect(() => {
    if (isAuthenticated) {
      fetchGuests();
      fetchRegistryPurchases();
      fetchRegistryItems();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <PageFade>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 3
        }}>
          <Typography variant="h4" sx={{ color: 'secondary.main' }}>
            Admin Access
          </Typography>
          <Paper sx={{ p: 4, maxWidth: '400px', width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                fullWidth
              />
              <Button 
                variant="contained" 
                onClick={handleLogin}
                sx={{ bgcolor: 'secondary.main' }}
              >
                Login
              </Button>
              {error && (
                <Alert severity="error">{error}</Alert>
              )}
            </Box>
          </Paper>
        </Box>
      </PageFade>
    );
  }

  if (loading) {
    return (
      <PageFade>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          py: 8
        }}>
          <CircularProgress sx={{ mb: 2, color: 'secondary.main' }} />
          <Typography>Loading guest data...</Typography>
        </Box>
      </PageFade>
    );
  }

  if (error) {
    return (
      <PageFade>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          py: 8
        }}>
          <Alert severity="error" sx={{ mb: 4, maxWidth: '600px' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Error Loading Data
            </Typography>
            <Typography>{error}</Typography>
          </Alert>
        </Box>
      </PageFade>
    );
  }

  return (
    <PageFade>
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" 
          sx={{ 
            mb: 2,
            pb: 1,
            color: 'secondary.main',
            fontStyle: 'italic'
          }}>
          Wedding RSVP Admin
        </Typography>

        {/* Stats */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 4, 
          mb: 4,
          flexWrap: 'wrap'
        }}>
          <Paper sx={{ p: 2, textAlign: 'center', minWidth: '120px' }}>
            <Typography variant="h6" color="primary">{stats.total}</Typography>
            <Typography variant="body2">Total Guests</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', minWidth: '120px' }}>
            <Typography variant="h6" color="success.main">{stats.attending}</Typography>
            <Typography variant="body2">Attending</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', minWidth: '120px' }}>
            <Typography variant="h6" color="error.main">{stats.notAttending}</Typography>
            <Typography variant="body2">Not Attending</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', minWidth: '120px' }}>
            <Typography variant="h6" color="warning.main">{stats.pending}</Typography>
            <Typography variant="body2">Pending</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', minWidth: '120px' }}>
            <Typography variant="h6" color="info.main">{registryPurchases.length}</Typography>
            <Typography variant="body2">Registry Purchases</Typography>
          </Paper>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Guest Management" />
            <Tab label="Registry Purchases" />
            <Tab label="Registry Items" />
          </Tabs>
        </Box>

        {/* Guest Management Tab */}
        {activeTab === 0 && (
          <>
            {/* Controls */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={filter}
                    label="Filter"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">All Guests</MenuItem>
                    <MenuItem value="attending">Attending</MenuItem>
                    <MenuItem value="not-attending">Not Attending</MenuItem>
                  </Select>
                </FormControl>

                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddDialog(true)}
                  sx={{ 
                    bgcolor: 'secondary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'secondary.dark'
                    }
                  }}
                >
                  Add Guest
                </Button>

                <Button 
                  variant="contained" 
                  startIcon={<UploadIcon />}
                  onClick={() => setShowBulkImportDialog(true)}
                  sx={{ 
                    bgcolor: 'secondary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'secondary.dark'
                    }
                  }}
                >
                  Bulk Import
                </Button>
              </Box>

              <Button 
                variant="contained" 
                onClick={exportToCSV}
                sx={{ bgcolor: 'secondary.main' }}
              >
                Export to CSV
              </Button>
            </Box>

            {/* Guest Table */}
            <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Attending</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Starter</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Main</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Dessert</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Dietary Requirements</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>RSVP URL</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell>{guest.name}</TableCell>
                      <TableCell>{guest.address?.address || '-'}</TableCell>
                      <TableCell>
                        {guest.rsvp === null ? (
                          <Typography color="warning.main">Pending</Typography>
                        ) : guest.rsvp ? (
                          <Typography color="success.main">Yes</Typography>
                        ) : (
                          <Typography color="error.main">No</Typography>
                        )}
                      </TableCell>
                      <TableCell>{guest.menuChoices?.appetiser || '-'}</TableCell>
                      <TableCell>{guest.menuChoices?.main || '-'}</TableCell>
                      <TableCell>{guest.menuChoices?.dessert || '-'}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        {guest.dietaryReqs || '-'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              wordBreak: 'break-all',
                              maxWidth: '200px'
                            }}
                          >
                            {getRSVPUrl(guest)}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => copyToClipboard(getRSVPUrl(guest))}
                            sx={{ 
                              fontSize: '0.7rem',
                              py: 0.5,
                              px: 1
                            }}
                          >
                            Copy URL
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit Guest">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                setEditingGuest(guest);
                                setShowEditDialog(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Guest">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteGuest(guest.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Registry Purchases Tab */}
        {activeTab === 1 && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Registry Purchases ({registryPurchases.length})
            </Typography>
            
            <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Purchaser</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Purchased Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registryPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            component="img"
                            src={purchase.itemImageUrl}
                            alt={purchase.itemName}
                            sx={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0'
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {purchase.itemName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {purchase.purchaserName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        {purchase.purchaserMessage || '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(purchase.purchasedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Remove Purchase Record">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteRegistryPurchase(purchase.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Registry Items Tab */}
        {activeTab === 2 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Registry Items ({registryItems.length})</Typography>
              <Button variant="contained" onClick={() => setShowAddItemDialog(true)} sx={{ bgcolor: 'secondary.main' }}>
                Add Item
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            component="img"
                            src={item.itemImageUrl}
                            alt={item.itemName}
                            sx={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 1, border: '1px solid #e0e0e0' }}
                          />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.itemName}</Typography>
                            <Typography variant="caption" color="text.secondary">{item.itemUrl}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={item.status === 'available' ? 'success.main' : 'error.main'}>
                          {item.status === 'available' ? 'Available' : 'Purchased'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined" onClick={() => handleToggleRegistryItemStatus(item)}>
                          {item.status === 'available' ? 'Mark Purchased' : 'Mark Available'}
                        </Button>
                        <Button size="small" color="error" variant="outlined" sx={{ ml: 1 }} onClick={() => handleDeleteRegistryItem(item.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Add Item Dialog */}
            <Dialog open={showAddItemDialog} onClose={() => setShowAddItemDialog(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Add Registry Item</DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                  <TextField
                    label="Item Name"
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Item URL"
                    value={newItem.itemUrl}
                    onChange={(e) => setNewItem({ ...newItem, itemUrl: e.target.value })}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Image URL"
                    value={newItem.itemImageUrl}
                    onChange={(e) => setNewItem({ ...newItem, itemImageUrl: e.target.value })}
                    fullWidth
                    required
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowAddItemDialog(false)}>Cancel</Button>
                <Button onClick={handleAddRegistryItem} variant="contained" disabled={!newItem.itemName.trim() || !newItem.itemUrl.trim() || !newItem.itemImageUrl.trim()}>
                  Add Item
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Add Guest Dialog */}
        <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Guest</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Full Name"
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Address (optional)"
                value={newGuest.address}
                onChange={(e) => setNewGuest({ ...newGuest, address: e.target.value })}
                fullWidth
                helperText="Leave empty if guest has no address"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleAddGuest} 
              variant="contained"
              disabled={!newGuest.name.trim()}
            >
              Add Guest
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Guest Dialog */}
        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Guest</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Full Name"
                value={editingGuest?.name || ''}
                onChange={(e) => setEditingGuest(editingGuest ? { ...editingGuest, name: e.target.value } : null)}
                fullWidth
                required
              />
              <TextField
                label="Address"
                value={editingGuest?.address?.address || ''}
                onChange={(e) => setEditingGuest(editingGuest ? { 
                  ...editingGuest, 
                  address: editingGuest.address ? { 
                    ...editingGuest.address, 
                    address: e.target.value 
                  } : { 
                    id: '', 
                    address: e.target.value 
                  }
                } : null)}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleEditGuest} 
              variant="contained"
              disabled={!editingGuest?.name?.trim()}
            >
              Update Guest
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Import Dialog */}
        <Dialog open={showBulkImportDialog} onClose={() => setShowBulkImportDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Bulk Import Guests</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Paste CSV data with columns: name, address (optional)
              </Typography>
              <TextField
                label="CSV Data"
                value={bulkImportData}
                onChange={(e) => setBulkImportData(e.target.value)}
                multiline
                rows={10}
                fullWidth
                placeholder="name,address&#10;John Doe,123 Main St&#10;Jane Smith,456 Oak Ave"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowBulkImportDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleBulkImport} 
              variant="contained"
              disabled={!bulkImportData.trim()}
            >
              Import Guests
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageFade>
  );
};

export default AdminPage; 