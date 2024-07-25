// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';

// component imports
import ListItem from '../components/ListItem';

// function imports
import { helpers, recipe_funcs, rec_cat_funcs } from 'recipe-book';

const favorites = "Favorite"
const recents = "Recent"

const user = {
    favorites: ["669542c0f79b4cf01aa2ba14", "669542c0f79b4cf01aa2ba12"],
    recents: ["669542c0f79b4cf01aa2ba12"]
}

function RecipeList({setHeader}) {
    const navigate = useNavigate()
    const location = useLocation();
    const category = location.state.category

    if (category == favorites || category == recents) setHeader(category + " Recipes")
    else setHeader(category.name + " Recipes")

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get the recipes to display
    useEffect(() =>{
        const getUserRecipes = async ()=> {
            let ids;
            if (category == favorites) ids = user.favorites
            else ids = user.recents

            const data = []
            for (const id of ids) {
                const recipe = await recipe_funcs.getRecipe(id)
                data.push(recipe)
            }
            setData(data)

            setLoading(false);
        }

        const getRecipes = async ()=> {
            const recipes = await rec_cat_funcs.getRecipes(category._id)
            setData(recipes)

            setLoading(false)
        }

        if (category == favorites || category == recents) getUserRecipes();
        else getRecipes()
    }, []);

    const rows = helpers.createFlexTable(5, data.length)
    
    // Show loading screen while waiting for data
    if (loading) {
        return  <h1 className='loading'> Loading... </h1>
    }


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
