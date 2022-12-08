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
import FastRewindOutlined from '@mui/icons-material/FastRewindOutlined';
import FastForwardOutlined from '@mui/icons-material/FastForwardOutlined';
import Stop from '@mui/icons-material/Stop';
import PlayArrowOutlined from '@mui/icons-material/PlayArrowOutlined';
import TextField from "@mui/material/TextField";
import Sort from '@mui/icons-material/Sort';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import YouTube from 'react-youtube'
import CommentCard from './CommentCard'
import YouTubePlayerModule from './YouTubePlayerReact';

import AuthContext from '../auth'

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [hasFocus, setFocus] = useState("home");
    const [anchorEl, setAnchorEl] = useState(null);
    const [text, setText] = useState(null);
    const [comment_text, setComment] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const [playerReveal, setPlayerReveal] = useState(true);
    const [commentsReveal, setCommentsReveal] = useState(false);
    //store.showAllUserView();
    useEffect(() => {
        if(auth.isGuest) 
            console.log();
        else {
            store.loadIdNamePairs();
        }
    }, []);


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
    function handleSelf() {
        store.loadIdNamePairs();
    }
    function handleAll() {
        store.loadPP();
    }
    function handleUsers() {
        console.log('ATTEMPT TO SHOW ALL USERS');
        store.loadPPUsers();
    }
    function handleKeyPress(event) {
        if (event.code === "Enter") 
            store.searchPlaylists(text);
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let listCard = "";
    if (store) {
        if(store.currentList != null) 
            store.idNamePairs.forEach((pair) => { pair.selected = (pair._id === store.currentList._id) });
        console.log('CHECKING IDNAMEPAIRS');
        console.log(store.idNamePairs);
        listCard = 
            <List>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={pair.selected}
                        published={pair.isPublished}
                    />
                ))
            }
            </List>;
    }
    // YOUTUBE PLAYER
    let youtubePlayer = "";
    let info = "";
    let playlist = [];
    let [currentSong, setCurrentSong] = useState(0);

    const playerOptions = {
        height: '394',
        width: '700',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };
    function moveNext() {
        incSong();
        //loadAndPlayCurrentSong(youtubePlayer);
    }
    function movePrevious() {
        decSong();
        //loadAndPlayCurrentSong(youtubePlayer);
    }
    function playerPause() {
        if(youtubePlayer)
            youtubePlayer.pauseVideo();
    }
    function playerPlay() {
        if (youtubePlayer) 
            youtubePlayer.playVideo();
    }
    function incSong() {
        setCurrentSong(currentSong++);
        setCurrentSong(currentSong % playlist.length);
    }
    function decSong() {
        setCurrentSong(currentSong--);
        console.log(currentSong);
        console.log(playlist.length);
        if (currentSong < 0) {
            currentSong = playlist.length - 1;
            setCurrentSong(currentSong);
        }
        console.log("index: " + currentSong);
        setCurrentSong(currentSong % playlist.length);
    }
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
    }
    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
        youtubePlayer = event.target;
    }
    function onPlayerStateChange(event) {
        let stat = event.data;
        let player = event.target;
        if (stat === -1) {
            // VIDEO UNSTARTED
            console.log("-1: Video unstarted");
        } else if (stat === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0: Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (stat === 1) {
            // THE VIDEO IS PLAYED
            console.log("1: Video played");
        } else if (stat === 2) {
            // THE VIDEO IS PAUSED
            console.log("2: Video paused");
        } else if (stat === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3: Video buffering");
        } else if (stat === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5: Video cued");
        }
    }
    if (!store.isCurrentListNull() && store.getPlaylistSize() > 0) {
        let songs = store.currentList.songs;
        console.log(`SONGS FOR THIS LIST`);
        console.log(songs);
        console.log(store.currentList);
        playlist = songs.map((song) => (song.youTubeId));
        youtubePlayer = 
            <Box sx={{ ml: '15%' }}>
                <YouTube
                    videoId={playlist[currentSong]}
                    opts={playerOptions}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}  />
                <Box sx={{ ml: '25%' }}>
                    <IconButton disabled={store.isCurrentListNull()} onClick={movePrevious} >
                        <FastRewindOutlined sx={{ fontSize:'25pt' }} />
                    </IconButton>
                    <IconButton disabled={store.isCurrentListNull()} onClick={playerPlay} >
                        <PlayArrowOutlined sx={{ fontSize:'25pt' }} />
                    </IconButton>
                    <IconButton disabled={store.isCurrentListNull()} onClick={playerPause} >
                        <Stop sx={{ fontSize:'25pt' }} />
                    </IconButton>
                    <IconButton disabled={store.isCurrentListNull()} onClick={moveNext} >
                        <FastForwardOutlined sx={{ fontSize:'25pt' }} />
                    </IconButton>
                </Box>
            </Box>;
        info = 
            <Box sx={{ color: 'white', fontSize: 48, ml: '15%' }}>
                <Typography sx={{ fontSize: 28 }}>
                    Playlist: {store.currentList.name}
                </Typography>
                <Typography sx={{ fontSize: 28 }}>
                    Songs #: {currentSong + 1}
                </Typography>
                <Typography sx={{ fontSize: 28 }}>
                    Title: {store.currentList.songs[currentSong].title}
                </Typography>
                <Typography sx={{ fontSize: 28 }}>
                    Artist #: {store.currentList.songs[currentSong].artist}
                </Typography>
            </Box>;
    }

    function revealPlayer() {
        if(!store.isCurrentListNull() && store.currentList.isPublished) {
            setPlayerReveal(true);
            setCommentsReveal(false);
            console.log('REVEALING PLAYER');
        }
    }
    // COMMENTS
    let comments = "";
    let comments_box = "";

    function handleSubmitComment(event) {
        if (event.code === "Enter") {
            store.addCommentToPlaylist(auth.user.userName, comment_text);
            setComment("");
        }
    }
    function handleUpdateComment(event) {
        setComment(event.target.value);
    }

    if (!store.isCurrentListNull() && store.getPlaylistSize() > 0 && store.currentList.isPublished) {
        console.log('CHECKING COMMENTS');
        comments = 
            store.currentList.comments.map((comment) => (
                <CommentCard
                    author={comment.author}
                    text={comment.text}
                />
            ))  
        comments_box =
            <Box sx={{ backgroundColor: 'white', display: commentsReveal ? 'block' : 'none' }}>
                {comments}
                <TextField
                    margin="normal"
                    id="search"
                    label="Search"
                    name="search"
                    autoComplete="search"
                    autoFocus
                    onKeyPress={handleSubmitComment}
                    onChange={handleUpdateComment}
                    sx={{ 
                        width: "30%",
                        input: {
                            background: "white",
                            height: "1.4vmin"
                        }
                    }}
                />
            </Box>;
    }

    function revealComments() {
        if(!store.isCurrentListNull() && store.currentList.isPublished) {
            setPlayerReveal(false);
            setCommentsReveal(true);
            console.log('REVEALING COMMENTS');
            console.log(store.currentList.comments);
        }
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
            <IconButton onFocus={() => setFocus("home")} disabled={auth.isGuest} onClick={handleSelf} sx={{ 
                border: '2px solid transparent', 
                color: "white", 
                mt: "0.2%", 
                ml: "0.8%", 
                borderColor: hasFocus === "home" ? 'white': '', 
            }}>
                <HomeOutlined sx={{ fontSize: "3.5vmin"}} />
            </IconButton>
            <IconButton onFocus={() => setFocus("group")} disabled={auth.isGuest} onClick={handleAll} sx={{ 
                border: '2px solid transparent', 
                color: "white", 
                mt: "0.2%", 
                ml: "0.8%", 
                borderColor: hasFocus === "group" ? 'white': '', 
            }}>
                <GroupsOutlined sx={{ fontSize: "3.5vmin" }} />
            </IconButton>            
            <IconButton onFocus={() => setFocus("user")} disabled={auth.isGuest} onClick={handleUsers} sx={{ 
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
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
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
            <Box sx={{ display: 'flex', height: '85%' }}>
                <Box sx={{
                        ml: "1%",
                        flexDirection: 'column',
                        flexGrow: 1,
                        //backgroundColor: 'white',
                        overflowY: 'scroll',
                        overflowX: 'hidden'
                    }}>
                    {
                        listCard
                    }
                    <MUIDeleteModal />
                </Box>
                <Box sx={{ width: '40%' }}>
                    <Button sx={{ color: 'white', border: '2px solid white' }} onClick={revealPlayer}>
                        Player
                    </Button>
                    <Button sx={{ color: 'white', border: '2px solid white' }} onClick={revealComments}>
                        Comments
                    </Button>
                    <Box sx={{ display: playerReveal ? 'block' : 'none' }}>
                        {youtubePlayer}
                        {info}
                    </Box>
                    {comments_box}
                </Box>
            </Box>
            {bottom}
            {modals}
        </Box>
    )
}

export default HomeScreen;