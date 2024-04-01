// react imports
import React from 'react';
import {useNavigate} from "react-router-dom"

// component imports
import ListItem from '../components/ListItem';

function RecipeCategories() {
    const navigate = useNavigate()

    const data = [{
        text: "Cat 1",
        nav: () => navigate("/")
    },
    {
        text: "Cat 2",
        nav: () => navigate("/")
    },
    {
        text: "Cat 3",
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

export default RecipeCategories;
