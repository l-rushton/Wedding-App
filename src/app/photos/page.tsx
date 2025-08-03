'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Dialog,
  IconButton,
  CircularProgress,
  Skeleton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

const PhotosPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

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

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  const handleAllImagesLoaded = () => {
    setIsLoading(false);
  };

  // Check if all images are loaded
  useEffect(() => {
    if (loadedImages.size === images.length) {
      handleAllImagesLoaded();
    }
  }, [loadedImages, images.length]);

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
        {isLoading && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            py: 8,
            gap: 2
          }}>
            <CircularProgress size={60} sx={{ color: 'secondary.main' }} />
            <Typography variant="h6" sx={{ color: 'secondary.main' }}>
              Loading memories...
            </Typography>
          </Box>
        )}
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, 
          gap: { xs: 1, sm: 2, md: 3 },
          px: { xs: 1, sm: 2 },
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}>
          {images.map((image, index) => (
            <Box key={index}>
              <Card 
                sx={{ 
                  bgcolor: 'transparent',
                  border: '1px solid',
                  borderColor: 'secondary.main',
                  borderRadius: { xs: 1, sm: 2 },
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    borderColor: 'primary.light'
                  },
                  '&:active': {
                    transform: 'scale(0.98)'
                  }
                }}
                onClick={() => handleImageClick(index)}
              >
                <Box sx={{ 
                  position: 'relative',
                  aspectRatio: '1',
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  {/* Loading skeleton */}
                  {!loadedImages.has(index) && (
                    <Skeleton 
                      variant="rectangular" 
                      width="100%" 
                      height="100%"
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    />
                  )}
                  
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                      opacity: loadedImages.has(index) ? 1 : 0
                    }}
                    priority={index < 6}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageLoad(index)} // Handle errors gracefully
                  />
                  
                  {loadedImages.has(index) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.2)',
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
                        variant="body2" 
                        sx={{ 
                          color: 'white',
                          fontWeight: 'bold',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        Tap to view
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Full-screen dialog for enlarged image */}
      <Dialog
        open={selectedImage !== null}
        onClose={handleCloseDialog}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.95)',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box sx={{ 
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1, sm: 2 }
        }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 16 },
              top: { xs: 8, sm: 16 },
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)'
              },
              zIndex: 1,
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 }
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage !== null && (
            <Box sx={{ 
              position: 'relative',
              width: '100%',
              height: '100%',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}>
              <Image
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                fill
                style={{ 
                  objectFit: 'contain'
                }}
                priority
              />
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default PhotosPage; 