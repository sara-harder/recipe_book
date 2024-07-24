// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import {useLocation} from 'react-router-dom';

// function imports
import { helpers } from 'recipe-book';
import { rec_cat_funcs } from 'recipe-book';

// component imports
import ListItem from '../components/ListItem';

function RecipeList({setHeader}) {
    const navigate = useNavigate()
    const location = useLocation();
    const category = location.state.category

    setHeader(category.name + " Recipes")

    const [data, setData] = useState([]);

    // Get the recipes to display
    useEffect(() =>{
        const getRecipes = async ()=> {
            const recipes = await rec_cat_funcs.getRecipes(category._id)
            setData(recipes)
        }
        getRecipes()
    }, []);

    const rows = helpers.createFlexTable(5, data.length)

    return(
        <>
            <table className='recipe-table'>
                <tbody>
                    {rows.map((row, index) => 
                        <tr key={index}>
                        {(data.slice(row[0], row[1])).map((item, index) => 
                            <td><ListItem text={item.name} navigate={() => navigate("/view-recipe", {state:{recipe: item}})} key={index} /></td>
                        )}
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}

export default RecipeList;
