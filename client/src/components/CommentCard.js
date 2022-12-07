import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';

function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { author, text } = props;

    let comment = `${author} : ${text}`
    return (
        <Box>
            {comment}
        </Box>
    );
}

export default CommentCard;