// react imports
import React from 'react';
import {useNavigate} from "react-router-dom"

// function imports
import { createFlexTable } from 'recipe-book';

// component imports
import ListItem from '../components/ListItem';

function RecipeList({setHeader}) {
    setHeader("Recipes")
    const navigate = useNavigate()

    const data = [{
        text: "Recipe 1",
        nav: () => navigate("/view-recipe")
    },
    {
        text: "Recipe 2",
        nav: () => navigate("/view-recipe")
    },
    {
        text: "Recipe 3",
        nav: () => navigate("/view-recipe")
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

export default RecipeList;
