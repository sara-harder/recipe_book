// react imports
import React from 'react';

function ListItem({text, navigate}) {
    return(
        <div>
            <div>Replace with image</div>
            <div onClick={navigate}>{text}</div>
        </div>
    )
}

export default ListItem
