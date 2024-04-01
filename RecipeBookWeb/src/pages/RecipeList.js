// react imports
import React from 'react';
import {useNavigate} from "react-router-dom"

// component imports
import ListItem from '../components/ListItem';

function RecipeList() {
    const navigate = useNavigate()

    const data = [{
        text: "Recipe 1",
        nav: () => navigate("/")
    },
    {
        text: "Recipe 2",
        nav: () => navigate("/")
    },
    {
        text: "Recipe 3",
        nav: () => navigate("/")
    }]

    return(
        <>
            <div>
                <h2>Title</h2>
                {data.map((item, index) => 
                    <ListItem text={item.text} navigate={item.nav} key={index} />
                )}
            </div>
        </>
    )
}

export default RecipeList;
