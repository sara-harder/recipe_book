// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


// component imports
import ListItem from '../components/ListItem';

// function imports
import { helpers, recipe_funcs, rec_cat_funcs } from 'recipe-book';
import { setRecents } from 'recipe-book/redux/userSlice';

const favorites = "Favorite"
const recents = "Recent"


function RecipeList({setHeader}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const category = location.state.category

    if (category == favorites || category == recents) setHeader(category + " Recipes")
    else setHeader(category.name + " Recipes")

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useSelector(state=> state.user.value);

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
    }, [user]);

    const rows = helpers.createFlexTable(5, data.length)
    
    // Show loading screen while waiting for data
    if (loading) {
        return  <h1 className='loading'> Loading... </h1>
    }

    // Navigate to the view recipe page when a recipe is selected
    const selectRecipe = (recipe) => {
        let recents = [recipe._id].concat(user.recents)
        if (user.recents.includes(recipe._id)) {
            const set_recents = new Set(recents)
            recents = Array.from(set_recents)
        }
        dispatch(setRecents(recents))

        navigate("/view-recipe", {state:{recipe: recipe}})
    }


    return(
        <>
            <table className='recipe-table'>
                <tbody>
                    {rows.map((row, index) => 
                        <tr key={index}>
                        {(data.slice(row[0], row[1])).map((item, index) => 
                            <td><ListItem text={item.name} navigate={() => selectRecipe(item)} key={index} /></td>
                        )}
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}

export default RecipeList;
