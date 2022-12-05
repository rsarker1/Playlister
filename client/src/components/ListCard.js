import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import AuthContext from '../auth'

import KeyboardDoubleArrowDown from '@mui/icons-material/KeyboardDoubleArrowDown';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import SongCard from './SongCard.js'

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const { idNamePair } = props;
    const [text, setText] = useState(idNamePair.name);
    const [isChecked, setIsChecked] = useState(false);

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        // if (!event.target.disabled) {
        //     let _id = event.target.id;
        //     if (_id.indexOf('list-card-text-') >= 0)
        //         _id = ("" + _id).substring("list-card-text-".length);

        //     console.log("load " + event.target.id);

        //     // CHANGE THE CURRENT LIST
        //     store.setCurrentList(id);
        // }
        console.log("load " + id);
        store.setCurrentList(id);
    }
    

    // useEffect(() => {
    //     store.setCurrentList();
    // }, []);

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleCollapse(event, id) {
        event.stopPropagation();
        console.log(`CURRENT LIST: ${store.currentList}`);
        console.log(`Passed in ID: ${id}`);
        console.log(store);
        handleLoadList(event, id);
        console.log(`CURRENT LIST: ${store.currentList}`);
        console.log(store.idNamePairs);
        setIsChecked(true);
    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ 
                mt: "1%", 
                border: "2px solid white", 
                borderRadius: '30px', 
                display: 'flex', 
                p: 1, 
                fontFamily: "Satisfy", 
                background: "linear-gradient(to bottom, #43b2ce 0%, #38f4f4 100%);",  
            }}
            style={{ width: '100%', fontSize: '48pt' }}
        >
            <Box sx={{ pl: 1, color: 'white'}}>
                <Box sx={{ fontSize: 40, }}>
                    {idNamePair.name}
                </Box>
                <Box sx={{ fontSize: 20, color: 'black'}}>
                    By: {auth.user.userName}
                </Box>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => handleCollapse(event, idNamePair._id)}>
                    <KeyboardDoubleArrowDown style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>
            <Collapse>
                cool
                {/* <Box>          
                    <List 
                        id="playlist-cards" 
                        sx={{ width: '100%', bgcolor: 'background.paper' }}
                    >
                        {
                            store.currentList.songs.map((song, index) => (
                                <SongCard
                                    id={'playlist-song-' + (index)}
                                    key={'playlist-song-' + (index)}
                                    index={index}
                                    song={song}
                                />
                            ))  
                        }
                    </List>  
                </Box> */}
            </Collapse>
        </ListItem>;
    if (store.currentList != null) {
        cardElement =
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ 
                    mt: "1%", 
                    border: "2px solid white", 
                    borderRadius: '30px', 
                    display: 'flex', 
                    p: 1, 
                    fontFamily: "Satisfy", 
                    background: "linear-gradient(to bottom, #43b2ce 0%, #38f4f4 100%);",  
                }}
                style={{ height: '10vmax', fontSize: '48pt' }}
            >
                <Box sx={{ pl: 1, color: 'white'}}>
                    <Box sx={{ fontSize: 40, }}>
                        {idNamePair.name}
                    </Box>
                    <Box sx={{ fontSize: 20, color: 'black'}}>
                        By: {auth.user.userName}
                    </Box>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={handleToggleEdit} aria-label='edit'>
                        <EditIcon style={{fontSize:'48pt'}} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                            handleDeleteList(event, idNamePair._id)
                        }} aria-label='delete'>
                        <DeleteIcon style={{fontSize:'48pt'}} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => handleCollapse(event, idNamePair._id)}>
                        <KeyboardDoubleArrowDown style={{fontSize:'48pt'}} />
                    </IconButton>
                </Box>
            </ListItem>;
    }

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                InputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;