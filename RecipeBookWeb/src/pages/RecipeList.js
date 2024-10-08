// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// component imports
import ListPage from '../components/ListPage';

// function imports
import { recipe_funcs, rec_cat_funcs } from 'recipe-book';
import { setRecents } from 'recipe-book/redux/userSlice';

const favorites = "Favorite"
const recents = "Recent"


function RecipeList({setHeader}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const category = location.state.category

    useEffect(() => {
        if (category == favorites || category == recents) setHeader(category + " Recipes")
        else setHeader(category.name + " Recipes")
    }, [category])

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useSelector(state=> state.user.value);



    // Get the recipes to display
    useEffect(() =>{
        // retrieve favorite / recent recipes (as specified in category var)
        const getUserRecipes = async ()=> {
            let ids;
            if (category == favorites) ids = user.favorites
            else ids = user.recents

            const recipes = []
            for (const id of ids) {
                const recipe = await recipe_funcs.getRecipe(id)
                recipes.push(recipe)
            }
            setData(recipes)

            setLoading(false);
        }

        // retrieve recipes in the specified category (not favorite / recent)
        const getRecipes = async ()=> {
            const recipes = await rec_cat_funcs.getRecipes(category._id)
            if (recipes == undefined) {
                alert("There are currently no recipes in this category")
                navigate("/categories", {state:{flavor: category.flavor_type}})
                return
            }

            recipes.push({name: "New"})

            setData(recipes)

            setLoading(false)
        }

        if (category == favorites || category == recents) getUserRecipes();
        else getRecipes()
    }, [user]);
    


    const selectRecipe = (recipe) => {
        // Navigate to the add recipe page when new recipe is selected
        if (recipe.name == "New") {
            navigate("/add-recipe", {state:{precategory: category}})
            return
        }
        
        // Navigate to the view recipe page when a recipe is selected
        let recents = [recipe._id].concat(user.recents)
        if (user.recents.includes(recipe._id)) {
            const set_recents = new Set(recents)
            recents = Array.from(set_recents)
        }
        dispatch(setRecents(recents))

        navigate("/view-recipe", {state:{recipe: recipe}})
    }



    // Show loading screen while waiting for data
    if (loading) {
        return(
            <div className="center-content">
                <h1 className="loading"> Loading... </h1>
            </div>
        )
    }

    return(
        <ListPage data={data} navigate={(item) => selectRecipe(item)}/>
    )
}

export default RecipeList;
