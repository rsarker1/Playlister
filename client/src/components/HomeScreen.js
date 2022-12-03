import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
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

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [hasFocus, setFocus] = useState("home");
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        store.closeCurrentList();  // REMOVE
        store.loadIdNamePairs(); // REMOVE
    }, []);
    // No more verify call for guest, which is kinda a good thing?

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    return (
        <Box sx={{ 
                minWidth: '100%',
                height: "100%", 
                background: "linear-gradient(to bottom, #2193B0 0%, #6DD5ED 50%, #00FAC8 100%);",
            }}> 
            {/* <div id="list-selector-heading">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </div> */}
            {/* sx={{ 
                                    fontSize: "3.5vmin",  
                                    "&.Mui-selected": {},
                                    "&.Mui-focusVisible": {
                                      border: "3px solid #F2A42A"
                                    },
                                    ":hover": {
                                      border: "3px solid #F2A42A"
                                    }
                                }} */}
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
                        background: "white"
                    }
                }}
            />
            <Typography component="span" sx={{ ml: "30%", fontSize: "1.6vmin", fontWeight: "bold", color: "white"}} >
                SORT BY
            </Typography>
            {/* <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    id={menuId}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => sort("Publish Date (Newest)")}>Publish Date (Newest)</MenuItem>
                    <MenuItem onClick={() => sort("Publish Date (Oldest)")}>Publish Date (Oldest)</MenuItem>
                    <MenuItem onClick={() => sort("Views")}>Views</MenuItem>
                    <MenuItem onClick={() => sort("Likes")}>Likes</MenuItem>
                    <MenuItem onClick={() => sort("Dislikes")}>Dislikes</MenuItem>
            </Menu> */}
            <IconButton sx={{ color: "white", mb: "0.5%" }}>
                <Sort sx={{ fontSize: "3.5vmin" }} />
            </IconButton>
            <Box sx={{
                    mt: "0.5%",
                    ml: "1.5%",
                    flexDirection: 'column',
                    width: '60%',
                    height: '80%',
                    // backgroundColor: 'white'
                }}>
                {
                    listCard
                }
            </Box>
        </Box>
    )
}

export default HomeScreen;