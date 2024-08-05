// react imports
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';

// style imports
import '../styling/Home.css';

// function imports
import { helpers, recipe_funcs } from 'recipe-book';
import { setRecents } from 'recipe-book/redux/userSlice';

const favorites = "Favorites"
const recents = "Recents"
const savory = "Savory"
const sweet = "Sweet"


const Recipe = ({name, image, nav}) => {
    if (!image) {
        return(
            <>
                <div onClick={nav} className="recipe">
                    <div className='item'>
                        <div className='no-image'>
                            <h3>{name}</h3>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return(
        <>
            <div onClick={nav} className="recipe">
                <div className="thumbnail"></div>
                <div>{name}</div>
            </div>
        </>
    )
}

const HorizontalRecipe = ({title, nav}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [recipe_data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    const user = useSelector(state=> state.user.value);

    // Get the recipes to display in this row for favorites/recents
    useEffect(() =>{
        const getUserRecipes = async ()=> {
            let ids;
            if (title == favorites) ids = user.favorites.slice(0, 5)
            else ids = user.recents.slice(0, 5)

            const data = []
            for (const id of ids) {
                const recipe = await recipe_funcs.getRecipe(id)
                data.push(recipe)
            }
            setData(data)

            setLoading(false);
        }
        if (title == favorites || title == recents) getUserRecipes()
    }, [user]);

    // Get the recipes to display in this row for sweet/savory
    useEffect(() => {
        const getCatRecipes = async ()=> {
            const recipes = await helpers.getRandomRecipes(title)
            setData(recipes)

            setLoading(false)
        }
        if (title == savory || title == sweet) getCatRecipes();
    }, [])

    // Navigate to the view recipe page when a recipe is selected
    const selectRecipe = (recipe) => {
        let recents = [recipe._id].concat(user.recents)
        if (user.recents.includes(recipe._id)) {
            const set_recents = new Set(recents)
            recents = Array.from(set_recents)
        }
        dispatch(setRecents(recents))

        navigate("view-recipe", {state:{recipe: recipe}})
    }

    if (loading) {
        return(
            <>
                <div className="row wide">
                    <div className='home_rows'><h2 className="left">{title}</h2></div>
                    <div onClick={nav} className="right home_rows">See All</div>
                </div>
                <div className="no-thumbs">
                    <h3 className='loading'> Loading... </h3>
                </div>
            </>
        )
    }

    // Row of recipe examples with See All button
    return (
        <>
            <div>
                <div className="row wide">
                    <div className='home_rows'><h2 className="left">{title}</h2></div>
                    <div onClick={nav} className="right home_rows">See All</div>
                </div>
                <table>
                    <tbody>
                        <tr>
                            {recipe_data.map((item, index) => 
                                <td>
                                    <Recipe name={item.name} image={item.image} nav={()=>selectRecipe(item)} key={index}/>
                                </td>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

function HomePage({setHeader}) {
    setHeader("My Recipes")
    const navigate = useNavigate()

    return(
        <>
            <div>
                <HorizontalRecipe title={favorites} nav={()=>navigate("recipes", {state:{category: "Favorite"}})} />
                <HorizontalRecipe title={recents} nav={()=>navigate("recipes", {state:{category: "Recent"}})} />
                <HorizontalRecipe title={savory} nav={()=>navigate("categories", {state:{flavor: savory}})} />
                <HorizontalRecipe title={sweet} nav={()=>navigate("categories", {state:{flavor: sweet}})} />
            </div>
        </>
    )
}

export default HomePage