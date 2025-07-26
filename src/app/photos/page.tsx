'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardActionArea,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

const PhotosPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Array of image data
  const images = [
    { src: '/images/throughTheYears/1.png', alt: 'Through the years - 1' },
    { src: '/images/throughTheYears/2.png', alt: 'Through the years - 2' },
    { src: '/images/throughTheYears/3.png', alt: 'Through the years - 3' },
    { src: '/images/throughTheYears/4.png', alt: 'Through the years - 4' },
    { src: '/images/throughTheYears/5.png', alt: 'Through the years - 5' },
    { src: '/images/throughTheYears/6.png', alt: 'Through the years - 6' },
    { src: '/images/throughTheYears/7.png', alt: 'Through the years - 7' },
    { src: '/images/throughTheYears/8.png', alt: 'Through the years - 8' },
    { src: '/images/throughTheYears/9.png', alt: 'Through the years - 9' },
    { src: '/images/throughTheYears/10.png', alt: 'Through the years - 10' },
    { src: '/images/throughTheYears/11.png', alt: 'Through the years - 11' },
    { src: '/images/throughTheYears/12.png', alt: 'Through the years - 12' }
  ];

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'primary.main',
      color: 'secondary.main',
      py: 4,
      px: { xs: 2, md: 4 }
    }}>
      <Box sx={{ 
        maxWidth: '1200px', 
        mx: 'auto',
        textAlign: 'center',
        mb: 6
      }}>
        <Typography 
          variant="h2" 
          sx={{ 
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontStyle: 'italic',
            color: 'secondary.main'
          }}
        >
          Through the Years
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 4,
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'text.secondary',
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
            11 years of love and memories
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {images.map((image, index) => (
            <Box key={index}>
              <Card 
                sx={{ 
                  bgcolor: 'transparent',
                  border: '1px solid',
                  borderColor: 'secondary.main',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    borderColor: 'primary.light'
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleImageClick(index)}
                  sx={{ 
                    position: 'relative',
                    aspectRatio: '1',
                    '&:hover': {
                      '& .MuiCardMedia-root': {
                        transform: 'scale(1.05)'
                      }
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    image={image.src}
                    alt={image.alt}
                    sx={{
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.3)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        opacity: 1
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      Click to view
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Full-screen dialog for enlarged image */}
      <Dialog
        open={selectedImage !== null}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.9)',
            borderRadius: 2,
            maxWidth: '90vw',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)'
              },
              zIndex: 1
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage !== null && (
            <Box sx={{ 
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                fill
                style={{ 
                  objectFit: 'contain',
                  padding: '20px'
                }}
                priority
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PhotosPage; 