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
            console.log("ENTER PRESSED");
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
        handleLoadList(event, id);
        console.log(`CURRENT LIST: ${store.currentList}`);
        console.log(store.currentList);
        console.log(store.idNamePairs);
        setIsChecked(isChecked => !isChecked);
    }

    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        store.closeCurrentList();
    }
    function handlePublish() {
        store.showPublishListModal();
    }
    function handleDuplicate() {
        store.duplicateList(idNamePair)
    }

    let editToolbar = 
        <Box sx={{ mb: 1, pl: 1 }}>
            <IconButton disabled={!store.canAddNewSong()} onClick={handleAddNewSong} >
                <Add style={{fontSize:'28pt'}} />
            </IconButton>
            <IconButton sx={{ ml: 1 }} disabled={!store.canUndo()} onClick={handleUndo} >
                <Undo style={{fontSize:'28pt'}} />
            </IconButton>
            <IconButton sx={{ ml: 1 }} disabled={!store.canRedo()} onClick={handleRedo} >
                <Redo style={{fontSize:'28pt'}} />
            </IconButton>
            <IconButton sx={{ ml: 1 }} onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }} aria-label='delete'>
                <DeleteIcon style={{fontSize:'28pt'}} />
            </IconButton>
        </Box>;

    if (published) 
        editToolbar =
            <div id="edit-toolbar">
            </div>;
    

    // Toggle like and dislike based on published
    let likeAndDislike = "";
    if (!published) {
        likeAndDislike = 
        <Box sx={{ position: 'absolute', left: '50%' }}>
            <IconButton disabled={auth.isGuest}>
                <ThumbUpOutlined style={{fontSize:'48pt'}} />
            </IconButton>
            {idNamePair.likes}
            <IconButton disabled={auth.isGuest}>
                    <ThumbDownOutlined style={{fontSize:'48pt'}} />
            </IconButton>
            {idNamePair.dislikes}
        </Box>;


        // likeButton = 
        //     <Box sx={{ p: 1, margin: '0 auto' }}>
        //         <IconButton disabled={auth.isGuest}>
        //             <ThumbUpOutlined style={{fontSize:'48pt'}} />
        //         </IconButton>
        //         {idNamePair.likes}
        //     </Box>;
        // dislikeButton = 
        //     <Box sx={{ p: 1 }}>
        //         <IconButton disabled={auth.isGuest}>
        //             <ThumbDownOutlined style={{fontSize:'48pt'}} />
        //         </IconButton>
        //         {idNamePair.dislikes}
        //     </Box>;
    }
    // Show expand button normally, and show close if the button was pressed for the selected playlist
    let expand =
        <Box sx={{ p: 1 }}>
            <IconButton onClick={(event) => handleCollapse(event, idNamePair._id)}>
                <KeyboardDoubleArrowDown style={{fontSize:'48pt'}} />
            </IconButton>
        </Box>;
    if(isChecked && selected) 
        expand =
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => handleCollapse(event, idNamePair._id)}>
                    <KeyboardDoubleArrowUp style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>;
    // Show the songs from selected playlist and expand button pressed
    let songs = "";
    if(selected && store.currentList != null && isChecked) {
        songs =
            <Box>          
                <List 
                    sx={{ width: '100%', height: '300px' }}
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
                {editToolbar}  
            </Box>;
    }

    let cardElement = 
        <Box 
            onDoubleClick={handleToggleEdit}
            sx={{ 
            mt: "1%", 
            border: "2px solid white", 
            borderRadius: '30px', 
            display: 'block', 
            fontFamily: "Satisfy", 
            background: "linear-gradient(to bottom, #43b2ce 0%, #38f4f4 100%);",  
        }}>
            <ListItem >
                <Box sx={{ pl: 1, color: 'white'}}>
                    <Box sx={{ fontSize: 40, }}>
                        {idNamePair.name}
                    </Box>
                    <Box sx={{ fontSize: 20, color: 'black'}}>
                        By: {auth.user.userName}
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