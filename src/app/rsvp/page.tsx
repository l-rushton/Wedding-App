'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Typography, 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Alert,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import PageFade from '../components/PageFade';

interface Guest {
  id: string;
  name: string;
  rsvp?: boolean;
  dietaryReqs?: string;
  addressId?: string;
  menuChoices?: {
    appetiser?: string;
    main?: string;
    dessert?: string;
  };
}

interface Address {
  id: string;
  address: string;
  guests: Guest[];
}

interface GuestData {
  type: 'guest' | 'address';
  guest?: Guest;
  address?: Address;
  guests?: Guest[];
}

interface PersonRSVP {
  guestId?: string;
  name: string;
  attending: string;
  appetiser: string;
  main: string;
  dessert: string;
  dietaryReqs: string;
}

const RSVPPageContent = () => {
  const searchParams = useSearchParams();
  const inviteId = searchParams.get('id');
  
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [peopleRSVP, setPeopleRSVP] = useState<PersonRSVP[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDirectAccess, setIsDirectAccess] = useState(false);

  // Set page title for mobile compatibility
  useEffect(() => {
    // Set title immediately
    document.title = 'RSVP';
    
    // Try multiple times with different delays for mobile browsers
    const timers = [
      setTimeout(() => document.title = 'RSVP', 100),
      setTimeout(() => document.title = 'RSVP', 500),
      setTimeout(() => document.title = 'RSVP', 1000),
      setTimeout(() => document.title = 'RSVP', 2000)
    ];
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Menu options with dietary information
  const menuOptions = {
    appetisers: [
      { value: 'mushrooms', label: 'Salt & pepper wild mushrooms with garlic, fresh lime leaf, sweet chilli sauce', dietary: 'Vegan, Gluten-free' },
      { value: 'fishcakes', label: 'Thai cod fishcakes, zingy herb salad, lime, lemongrass dressing', dietary: 'Gluten-free' }
    ],
    mains: [
      { value: 'green', label: 'Chicken Thai green curry', dietary: 'Gluten-free' },
      { value: 'massaman', label: 'Sweet potato Massaman curry', dietary: 'Vegan, Contains nuts, Gluten-free' }
    ],
    desserts: [
      { value: 'lemonTart', label: 'Lemon tart with lemon meringue ice cream', dietary: 'Vegetarian' },
      { value: 'chocolateMousse', label: 'Dark chocolate & avocado mousse', dietary: 'Vegan, Gluten-free' }
    ]
  };

  // Fetch guest data based on invite ID or handle direct access
  useEffect(() => {
    const fetchGuestData = async () => {
      if (!inviteId) {
        // Direct access - show name input form
        setIsDirectAccess(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/guests/${inviteId}`);
        
        if (!response.ok) {
          throw new Error('Invitation not found');
        }
        
        const data: GuestData = await response.json();
        setGuestData(data);
        
        // Initialize RSVP data for each person
        const initialRSVP: PersonRSVP[] = [];
        
        if (data.type === 'guest' && data.guest) {
          initialRSVP.push({
            guestId: data.guest.id,
            name: data.guest.name,
            attending: '',
            appetiser: '',
            main: '',
            dessert: '',
            dietaryReqs: ''
          });
        } else if (data.type === 'address' && data.guests) {
          data.guests.forEach(guest => {
            initialRSVP.push({
              guestId: guest.id,
              name: guest.name,
              attending: '',
              appetiser: '',
              main: '',
              dessert: '',
              dietaryReqs: ''
            });
          });
        }
        
        setPeopleRSVP(initialRSVP);
        setLoading(false);
      } catch {
        setError('Unable to load invitation details. Please contact us directly.');
        setLoading(false);
      }
    };

    fetchGuestData();
  }, [inviteId]);

  const handleNameChange = (index: number, value: string) => {
    const updatedRSVP = [...peopleRSVP];
    updatedRSVP[index].name = value;
    setPeopleRSVP(updatedRSVP);
  };

  const handleAddPerson = () => {
    setPeopleRSVP([...peopleRSVP, {
      name: '',
      attending: '',
      appetiser: '',
      main: '',
      dessert: '',
      dietaryReqs: ''
    }]);
  };

  const handleRemovePerson = (index: number) => {
    if (peopleRSVP.length > 1) {
      const updatedRSVP = peopleRSVP.filter((_, i) => i !== index);
      setPeopleRSVP(updatedRSVP);
    }
  };

  const handleAttendanceChange = (index: number, value: string) => {
    const updatedRSVP = [...peopleRSVP];
    updatedRSVP[index].attending = value;
    setPeopleRSVP(updatedRSVP);
  };

  const handleMenuChange = (index: number, course: 'appetiser' | 'main' | 'dessert', value: string) => {
    const updatedRSVP = [...peopleRSVP];
    updatedRSVP[index][course] = value;
    setPeopleRSVP(updatedRSVP);
  };

  const handleDietaryChange = (index: number, value: string) => {
    const updatedRSVP = [...peopleRSVP];
    updatedRSVP[index].dietaryReqs = value;
    setPeopleRSVP(updatedRSVP);
  };

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    return peopleRSVP.every(person => {
      // Check if name is filled (required for direct access)
      if (isDirectAccess && !person.name.trim()) {
        return false;
      }
      
      // Check if attendance is selected
      if (!person.attending) {
        return false;
      }
      
      // If attending, check if all menu choices are selected
      if (person.attending === 'yes') {
        return person.appetiser && person.main && person.dessert;
      }
      
      // If not attending, only attendance selection is required
      return true;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteId,
          peopleRSVP,
          guestData,
          isDirectAccess
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit RSVP');
      }
      
      setSubmitted(true);
    } catch {
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize direct access form
  useEffect(() => {
    if (isDirectAccess && peopleRSVP.length === 0) {
      setPeopleRSVP([{
        name: '',
        attending: '',
        appetiser: '',
        main: '',
        dessert: '',
        dietaryReqs: ''
      }]);
    }
  }, [isDirectAccess, peopleRSVP.length]);

  // Loading state
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
          <Typography>Loading your invitation...</Typography>
        </Box>
      </PageFade>
    );
  }

  // Error state
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
              Oops! Something went wrong
            </Typography>
            <Typography>
              {error}
            </Typography>
          </Alert>
        </Box>
      </PageFade>
    );
  }

  // Success state
  if (submitted) {
    return (
      <PageFade>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          py: 8
        }}>
          <Alert severity="success" sx={{ mb: 4, maxWidth: '600px' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Thank you for your RSVP!
            </Typography>
            <Typography>
              We've received your response and can't wait to celebrate with you on our special day.
            </Typography>
          </Alert>
        </Box>
      </PageFade>
    );
  }

  return (
    <PageFade>
      <Box 
        sx={{ mt: 5, mb: 8 }}
        px={{ xs: 2, md: 16 }}
      >
        <Typography variant="h4" component="h2" gutterBottom sx={{ 
          color: 'secondary.main',
          mb: 4
        }}>
          Let us know if you can make it.
        </Typography>

        <Paper elevation={1} sx={{ 
          p: 4,
          bgcolor: 'rgba(255, 255, 255, 0.8)'
        }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {peopleRSVP.map((person, index) => (
                <Box key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3 }}>
                  {isDirectAccess && (
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={person.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        required
                        variant="outlined"
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
                  )}
                  
                  <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold', mb: 3 }}>
                    {isDirectAccess ? person.name || 'Guest' : person.name}
                  </Typography>
                  
                  {/* Attendance */}
                  <FormControl component="fieldset" required sx={{ mb: 3 }}>
                    <FormLabel component="legend" sx={{ 
                      color: 'secondary.main', 
                      fontWeight: 'bold',
                      '&.Mui-focused': {
                        color: 'secondary.main',
                      },
                    }}>
                      Will you be attending?
                    </FormLabel>
                    <RadioGroup
                      name={`attending-${index}`}
                      value={person.attending}
                      onChange={(e) => handleAttendanceChange(index, e.target.value)}
                      row
                    >
                      <FormControlLabel 
                        value="yes" 
                        control={
                          <Radio 
                            sx={{
                              '&.Mui-checked': {
                                color: 'secondary.main',
                              },
                            }}
                          />
                        } 
                        label="Yes, I'll be there!" 
                      />
                      <FormControlLabel 
                        value="no" 
                        control={
                          <Radio 
                            sx={{
                              '&.Mui-checked': {
                                color: 'secondary.main',
                              },
                            }}
                          />
                        } 
                        label="Sorry, I can't make it" 
                      />
                    </RadioGroup>
                  </FormControl>

                  {/* Menu choices and dietary requirements - only show if attending */}
                  {person.attending === 'yes' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography variant="subtitle1" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                        Menu Choices
                      </Typography>
                      
                      <FormControl fullWidth>
                        <FormLabel sx={{ 
                          color: 'secondary.main',
                          '&.Mui-focused': {
                            color: 'secondary.main',
                          },
                        }}>
                          Starter
                        </FormLabel>
                        <Select
                          value={person.appetiser}
                          onChange={(e: SelectChangeEvent) => handleMenuChange(index, 'appetiser', e.target.value)}
                          required
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
                        >
                          {menuOptions.appetisers.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box>
                                <Typography variant="body1">{option.label}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.dietary}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <FormLabel sx={{ 
                          color: 'secondary.main',
                          '&.Mui-focused': {
                            color: 'secondary.main',
                          },
                        }}>
                          Main Course
                        </FormLabel>
                        <Select
                          value={person.main}
                          onChange={(e: SelectChangeEvent) => handleMenuChange(index, 'main', e.target.value)}
                          required
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
                        >
                          {menuOptions.mains.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box>
                                <Typography variant="body1">{option.label}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.dietary}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <FormLabel sx={{ 
                          color: 'secondary.main',
                          '&.Mui-focused': {
                            color: 'secondary.main',
                          },
                        }}>
                          Dessert
                        </FormLabel>
                        <Select
                          value={person.dessert}
                          onChange={(e: SelectChangeEvent) => handleMenuChange(index, 'dessert', e.target.value)}
                          required
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
                        >
                          {menuOptions.desserts.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box>
                                <Typography variant="body1">{option.label}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.dietary}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Additional Dietary Requirements or Allergies"
                        name={`dietary-${index}`}
                        value={person.dietaryReqs}
                        onChange={(e) => handleDietaryChange(index, e.target.value)}
                        multiline
                        rows={2}
                        variant="outlined"
                        helperText="Please let us know about any additional dietary restrictions, allergies, or special requirements not covered above"
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
                  )}

                  {isDirectAccess && peopleRSVP.length > 1 && (
                    <Button
                      type="button"
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemovePerson(index)}
                      sx={{ mt: 2 }}
                    >
                      Remove Person
                    </Button>
                  )}
                </Box>
              ))}

              {isDirectAccess && (
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleAddPerson}
                  sx={{ 
                    alignSelf: 'flex-start',
                    color: 'secondary.main',
                    borderColor: 'secondary.main'
                  }}
                >
                  Add Another Person
                </Button>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid() || submitting}
                sx={{
                  mt: 2,
                  py: 1.5,
                  color: "primary.main",
                  bgcolor: 'secondary.main',
                  '&:hover': {
                    bgcolor: 'secondary.dark'
                  },
                  fontStyle: 'bold'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </PageFade>
  );
};

const RSVPPage = () => {
  return (
    <Suspense fallback={<PageFade><Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      py: 8
    }}><CircularProgress sx={{ mb: 2, color: 'secondary.main' }} /><Typography>Loading your invitation...</Typography></Box></PageFade>}>
      <RSVPPageContent />
    </Suspense>
  );
};

export default RSVPPage; 