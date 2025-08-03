import { Box, Typography, Link, Theme } from '@mui/material';

const SongSuggestionOverlay = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: { xs: '10px', md: '-250px' },
        top: '50%',
        transform: 'translateY(-50%)',
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: 2,
        zIndex: 1
      }}
    >
      <Typography
        sx={{
          color: 'secondary.main',
          fontSize: '1rem',
          maxWidth: '150px',
          textAlign: 'right'
        }}
      >
        Got a song recommendation?{' '}
        <Link
          href="/setlist"
          sx={{
            color: 'secondary.main',
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Click here
        </Link>
        {' '}to submit
      </Typography>
      <Box
        sx={{
          width: '80px',
          height: '50px',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: (theme: Theme) => 
              `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 50'%3E%3Cpath d='M 0,25 C 20,25 30,45 50,25 C 65,10 70,25 75,25' fill='none' stroke='%23${theme.palette.secondary.main.slice(1)}' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M 75,25 L 70,20 L 70,30 Z' fill='%23${theme.palette.secondary.main.slice(1)}'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }
        }}
      />
    </Box>
  );
};

export default SongSuggestionOverlay; 