'use client';

import React from 'react';
import { Typography, Box, useTheme, List, ListItem } from '@mui/material';
import PageFade from '../components/PageFade';

const MenuPage = () => {
    const theme = useTheme();
    return (
        <PageFade>
            <Box sx={{ py: 4, px: 4, alignContent: 'left' }}>
                <Typography variant="body1" component="h5" gutterBottom align="center" 
                    sx={{
                        fontFamily: 'var(--font-cinzel)',
                        color: 'black',
                        fontSize: '1.25rem'
                    }}>
                    Please make your choices by scanning the QR code in your invitation
                </Typography>

                <Box sx={{ mb: 0 }}>
                    <Typography variant="h4" component="h2" gutterBottom align="center"
                        sx={{ 
                            mb: 4,
                            pt: 3,
                            fontFamily: 'var(--font-cinzel)',
                            color: theme.palette.secondary.main,
                            fontStyle: 'italic'
                        }}>
                        Wedding Breakfast
                    </Typography>

                    <Box sx={{ mb: 0 }}>
                    <Typography variant="h5" component="h5" gutterBottom align="center"
                        sx={{ 
                            mb: 1,
                            fontFamily: 'var(--font-cinzel)',
                            color: theme.palette.secondary.main 
                        }}>
                        Appetisers
                    </Typography>

                    <List sx={{
                        width: '100%',
                        maxWidth: 600,
                        mx: 'auto',
                        '& .MuiListItem-root': {
                            textAlign: 'center',
                            py: 1
                        }
                    }}>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%' }}>
                                Salt & pepper wild mushrooms with garlic, fresh lime leaf, sweet chilli sauce (ve) (gf)
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%' }}>
                                Thai cod fishcakes, zingy herb salad, lime, lemongrass dressing (gf)
                            </Typography>
                        </ListItem>
                    </List>
                    </Box>

                    <Typography variant="h5" component="h5" gutterBottom align="center"
                        sx={{ 
                            mb: 2,
                            fontFamily: 'var(--font-cinzel)',
                            color: theme.palette.secondary.main 
                        }}>
                        ~
                    </Typography>

                    <Box sx={{ mb: 0 }}>
                    <Typography variant="h5" component="h5" gutterBottom align="center"
                        sx={{ 
                            mb: 1,
                            fontFamily: 'var(--font-cinzel)',
                            color: theme.palette.secondary.main 
                        }}>
                        Main Course
                    </Typography>


                    <List sx={{
                        width: '100%',
                        maxWidth: 600,
                        mx: 'auto',
                        '& .MuiListItem-root': {
                            textAlign: 'center',
                            py: 1
                        }
                    }}>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%' }}>
                                Chicken Thai green curry (gf)
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%' }}>
                                Sweet potato Massaman curry (ve) (n) (gf)
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%', fontStyle: 'italic' }}>
                                Accompanied with coconut rice & crispy rice noodles
                            </Typography>
                        </ListItem>
                    </List>
                    </Box>
                    <Typography variant="h5" component="h5" gutterBottom align="center"
                        sx={{ 
                            mb: 2,
                            fontFamily: 'var(--font-cinzel)',
                            color: theme.palette.secondary.main 
                        }}>
                        ~
                    </Typography>
                    <Box sx={{ mb: 0 }}>
                    <Typography variant="h5" component="h5" gutterBottom align="center"
                        sx={{ 
                            mb: 1,
                            fontFamily: 'var(--font-cinzel)',
                            color: theme.palette.secondary.main 
                        }}>
                        Desserts
                    </Typography>

                    <List sx={{
                        width: '100%',
                        maxWidth: 600,
                        mx: 'auto',
                        '& .MuiListItem-root': {
                            textAlign: 'center',
                            py: 1
                        }
                    }}>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%' }}>
                                Lemon tart with lemon meringue ice cream
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%' }}>
                                Dark chocolate & avocado mousse (ve) (gf)
                            </Typography>
                        </ListItem>
                    </List>
                    </Box>
                </Box>

                <Typography variant="h5" component="h5" gutterBottom align="center"
                        sx={{ 
                            mb: 0,
                            pt: 2,
                            fontFamily: 'var(--font-cinzel)',
                            color: theme.palette.secondary.main 
                        }}>
                        ~
                    </Typography>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" component="h2" gutterBottom align="center"
                        sx={{ 
                            mb: 2,
                            pt: 3,
                            fontFamily: 'var(--font-cinzel)',
                            color: theme.palette.secondary.main,
                            fontStyle: 'italic'
                        }}>
                        Canapés
                    </Typography>

                    <List sx={{
                        width: '100%',
                        maxWidth: 600,
                        mx: 'auto',
                        '& .MuiListItem-root': {
                            textAlign: 'center',
                            py: 1
                        }
                    }}>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%' }}>
                                Tempura corn with plum dip (v)
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%' }}>
                                Coconut prawns
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%' }}>
                                Sticky Thai meatballs
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="body1" sx={{ width: '100%' }}>
                                Crispy vegetable spring rolls (ve)
                            </Typography>
                        </ListItem>
                    </List>
                </Box>
            </Box>
        </PageFade>
    );
}

export default MenuPage;