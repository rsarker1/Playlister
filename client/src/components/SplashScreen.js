import { useContext, useState } from 'react';
import AuthContext from '../auth'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import image from "../Logo_Image/logo.png"; 

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    function handleGuest(event) {
        auth.loginGuest();
    }
    return (
        <Grid container component="main" 
            sx={{ 
                minWidth: '100%',
                height: '100%', 
                background: "linear-gradient(to bottom, #2193B0 0%, #6DD5ED 50%, #00FAC8 100%);", 
                justifyContent: "center" 
            }}
        >
            <Box
                sx={{
                    my: 18,
                    mx: 4,
                    flexDirection: 'column',
                    width: '25vw',
                    height: 'auto'
                }}
            >
                <Typography component="h1" variant="h3" align='center' fontFamily={'Satisfy'}>
                    Welcome to
                </Typography>
                <img src={image} alt="Playlister" id="splash-logo"/>
                <Typography component="h1" variant="h5" align='center' >
                    If you want to create, delete, and edit your music playlists 
                    and share your music taste with other users, this is the perfect app for you.  
                </Typography>
                <Button
                        type="submit"
                        variant="contained"
                        href="/login"
                        
                        sx={{ ml: 15, mt: 3, mb: 2, height: 'auto', minWidth: '28%', fontSize: '1.0rem', bgcolor: "#2179b0"}}
                    >
                    Login
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    href="/register"
                    sx={{ ml: 5, mt: 3, mb: 2, height: 'auto', minWidth: '20%', fontSize: '1.0rem', bgcolor: "#2179b0" }}
                >
                    Create account
                </Button>
                <Box>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={handleGuest}
                        sx={{ ml: 27, height: 'auto', minWidth: '20%', fontSize: '1.0rem', bgcolor: "#2179b0" }}
                    >
                        Continue as guest
                    </Button>
                </Box>
                <Typography component="h1" variant="subtitle1" align='center' sx={{ mt: 10 }}>
                    Created by Rahul Sarker, 2022
                </Typography>
            </Box>
        </Grid> 
    )
}