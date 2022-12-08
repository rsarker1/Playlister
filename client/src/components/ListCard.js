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
import KeyboardDoubleArrowUp from '@mui/icons-material/KeyboardDoubleArrowUp';
import ThumbUpOutlined from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlined from '@mui/icons-material/ThumbDownOutlined';
import Add from '@mui/icons-material/Add';
import Redo from '@mui/icons-material/Redo';
import Undo from '@mui/icons-material/Undo';
import Close from '@mui/icons-material/HighlightOff';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import SongCard from './SongCard.js'

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const { idNamePair, selected, published } = props;
    const [text, setText] = useState(idNamePair.name);
    const [isChecked, setIsChecked] = useState(false);

    async function handleLoadList(event, id) {
        event.stopPropagation();
        if(event.detail === 2 && !published) 
            return handleToggleEdit(event);
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            // COULD MAKE A STORE REDUCER CLASS CALLED store.playingList
            // AFTER ATTEMPTING RENAME SEARCH IF SAME NAME ALREADY USED THEN ERROR MODAL
            //store.publishList().then(() => {another functrion} );

            if(auth.user.userName === idNamePair.ownerUserName)
                store.setCurrentList(id);
            else
                store.setPlayerList(idNamePair);
            //store.setCurrentList(id);
            console.log('ERROR WITH PLAYER HERE?');
            console.log(selected);
            console.log(published);
            console.log(!isChecked);
            if(selected && published && !isChecked)
                store.increaseListens(id);
        }
    }
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

    async function handleCollapse(event, id) {
        event.stopPropagation();
        store.setCurrentList(id);
        setIsChecked(isChecked => !isChecked);
    }

    function handleClose(event) {
        event.stopPropagation();
        store.closeCurrentList();
        console.log(`CLOSED LIST`);
        console.log(store.currentList);
        setIsChecked(isChecked => !isChecked);
    }

    function handleAddNewSong(event) {
        event.stopPropagation();
        store.addNewSong();
    }
    function handleUndo(event) {
        event.stopPropagation();
        store.undo();
    }
    function handleRedo(event) {
        event.stopPropagation();
        store.redo();
    }
    function handlePublish(event) {
        event.stopPropagation();
        console.log('PUBLISHING')
        console.log(store.currentList);
        console.log(idNamePair._id);
        store.publishList();
    }
    function handleDuplicate(event) {
        event.stopPropagation();
        store.duplicateList(idNamePair)
    }
    function handleLike(event) {
        event.stopPropagation();
        store.addLike(idNamePair._id, auth.user.userName);
    }
    function handleDislike(event) {
        event.stopPropagation();
        store.addDislike(idNamePair._id, auth.user.userName)
    }
    // Edit toolbar for songs
    let editToolbar = 
        <Box sx={{ mt: 1, pl: 1 }}>
            <IconButton disabled={!store.canAddNewSong() || store.currentModal !== 'NONE'} onClick={handleAddNewSong} >
                <Add style={{fontSize:'28pt'}} />
            </IconButton>
            <IconButton sx={{ ml: 1 }} disabled={!store.canUndo() || store.currentModal !== 'NONE'} onClick={handleUndo} >
                <Undo style={{fontSize:'28pt'}} />
            </IconButton>
            <IconButton sx={{ ml: 1 }} disabled={!store.canRedo() || store.currentModal !== 'NONE'} onClick={handleRedo} >
                <Redo style={{fontSize:'28pt'}} />
            </IconButton>
            <IconButton sx={{ ml: 1 }} onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }} aria-label='delete'>
                <DeleteIcon style={{fontSize:'28pt'}} />
            </IconButton>
            <Button disabled={auth.isGuest} sx={{ 
                color: 'white', 
                position: 'absolute', 
                right: '200px', 
                fontSize: 15, 
                border: '2px solid white' }}
                onClick={handlePublish}>
                Publish
            </Button>
            <Button disabled={auth.isGuest} sx={{ 
                color: 'white', 
                position: 'absolute', 
                right: '50px', 
                fontSize: 15, 
                border: '2px solid white' }}
                onClick={handleDuplicate}>
                Duplicate
            </Button>
        </Box>;
    // Change if published list
    if (published) 
        editToolbar =
            <Box sx={{ mt: 1, pl: 1, width: '100%', height: '50px', }}>
                <Button disabled={auth.isGuest} sx={{ 
                    color: 'white', 
                    position: 'absolute', 
                    right: '50px', 
                    fontSize: 15, 
                    border: '2px solid white' }}
                    onClick={handleDuplicate}>
                    Duplicate
                </Button>
            </Box>;
    

    // Toggle like and dislike based on published
    let likeAndDislike = "";
    if (published) {
        likeAndDislike = 
        <Box sx={{ position: 'absolute', left: '50%' }}>
            <IconButton disabled={auth.isGuest} onClick={handleLike}>
                <ThumbUpOutlined style={{fontSize:'48pt'}} />
            </IconButton>
            {idNamePair.likes.length}
            <IconButton disabled={auth.isGuest} onClick={handleDislike}>
                    <ThumbDownOutlined style={{fontSize:'48pt'}} />
            </IconButton>
            {idNamePair.dislikes.length}
            <Box sx={{ pl: 1 }} style={{fontSize: '15pt'}}>
                Listens: {idNamePair.listens}
            </Box>
        </Box>;
    }
    // Show expand button normally, and show close if the button was pressed for the selected playlist
    let expand =
        <Box sx={{ p: 1, ml: 'auto' }}>
            <IconButton onClick={(event) => handleCollapse(event, idNamePair._id)}>
                <KeyboardDoubleArrowDown style={{fontSize:'48pt'}} />
            </IconButton>
        </Box>;
    if(isChecked && selected && store.currentList != null) 
        expand =
            <Box sx={{ p: 1, ml: 'auto' }}>
                <IconButton onClick={handleClose}>
                    <KeyboardDoubleArrowUp style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>;
    // Show the songs from selected playlist and expand button pressed
    let songs = "";
    if(selected && store.currentList != null && isChecked) {
        songs =
            <Box>          
                <List 
                    sx={{ width: '100%', height: '300px', overflow: 'auto', border: "3px solid white", borderRadius: '30px', }}
                >
                    {
                        store.currentList.songs.map((song, index) => (
                            <SongCard
                                id={'playlist-song-' + (index)}
                                key={'playlist-song-' + (index)}
                                index={index}
                                song={song}
                                published={published}
                            />
                        ))  
                    }
                </List>
                {editToolbar}  
            </Box>;
    }

    let cardElement = 
        <Box 
            sx={{ 
            mt: "1%", 
            border: "2px solid white", 
            borderRadius: '30px', 
            display: 'block', 
            fontFamily: "Satisfy", 
            background: "linear-gradient(to bottom, #43b2ce 0%, #38f4f4 100%);",  
        }}>
            <ListItem id={idNamePair._id} key={idNamePair._id} onClick={(event) => handleLoadList(event, idNamePair._id)}>
                <Box sx={{ pl: 1, color: 'white'}}>
                    <Box sx={{ fontSize: 40, }}>
                        {idNamePair.name}
                    </Box>
                    <Box sx={{ fontSize: 20, color: 'black'}}>
                        By: {idNamePair.ownerUserName}
                    </Box>
                    <Box sx={{ display: published ? 'inline' : 'none', fontSize: 20, color: 'black'}}>
                        Published: {idNamePair.publishedDate}
                    </Box>
                </Box>
                {expand}
                {likeAndDislike}
            </ListItem>
            {songs}
        </Box>;

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