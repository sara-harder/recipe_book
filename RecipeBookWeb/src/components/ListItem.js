// react imports
import React from 'react';

// style imports
import '../styling/Lists.css';

function ListItem({text, navigate}) {
    return(
        <div  onClick={navigate} className="item">
            <div className="image"></div>
            <h3>{text}</h3>
        </div>
    )
}

export default ListItem
