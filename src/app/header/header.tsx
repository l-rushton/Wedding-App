import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HeaderButton from './headerButton';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [useDropdown, setUseDropdown] = useState(false);
  const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Itinerary', path: '/itinerary' },
    { label: 'Registry', path: '/registry' },
    { label: 'Menu', path: '/menu' },
    { label: 'Travel Advice', path: '/travel' },
    { label: 'Hotels', path: '/hotels' },
    { label: 'FAQs', path: '/faqs' },
    { label: 'Photos', path: '/photos' },
    { label: 'RSVP', path: '/rsvp' }
  ];

  const getCurrentPageName = () => {
    if (pathname === '/') return 'Home';
    if (pathname.startsWith('/rsvp')) return 'RSVP';
    const currentItem = menuItems.find(item => item.path === pathname);
    return currentItem ? currentItem.label : '';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileOpen(false);
    setDropdownAnchor(null);
  };

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDropdownAnchor(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setDropdownAnchor(null);
  };

  // Check if buttons fit in container
  const checkButtonFit = useCallback(() => {
    if (isMobile || !containerRef.current || !buttonsRef.current) {
      setUseDropdown(false);
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;
    const buttonsWidth = buttonsRef.current.scrollWidth;
    
    // Add some padding for safety
    const availableWidth = containerWidth - 32; // 16px padding on each side
    
    setUseDropdown(buttonsWidth > availableWidth);
  }, [isMobile]);

  // Check fit on mount and window resize
  useEffect(() => {
    checkButtonFit();
    
    const handleResize = () => {
      checkButtonFit();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkButtonFit]);

  if (!mounted) {
    return (
      <Box 
        sx={{ 
          mb: 2,
          pt: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box sx={{ 
          position: 'relative',
          width: { xs: '150px', sm: '200px', md: '250px' },
          height: { xs: '80px', sm: '120px', md: '150px' }
        }}>
          <Image 
            src="/images/landi.png" 
            alt="Izzy & Louis" 
            fill={true} 
            style={{ objectFit: 'contain' }} 
          />
        </Box>
      </Box>
    );
  }

  return (
    <>
        <Box 
            sx={{ 
                mb: 2,
                pt: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Box sx={{ 
              position: 'relative',
              width: { xs: '150px', sm: '200px', md: '250px' },
              height: { xs: '80px', sm: '120px', md: '150px' }
            }}>
              <Image 
                src="/images/landi.png" 
                alt="Izzy & Louis" 
                fill={true} 
                style={{ objectFit: 'contain' }} 
              />
            </Box>
        </Box>

      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'primary.main',
          color: 'secondary.main',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'secondary.main'
        }}
      >
        <Toolbar sx={{ justifyContent: isMobile ? 'normal' : 'center' }}>
          {isMobile ? (
            <>
            <Typography
            variant='h5'>
                {getCurrentPageName()}
            </Typography>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ position: 'absolute', right: 16 }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                  '& .MuiDrawer-paper': { 
                    width: 120,
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              >
                <List
                sx={{
                    justifyContent: 'top'
                }}>
                  {menuItems.map((item) => (
                    <ListItem 
                      key={item.label} 
                      onClick={() => handleNavigation(item.path)}
                      sx={{ 
                        color: 'secondary.main',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                        borderBottom: '1px solid black'
                      }}
                    >
                      <ListItemText primary={item.label} sx={{ fontSize: 28 }} />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            <Box 
              ref={containerRef}
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                width: '100%',
                position: 'relative'
              }}
            >
              {useDropdown ? (
                <>
                  <Typography variant='h5' sx={{ flexGrow: 1, textAlign: 'center' }}>
                    {getCurrentPageName()}
                  </Typography>
                  <IconButton
                    color="inherit"
                    aria-label="open menu"
                    edge="end"
                    onClick={handleDropdownOpen}
                    sx={{ position: 'absolute', right: 16 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={dropdownAnchor}
                    open={Boolean(dropdownAnchor)}
                    onClose={handleDropdownClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    sx={{
                      '& .MuiPaper-root': {
                        backgroundColor: theme.palette.primary.main,
                        border: '1px solid',
                        borderColor: 'secondary.main',
                        minWidth: 150
                      }
                    }}
                  >
                    {menuItems.map((item) => (
                      <MenuItem 
                        key={item.label}
                        onClick={() => handleNavigation(item.path)}
                        sx={{ 
                          color: 'secondary.main',
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                          borderBottom: '1px solid',
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                          '&:last-child': {
                            borderBottom: 'none'
                          }
                        }}
                      >
                        <Typography variant='h6'>{item.label}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Box 
                  ref={buttonsRef}
                  sx={{ 
                    display: 'flex', 
                    gap: 8, 
                    justifyContent: 'center',
                    visibility: 'hidden',
                    position: 'absolute'
                  }}
                >
                  {menuItems.map((item) => (
                    <HeaderButton 
                      key={item.label}
                      label={item.label} 
                      path={item.path}
                      onClick={() => router.push(item.path)} 
                    />
                  ))}
                </Box>
              )}
              
              {/* Visible buttons when not using dropdown */}
              {!useDropdown && (
                <Box sx={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  {menuItems.map((item) => (
                    <HeaderButton 
                      key={item.label}
                      label={item.label} 
                      path={item.path}
                      onClick={() => router.push(item.path)} 
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;