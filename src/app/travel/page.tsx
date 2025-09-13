'use client';

import React from 'react';
import { Typography, Box, Link } from '@mui/material';
import Map from '../components/Map';
import PageFade from '../components/PageFade';

const TravelPage = () => {
  return ( 
    <PageFade>
      <Box 
        sx={{ mt: 5, mb: 8 }}
        px={{ xs: 2, md: 16 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'secondary.main' }}>
          How to get there
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            By Car
          </Typography>
          <Typography paragraph>
            Ufton Court is easily accessible by car and has ample parking on site. You can click on the map below to get directions from your location.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            By Train
          </Typography>
          <Typography paragraph>
            The nearest train station is Mortimer, which is a 10 minute drive from the venue. We recommend booking a taxi in advance for the journey from the station to Ufton Court, as it would take an hour and a half to walk.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Taxis
          </Typography>
          <Typography paragraph>
            Ufton Court has a list of reliable local taxi services that are familiar with the venue. You can view their recommended taxi providers{' '}
            <Link 
              href="https://www.uftonweddings.co.uk/_files/ugd/78a38d_05dc076815cf459c87a63445db8cc8b3.pdf"
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
              here
            </Link>
            .
          </Typography>
        </Box>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Venue Address
          </Typography>
          <Typography>
            Ufton Court
          </Typography>
          <Typography>
            Green Lane
          </Typography>
          <Typography>
            Berkshire
          </Typography>
          <Typography gutterBottom>
              RG7 4HD
          </Typography>
        </Box>
        <Map />
      </Box>
    </PageFade>
  );
}

export default TravelPage;