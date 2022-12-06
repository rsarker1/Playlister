import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'

import Add from '@mui/icons-material/Add';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import TextField from "@mui/material/TextField";
import Sort from '@mui/icons-material/Sort';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AuthContext from '../auth'

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [hasFocus, setFocus] = useState("home");
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        //store.closeCurrentList();  // REMOVE
        store.loadIdNamePairs(); // REMOVE MAYBE (MAKE WORK FOR GUEST)
    }, []);
    // No more verify call for guest, which is kinda a good thing?

    function handleMenuOpen(event) {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }
    function handleMenuClose() {
        setAnchorEl(null);
    }
    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    // if (store) {
    //     listCard = 
    //         <List>
    //         {
    //             store.idNamePairs.map((pair) => (
    //                 <ListCard
    //                     key={pair._id}
    //                     idNamePair={pair}
    //                     selected={false}
    //                 />
    //             ))
    //         }
    //         </List>;
    // }
    if (store) {
        if(store.currentList != null) {
            store.idNamePairs.forEach((pair) => { pair.selected = pair._id === store.currentList._id });
        }
                // if (pair._id === store.currentList._id) 
                //     pair.selected = true;
                // else 
                //     pair.selected = false;
        console.log('LOADING?');
        listCard = 
            <List>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={pair.selected}
                        published={pair.published}
                    />
                ))
            }
            </List>;
    }


    // THERE IS MORE TO THIS PART FOR SEARCHES AND GUEST
    let bottom = ""; 
    if(!auth.isGuest) {
        bottom = 
            <Box sx={{ ml: "48%", mt: "1%", fontSize: "2.8vmin", fontFamily: "", fontWeight: "bold", color: "white" }}>
                <IconButton 
                    sx={{ mr: "1%", color: 'white', backgroundColor: '#2179b0', "&:hover": { backgroundColor: '#0032fa' } }} 
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                >
                    <Add sx={{ fontSize: "2vmin" }} />
                </IconButton>
                Your Lists
            </Box>;
    }

    let modals = "";
    if (store.isEditSongModalOpen()) 
        modals = <MUIEditSongModal />;
    else if (store.isRemoveSongModalOpen()) 
        modals = <MUIRemoveSongModal />;

    return (
        <Box sx={{ 
                minWidth: '100%',
                height: "100%", 
                background: "linear-gradient(to bottom, #2193B0 0%, #6DD5ED 50%, #00FAC8 100%);",
        }}> 
            <IconButton onFocus={() => setFocus("home")} onBlur={() => setFocus("")} sx={{ 
                border: '2px solid transparent', 
                color: "white", 
                mt: "0.2%", 
                ml: "0.8%", 
                borderColor: hasFocus === "home" ? 'white': '', 
            }}>
                <HomeOutlined sx={{ fontSize: "3.5vmin"}} />
            </IconButton>
            <IconButton onFocus={() => setFocus("group")} onBlur={() => setFocus("")} sx={{ 
                border: '2px solid transparent', 
                color: "white", 
                mt: "0.2%", 
                ml: "0.8%", 
                borderColor: hasFocus === "group" ? 'white': '', 
            }}>
                <GroupsOutlined sx={{ fontSize: "3.5vmin" }} />
            </IconButton>            
            <IconButton onFocus={() => setFocus("user")} onBlur={() => setFocus("")} sx={{ 
                border: '2px solid transparent', 
                color: "white", 
                mt: "0.2%", 
                ml: "0.8%", 
                borderColor: hasFocus === "user" ? 'white': '', 
            }}>
                <PersonOutlined sx={{ fontSize: "3.5vmin" }} />
            </IconButton>
            <TextField
                margin="normal"
                id="search"
                label="Search"
                name="search"
                autoComplete="search"
                autoFocus
                sx={{ 
                    ml: "25%",
                    width: "30%",
                    input: {
                        background: "white",
                        height: "1.4vmin"
                    }
                }}
            />
            <Typography component="span" sx={{ ml: "28%", fontSize: "1.6vmin", fontWeight: "bold", color: "white"}} >
                SORT BY
            </Typography>
            <IconButton onClick={handleMenuOpen} sx={{ color: "white", mb: "0.5%" }}>
                <Sort sx={{ fontSize: "3.5vmin" }} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
                sx={{ width: "20%" }}
                PaperProps={{  
                    sx: {  
                      width: "40%",
                      height: "auto"  
                    },  
                 }} 
            >
                <MenuItem onClick={() => console.log("Name (A - Z)")} sx={{ fontSize: "1.2vmin" }}>Name (A - Z)</MenuItem>
                <MenuItem onClick={() => console.log("Publish Date (Newest)")} sx={{ fontSize: "1.2vmin" }}>Publish Date (Newest)</MenuItem>
                <MenuItem onClick={() => console.log("Listens (High - Low)")} sx={{ fontSize: "1.2vmin" }}>Listens (High - Low)</MenuItem>
                <MenuItem onClick={() => console.log("Likes (High - Low)")} sx={{ fontSize: "1.2vmin" }}>Likes (High - Low)</MenuItem>
                <MenuItem onClick={() => console.log("Dislikes (High - Low)")} sx={{ fontSize: "1.2vmin" }}>Dislikes (High - Low)</MenuItem>
            </Menu>
            <Box sx={{ display: 'flex', height: '85%', backgroundColor: 'blue' }}>
                <Box sx={{
                        ml: "1.5%",
                        flexDirection: 'column',
                        flex: 1,
                        // width: '60%',
                        // height: '80%',
                        backgroundColor: 'white',
                        // overflow: "hidden",
                        // overflowY: "scroll",
                    }}>
                    {
                        listCard
                    }
                    <MUIDeleteModal />
                </Box>
                <Box sx={{ width: '40%' }}>
                    TEST
                    <Box>
                        HOLD CONTROLS HERE
                    </Box>
                </Box>
            </Box>
            {bottom}
            {modals}
        </Box>
    )
}

export default HomeScreen;