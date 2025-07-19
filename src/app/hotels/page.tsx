'use client';

import React from 'react';
import { Typography, Box, Link } from '@mui/material';
import PageFade from '../components/PageFade';

const HotelsPage = () => {
  const hotels = [
    {
      name: "De Vere Wokefield Estate",
      address: "Goodboys Lane, Reading, Berkshire RG7 3AE",
      phone: "+44 118 932 4050",
      website: "https://www.devere.co.uk/wokefield-estate/"
    },
    {
      name: "The Elephant, Pangbourne (Special Rates)",
      address: "Church Road, Pangbourne, Reading, Berkshire RG8 7AR",
      phone: "+44 118 984 2244",
      website: "https://www.elephanthotel.co.uk"
    },
    {
      name: "Premier Inn, Grazeley Green",
      address: "Grazeley Green, Reading, Berkshire",
      phone: "+44 871 527 8926",
      website: "https://www.premierinn.com/gb/en/hotels/england/berkshire/reading/reading-south-grazeley-green.html"
    }
  ];

  return (
    <PageFade>
      <Box 
        sx={{ mt: 5, mb: 8 }}
        px={{ xs: 2, md: 16 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'secondary.main' }}>
          Where to Stay
        </Typography>

        {hotels.map((hotel, index) => (
          <Box key={index} sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {hotel.name}
            </Typography>
            <Typography paragraph>
              {hotel.address}
            </Typography>
            <Typography paragraph>
              {hotel.phone}
            </Typography>
            <Typography paragraph>
              <Link
                href={hotel.website}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'secondary.main',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Book a room
              </Link>
            </Typography>
          </Box>
        ))}
      </Box>
    </PageFade>
  );
};

export default HotelsPage; 