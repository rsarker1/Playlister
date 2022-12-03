import React, { useContext, useEffect } from 'react'
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
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import TextField from "@mui/material/TextField";

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.closeCurrentList();
        store.loadIdNamePairs();
    }, []);

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
            <IconButton sx={{ color: "white", mt: 1 }}>
                <HomeOutlined sx={{ fontSize: "3vmin" }} />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
                <GroupsOutlined sx={{ fontSize: "3vmin", mt: 1 }} />
            </IconButton>            
            <IconButton sx={{ color: "white" }}>
                <PersonOutlined sx={{ fontSize: "3vmin", mt: 1 }} />
            </IconButton>
            <TextField
                    margin="normal"
                    id="search"
                    label="Search"
                    name="search"
                    autoComplete="search"
                    autoFocus
                    sx={{ 
                        ml: 10
                    }}
                />
            <Box sx={{
                    ml: 5,
                    flexDirection: 'column',
                    width: '60%',
                    height: '80%',
                    backgroundColor: 'white'
                }}>
                test
            </Box>
        </Box>
    )
}

export default HomeScreen;