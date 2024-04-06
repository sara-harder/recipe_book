// react imports
import React from 'react';
import {useNavigate} from "react-router-dom"

// function imports
import { createFlexTable } from '../../../functionality/helpers';

// component imports
import ListItem from '../components/ListItem';

function RecipeCategories({setHeader}) {
    setHeader("S Recipes")
    const navigate = useNavigate()

    const data = [{
        text: "Cat 1",
        nav: () => navigate("/recipes")
    },
    {
        text: "Cat 2",
        nav: () => navigate("/recipes")
    },
    {
        text: "Cat 3",
        nav: () => navigate("/recipes")
    },
    {
        text: "Cat 4",
        nav: () => navigate("/recipes")
    },
    {
        text: "Cat 5",
        nav: () => navigate("/recipes")
    },
    {
        text: "Cat 6",
        nav: () => navigate("/recipes")
    },
    {
        text: "Cat 7",
        nav: () => navigate("/recipes")
    },
    {
        text: "Cat 8",
        nav: () => navigate("/recipes")
    }]

    const rows = createFlexTable(5, data.length)

    return(
        <>
            <table className='recipe-table'>
                <tbody>
                    {rows.map((row, index) => 
                        <tr key={index}>
                        {(data.slice(row[0], row[1])).map((item, index) => 
                            <td><ListItem text={item.text} navigate={item.nav} key={index} /></td>
                        )}
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}

export default RecipeCategories;
